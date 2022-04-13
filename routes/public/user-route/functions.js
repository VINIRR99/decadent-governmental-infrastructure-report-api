const User = require("../../../models/User.model");

module.exports = async userId => {
    if (!(userId.length === 24) || !/^[a-z0-9]+$/.test(userId)) {
        const error = new Error("Provided _id is invalid!");
        error.status = 400;
        throw error;
    };

    const user = await User.findById(userId, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .populate("reports");
    if (!user) {
        const error = new Error("Provided _id for user does not match with any user in our database!");
        error.status = 404;
        throw error;
    };
    return user;
};