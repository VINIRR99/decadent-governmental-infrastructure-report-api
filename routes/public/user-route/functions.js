const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");

const getUserFunction = {};

const checkUserGetRequest = async username => {
    const user = await User.findOne({ username }, { password: 0, __v: 0 }).populate({
        path: "reports",
        match: { fixed: false },
        select: "-__v -user",
        options: { sort: { createdAt: 1 } },
        populate: {
            path: "comments",
            select: "-__v -report",
            options: { sort: { createdAt: 1 } },
            limit: 4,
            populate: { path: "user", select: "name username profileImage" }
        }
    }).populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        select: "-user -__v",
        populate: { path: "report", select: "description" }
    }).populate({
        path: "readLater",
        select: "-__v",
        populate: {
            path: "comments",
            select: "-__v -report",
            options: { sort: { createdAt: 1 } },
            limit: 4,
            populate: { path: "user", select: "name username profileImage" }
        }
    }).populate({
        path: "readLater",
        populate: { path: "user", select: "name username profileImage" }
    });

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

getUserFunction.getUser = async username => {
    const user = await checkUserGetRequest(username);
    if (user) user.reports = await addUserFixedReports(user._id, user.reports);
    return user ? user : 404;
};

module.exports = getUserFunction;