const { genSalt, hash, compare } = require("bcryptjs");

const throwError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

const checkId = (idToCheck, idOwner) => {
    if (!(idToCheck.length === 24) || !/^[a-z0-9]+$/.test(idToCheck)) {
        throwError(`Provided _id for the ${idOwner} is invalid!`, 400);
    };
};

const checkPassword = async (password, passwordHash, invalidMsg) => {
    const compareHash = await compare(password, passwordHash);
    if (!compareHash) throwError(invalidMsg, 401);
};

const generatePasswordHash = async password => {
    const salt = await genSalt(12);
    return await hash(password, salt);
};

module.exports = { throwError, checkId, checkPassword, generatePasswordHash };