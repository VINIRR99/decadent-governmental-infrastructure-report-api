const User = require("../models/User.model");
const Report = require("../models/Report.model");
const Comment = require("../models/Comment.model");
const { genSaltSync, hashSync } = require("bcryptjs");

const users = [
    {
        username: "user1",
        name: "User One",
        password: "password1",
    },
    {
        username: "user2",
        name: "User Two",
        password: "password2",
    },
    {
        username: "user3",
        name: "User Three",
        password: "password3",
    },
    {
        username: "user4",
        name: "User Four",
        password: "password4",
    },
];

users.forEach(user => {
    const salt = genSaltSync(12);
    user.password = hashSync(user.password, salt);
});

const deleteCollections = async () => {
    try {
        await User.deleteMany();
        await Report.deleteMany();
        await Comment.deleteMany();
        console.log("Previous collections successfully deleted!");
    } catch (error) {throw new Error(`Error while trying to delete previous collections:`, error)};
};

const createUsers = async () => {
    try {
        const newUsers = await User.insertMany(users);
        newUsers.forEach(user => {
            const { _id, username, name, profileImage, reports, comments, readLater, __v, createdAt, updatedAt } = user;
            const newUser = { _id, username, name, profileImage, reports, comments, readLater, __v, createdAt, updatedAt };
            console.log(`User ${user.username} successfully created:`, newUser)
        });
    } catch (error) {
        users.forEach(user => {throw new Error(`Error while trying to create user ${user.username}:`, error)});
    };
};

module.exports = async () => {
    await deleteCollections();
    await createUsers();
    console.log("Seeds successfully planted!");
};