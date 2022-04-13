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

module.exports = { postNewReport };