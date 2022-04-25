const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");
const Comment = require("../../../models/Comment.model");
const { throwError, checkPassword, checkId, generatePasswordHash } = require("../../generalFunctions");

const userFunctions = {};

const checkUserInputs = async (inputs, userId) => {
    const { username, password, newPassword, newPasswordConfirmation, name, profileImage, readLater } = await inputs;
    const checkedInputs = {};

    if (username && !password) throwError("To change the username, the password is required!", 400);
    if (!password && newPassword) throwError("The old password is required to change the password!", 400);
    if (!newPassword && newPasswordConfirmation) {
        throwError("New password is required before password confirmation!", 400);
    };
    if (newPassword && !newPasswordConfirmation) throwError("Password confirmation is required!", 400);
    if ((password && newPassword && newPasswordConfirmation) && (newPassword !== newPasswordConfirmation)) {
        throwError("Password confirmation must be equal to the new password!", 400);
    };
    if (readLater) {
        if ((readLater.slice(0, 1) !== "+") && (readLater.slice(0, 1) !== "-")) {
            throwError(
                'The string "+" or "-" are necessary at the beginning of readLater! "+" to indicate to add the ' +
                'report and "-" is to indicate to remove a report.',
                400
            );
        };
        checkId(readLater.slice(1), "user");

        const report = await Report.findOne({ _id: readLater.slice(1), user: userId });
        if (report) throwError("Cannot add your own report to your list", 409)

        const user = await User.findOne({ _id: userId, readLater: { $in: [readLater.slice(1)] } }, { _id: 1 });
        const readLaterQuery = { readLater: readLater.slice(1) };
        switch (readLater.slice(0, 1)) {
            case "+":
                if (user) throwError("Report already added to your list!", 409);
                checkedInputs.$push = readLaterQuery;
                break;
            case "-":
                if (!user) throwError("Report does not exist on your list!", 404);
                checkedInputs.$pull = readLaterQuery;
        };
    };

    if ((username || (newPassword && newPasswordConfirmation)) && password) {
        const { password: passwordHash } = await User.findById(userId, { password: 1, _id: 0 });
        await checkPassword(password, passwordHash, "Password is invalid!");
        if (username) checkedInputs.username = username;
        if (newPassword) checkedInputs.password = newPassword;
    };

    if (name) checkedInputs.name = name;
    if (profileImage) checkedInputs.profileImage = profileImage;

    return checkedInputs;
};

userFunctions.updateUser = async (inputs, userId) => {
    const checkedInputs = await checkUserInputs(inputs, userId);
    if (checkedInputs.password) checkedInputs.password = await generatePasswordHash(checkedInputs.password);
    const updatedUser = await User.findByIdAndUpdate(userId, checkedInputs, { new: true }).select("-password -__v");
    return updatedUser;
};

const checkDeleteUserInputs = async (userId, inputs) => {
    const { username, password } = await inputs;
    
    if (!username) throwError("Username is required!", 400);
    if (!password) throwError("Password is required!", 400);

    const user = await User.findOne({ _id: userId, username }, { password: 1, _id: 0 });
    if(!user) throwError("Invalid username or password!", 401);
    
    const { password: passwordHash } = await user;
    await checkPassword(password, passwordHash, "Invalid username or password!");
};
/*
const removeUser1 = async userId => {
    //await User.findByIdAndDelete(userId);
    const reports = await Report.find({ user: userId }, { comments: 1 });
    const commentsId = [];
    for (let i = 0; i < reports.length; i += 1) commentsId.push(...reports[i].comments);
    //return comments;
    const newComments = await Comment.find({ _id: { $in: commentsId } });
    const users = await User.find({ comments: { $in: commentsId } });

    const deletedCommentsData = await Comment.find({ user: userId }, { _id: 1 });
    const deletedComments = deletedCommentsData.map(comment => comment._id);
    const updatedReports = await Report.find({ comments: { $in: deletedComments } });
    return commentsId;
    //await Comment.deleteMany({ user: userId });
};

const removeUser2 = async userId => {
    await User.findByIdAndDelete(userId);

    const deletedReports = await Report.deleteMany({ user: userId }).select("comments -_id");
    const commentsId = [];
    for (let i = 0; i < deletedReports.length; i += 1) commentsId.push(...deletedReports[i].comments);
    const reportComments = await Comment.deleteMany({ _id: { $in: commentsId } }).select("_id");

    const reportCommentsIds = reportComments.map(comment => comment._id);

    await User.updateMany( { comments: { $in: reportCommentsIds } }, { $pull: { comments: { $in: reportCommentsIds } } });

    const userComments = await Comment.deleteMany({ user: userId }).select("_id");
    const userCommentsIds = userComments.map(comment => comment._id);
    await Report.updateMany({ comments: { $in: userCommentsIds } }, { $pull: { comments: { $in: userCommentsIds } } });
}; */

const removeUser = async userId => {
    await User.findByIdAndDelete(userId);

    const deletedReports = await Report.find({ user: userId }, { comments: 1, _id: 0 });
    await Report.deleteMany({ user: userId });

    const commentsId = [];
    for (let i = 0; i < deletedReports.length; i += 1) commentsId.push(...deletedReports[i].comments);
    
    const deletedCommentsData = await Comment.find(
        { $or: [{ _id: { $in: commentsId } }, { user: userId }] },
        { _id: 1 }
    );
    await Comment.deleteMany({
        $or: [
            { _id: { $in: commentsId } },
            { user: userId }
        ]
    });

    const deletedComments = deletedCommentsData.map(comment => comment._id);

    await User.updateMany({ comments: { $in: deletedComments } }, { $pull: { comments: { $in: deletedComments } } });
    await Report.updateMany({ comments: { $in: deletedComments } }, { $pull: { comments: { $in: deletedComments } } });
};

userFunctions.deleteUser = async (userId, inputs) => {
    await checkDeleteUserInputs(userId, inputs);
    await removeUser(userId);
};

module.exports = userFunctions;