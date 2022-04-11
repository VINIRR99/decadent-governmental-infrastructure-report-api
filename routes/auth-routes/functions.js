const User = require("../../models/User.model");
const { genSalt, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const signupErrorMsgs = {
    missingUsername: "Username is required!",
    missingName: "Name is required!",
    invalidName: "Name can only contain letters and letters with accents!",
    usedUsername: "Username already used!",
    missingPassword: "Password is required!",
    missingPasswordConfirmation: "Password confirmation is required!",
    differentPasswordConfirmation: "Password confirmation is different!"
};

const checkSignupInputs = async inputs => {
    const { username, name, password, passwordConfirmation, profileImage } = await inputs;

    if (!username) throw new Error(signupErrorMsgs.missingUsername);

    const user = await User.findOne({ username }, { _id: 0, username: 1 });
    if (user) throw new Error(signupErrorMsgs.usedUsername);

    if (!name) throw new Error(signupErrorMsgs.missingName);
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(name)) throw new Error (signupErrorMsgs.invalidName);

    if (!password) throw new Error(signupErrorMsgs.missingPassword);
    if (!passwordConfirmation) throw new Error(signupErrorMsgs.missingPasswordConfirmation);
    if (password !== passwordConfirmation) throw new Error(signupErrorMsgs.differentPasswordConfirmation);

    const checkedInputs = { username, name, password };
    if (profileImage) checkedInputs.profileImage = profileImage;

    return checkedInputs;
};

const capitalizeFirstLetter = name => {
    const namesArray = name.split(" ").filter(item => item !== "");
    const capitalizedFirst = namesArray.map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedFirst.join(" ");
};

const generatePasswordHash = async password => {
    const salt = await genSalt(12);
    return await hash(password, salt);
};

const createUser = async newUser => {
    const { _id, username, name, profileImage, reports, comments, readLater } = await User.create(newUser);
    return { _id, username, name, profileImage, reports, comments, readLater };
};

const signup = async bodyInputs => {
    const userInputs = await checkSignupInputs(await bodyInputs);
    userInputs.name = capitalizeFirstLetter(userInputs.name);
    userInputs.password = await generatePasswordHash(userInputs.password);

    const payload = await createUser(userInputs);
    const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });

    return { user: payload, token };
};

const signupErrorStatus = errorMessage => {
    let status;
    switch (errorMessage) {
        case signupErrorMsgs.missingUsername:
        case signupErrorMsgs.missingName:
        case signupErrorMsgs.invalidName:
        case signupErrorMsgs.missingPassword:
        case signupErrorMsgs.missingPasswordConfirmation:
        case signupErrorMsgs.differentPasswordConfirmation:
            status = 400;
            break;
        case signupErrorMsgs.usedUsername:
            status = 409;
            break;
        default:
            status = 500;
    };
    return status;
};

module.exports = { signup, signupErrorStatus };