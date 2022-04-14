const Report = require("../../../models/Report.model");

const getAllReports = async () => {
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

const checkReportIdValid = reportId => {
    if (!(reportId.length === 24) || !/^[a-z0-9]+$/.test(reportId)) {
        const error = new Error("Provided _id for the report is invalid!");
        error.status = 400;
        throw error;
    };
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

const checkReportExists = report => {
    if (!report) {
        const error = new Error("Provided _id for the report does not match any report in our database!");
        error.status = 404;
        throw error;
    };
};

const getOneReport = async reportId => {
    checkReportIdValid(reportId);
    const report = await findReport(reportId);
    checkReportExists(report);
    return report;
};

module.exports = { getAllReports, getOneReport };