const Report = require("../../../models/Report.model");
const { checkId, throwError } = require("../../generalFunctions");

const getReportFunctions = {};

getReportFunctions.getAllReports = async () => {
    const reportsOrder = [{ boolean: false, order: 1 }, { boolean: true, order: -1 }];
    const reports = [];
    for (let i = 0; i < reportsOrder.length; i += 1) {
        const foundReports = await Report.find({ fixed: reportsOrder[i].boolean }, { __v: 0 }).populate({
            path: "comments",
            select: "-report -__v",
            options: { sort: { createdAt: 1 } },
            limit: 3,
            populate: { path: "user", select: "username name profileImage" }
        }).populate("user", "username name profileImage").sort({ createdAt: reportsOrder[i].order });

        reports.push(...foundReports);
    };
    return reports;
};

const findReport = async reportId => {
    const report = await Report.findOne({ _id: reportId }, { __v: 0 }).populate({
        path: "comments",
        select: "-report -__v",
        options: { sort: { createdAt: 1 } },
        populate: { path: "user", select: "username name profileImage" }
    }).populate("user", "username name profileImage");
    return report;
};

getReportFunctions.getOneReport = async reportId => {
    checkId(reportId, "report")
    const report = await findReport(reportId);
    if (!report) throwError("Provided _id for the report does not match any report in our database!", 404);
    return report;
};

module.exports = getReportFunctions;