const User = require("../../../models/User.model");
const { throwError, generatePasswordHash, checkPassword } = require("../../generalFunctions");
const { sign } = require("jsonwebtoken");

const authFunctions = {};

const checkSignupInputs = async inputs => {
    const { username, name, password, passwordConfirmation, profileImage } = await inputs;

    if (!username) throwError("Username is required!", 400);

    const user = await User.findOne({ username }, { _id: 0, username: 1 });
    if (user) throwError("Username already used!", 409);

    if (!name) throwError("Name is required!", 400);
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(name)) {
        throwError("Name can only contain letters and letters with accents!", 400);
    };
    if (!password) throwError("Password is required!", 400);
    if (!passwordConfirmation) throwError("Password confirmation is required!", 400);
    if (password !== passwordConfirmation) throwError("Password confirmation is different!", 400);

    const checkedInputs = { username, name, password };
    if (profileImage) checkedInputs.profileImage = profileImage;

    return checkedInputs;
};

const capitalizeFirstLetter = name => {
    const namesArray = name.split(" ").filter(item => item !== "");
    const capitalizedFirst = namesArray.map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedFirst.join(" ");
};

const createUser = async newUser => {
    const { _id, username, name, profileImage, reports, comments, readLater } = await User.create(newUser);
    return { _id, username, name, profileImage, reports, comments, readLater };
};

authFunctions.signup = async bodyInputs => {
    const userInputs = await checkSignupInputs(await bodyInputs);
    userInputs.name = capitalizeFirstLetter(userInputs.name);
    userInputs.password = await generatePasswordHash(userInputs.password);

    const payload = await createUser(userInputs);
    const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });

    return { user: payload, token };
};

const checkLoginInputs = async inputs => {
    const { username: usernameInput, password } = await inputs;
    
    if (!usernameInput) throwError("Username is required!", 400);
    if (!password) {
        const error = new Error("Password is required!");
        error.status = 400;
        throw error;
    };
    if (!password) throwError("Password is required!", 400);

    const user = await User.findOne({ username: usernameInput }, { __v: 0 });
    if (!user) throwError("Invalid username or password!", 401);
    await checkPassword(password, user.password, "Invalid username or password!");

    const { _id, username, name, profileImage, reports, comments, readLater } = await user;

    return { _id, username, name, profileImage, reports, comments, readLater };
};

authFunctions.login = async bodyInputs => {
    const payload = await checkLoginInputs(bodyInputs);
    const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "1day" });

    return { user: payload, token };
};

module.exports = authFunctions;