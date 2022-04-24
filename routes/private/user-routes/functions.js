const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");
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

module.exports = userFunctions;