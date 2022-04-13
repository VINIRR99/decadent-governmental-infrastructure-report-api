const Report = require("../../../models/Report.model");
const User = require("../../../models/User.model");

const checkReportCreationInputs = async (userId, inputs) => {
    const { description, image, location  } = await inputs;

    if (!image) {
        const error = new Error("Image is required!");
        error.status = 400;
        throw error;
    };

    if (!location) {
        const error = new Error("Location is required!");
        error.status = 400;
        throw error;
    };

    const checkedInputs = { image, location };
    if (description) checkedInputs.description = description;
    checkedInputs.user = userId;

    return checkedInputs;
};

const createReport = async newReport => {
    const { _id: reportId, user: userId } = await Report.create(newReport);
    await User.findByIdAndUpdate(userId, { $push: { reports: reportId } });

    const cretedReport = await Report.findById(reportId, { __v: 0 }).populate("user", "username name profileImage");

    return cretedReport;
};

const postNewReport = async (userId, inputs) => {
    const checkedInputs = await checkReportCreationInputs(userId, inputs);
    const newReport = await createReport(checkedInputs);
    return newReport;
};

const checkUpudateReportInputs = async (reportId, inputs) => {

    if (!(reportId.length === 24) || !/^[a-z0-9]+$/.test(reportId)) {
        const error = new Error("Provided _id for the report is invalid!");
        error.status = 400;
        throw error;
    };

    const { description, image, location, fixed } = await inputs;

    const checkedInputs = {};
    if (description) checkedInputs.description = description;
    if (image) checkedInputs.image = image;
    if (location) checkedInputs.location = location;
    if (fixed) {
        if (typeof(fixed) !== "boolean") {
            const error = new Error("fixed field must always be a boolean!");
            error.status = 400;
            throw error;
        };
        checkedInputs.fixed = fixed;
    };

    return checkedInputs;
};

const updateReport = async (reportId, userId, inputs) => {
    const checkedInputs = await checkUpudateReportInputs(reportId, inputs);
    const updatedReport = await Report.findOneAndUpdate({ _id: reportId, user: userId }, checkedInputs, { new: true })
        .select("-__v").populate("user", "username name profileImage");
    return updatedReport;
};

module.exports = { postNewReport, updateReport };