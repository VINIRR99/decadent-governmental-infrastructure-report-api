const User = require("../../models/User.model");
const { genSalt, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const checkSignupInputs = async inputs => {
    const { username, name, password, passwordConfirmation, profileImage } = await inputs;

    if (!username) {
        const error = new Error("Username is required!");
        error.status = 400;
        throw error;
    };

    const user = await User.findOne({ username }, { _id: 0, username: 1 });
    if (user) {
        const error = new Error("Username already used!");
        error.status = 409;
        throw error;
    };

    if (!name) {
        const error = new Error("Name is required!");
        error.status = 400;
        throw error;
    };
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(name)) {
        const error = new Error ("Name can only contain letters and letters with accents!");
        error.status = 400;
        throw error;
    };

    if (!password) {
        const error = new Error("Password is required!");
        error.status = 400;
        throw error;
    };
    if (!passwordConfirmation) {
        const error = new Error("Password confirmation is required!");
        error.status = 400;
        throw error;
    };
    if (password !== passwordConfirmation) {
        const error = new Error("Password confirmation is different!");
        error.status = 400;
        throw error;
    };

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

module.exports = { signup };