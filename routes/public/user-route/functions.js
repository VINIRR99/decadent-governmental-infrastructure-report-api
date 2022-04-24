const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");
const { checkId, throwError } = require("../../generalFunctions");

const getUserFunction = {};

const checkUserGetRequest = async userId => {
    checkId(userId, "user");

    const user = await User.findById(userId, { password: 0, __v: 0 }).populate({
        path: "reports",
        match: { fixed: false },
        select: "-__v -user",
        options: { sort: { createdAt: 1 } },
        populate: {
            path: "comments",
            select: "-__v -report",
            options: { sort: { createdAt: 1 } },
            limit: 3,
            populate: { path: "user", select: "name username profileImage" }
        }
    }).populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        select: "-user -__v",
        populate: { path: "report", select: "description" }
    });
    if (!user) throwError("Provided _id for user does not match with any user in our database!", 404);

    return user;
};

const addUserFixedReports = async (userId, userReports) => {
    const reports = await Report.find({ user: userId, fixed: true }, { user: 0, __v: 0 }).populate({
        path: "comments",
        select: "-__v -report",
        options: { sort: { createdAt: 1 } },
        limit: 3,
        populate: { path: "user", select: "name username profileImage" }
    }).sort({ createdAt: -1 });
    
    const addedUserFixedReports = [...userReports, ...reports];

    return addedUserFixedReports;
};

getUserFunction.getUser = async userId => {
    const user = await checkUserGetRequest(userId);
    user.reports = await addUserFixedReports(userId, user.reports);
    return user;
};

module.exports = getUserFunction;