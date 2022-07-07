const Report = require("../../../models/Report.model");
const User = require("../../../models/User.model");
const Comment = require("../../../models/Comment.model");
const { throwError, checkId } = require("../../generalFunctions");

const reportFunctions = {};

const checkReportCreationInputs = async (userId, inputs) => {
    const { description  } = await inputs;

    if (!description) throwError("Description is required!", 400);

    const checkedInputs = { description, user: userId };

    return checkedInputs;
};

const createReport = async newReport => {
    const { _id: reportId, user: userId } = await Report.create(newReport);
    await User.findByIdAndUpdate(userId, { $push: { reports: reportId } });

    const cretedReport = await Report.findById(reportId, { __v: 0 }).populate("user", "username name profileImage");

    return cretedReport;
};

reportFunctions.postNewReport = async (userId, inputs) => {
    const checkedInputs = await checkReportCreationInputs(userId, inputs);
    const newReport = await createReport(checkedInputs);
    return newReport;
};

const checkUpudateReportInputs = async (reportId, inputs) => {
    checkId(reportId, "report");

    const { description, image, fixed } = await inputs;

    const checkedInputs = {};
    if (description) checkedInputs.description = description;
    if (image) checkedInputs.image = image;
    if (fixed !== undefined) {
        if (typeof(fixed) !== "boolean") throwError("fixed field must always be a boolean!", 400);
        checkedInputs.fixed = fixed;
    };

    return checkedInputs;
};

reportFunctions.updateReport = async (reportId, userId, inputs) => {
    const checkedInputs = await checkUpudateReportInputs(reportId, inputs);
    const updatedReport = await Report.findOneAndUpdate({ _id: reportId, user: userId }, checkedInputs, { new: true })
        .select("-__v").populate("user", "username name profileImage").populate({
            path: "comments",
            select: "-__v -report",
            options: { sort: { createdAt: 1 } },
            populate: { path: "user", select: "username name profileImage" }
        });
    if (!updatedReport) throwError("The provided _id for the report does not match any report you posted!", 404);
    return updatedReport;
};

const removeReport = async (reportId, userId) => {
    const deletedReport = await Report.findOneAndDelete({ _id: reportId, user: userId }).select("comments -_id");
    if (!deletedReport) throwError("The provided _id for the report does not match any report you posted!", 404);
    await Comment.deleteMany({ report: reportId });
    await User.findByIdAndUpdate(userId, { $pull: { reports: reportId } });

    const { comments: commentsId, _id } = await deletedReport;
    await User.updateMany({ comments: { $in: commentsId } }, { $pull: { comments: { $in: commentsId } } });
    await User.updateMany({ readLater: { $in: reportId } }, { $pull: { readLater: reportId } });
};

reportFunctions.deleteReport = async (reportId, userId) => {
    checkId(reportId, "report");
    await removeReport(reportId, userId);
};

module.exports = reportFunctions;