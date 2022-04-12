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

const reports = [
    {
        description: "Public pool is abandoned!",
        location: "At the main street"
    },
    {
        description: "Not a report, just felt like posting something.",
        location: "Whatever"
    },
    {
        description: "The street in my home is all bumpy",
        location: "Bacabeira avenue"
    },
    {
        description: "The hospital does not have enough beds for all the patients",
        location: "St. Mathew Hospital"
    },
    {
        description: "There are no trees in the sidewalk",
        location: "Downtown"
    }
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
    } catch (error) {throw { message: "Error while trying to delete previous collections!", error: error.message }};
};

const createUsers = async () => {
    try {
        const newUsers = await User.insertMany(users);
        newUsers.forEach(user => {
            const { _id, username, name, profileImage, reports, comments, readLater, __v, createdAt, updatedAt } = user;
            const newUser = { _id, username, name, profileImage, reports, comments, readLater, __v, createdAt, updatedAt };
            console.log(`User ${username} successfully created:`, newUser);
        });
        return [newUsers[0]._id, newUsers[1]._id];
    } catch (error) {throw { message: "Error while trying to create users!", error: error.message }};
};

const createReports = async (user1Id, user2Id) => {
    try {
        reports.forEach((report, i) => (i <= 1) ? reports[i].user = user1Id : reports[i].user = user2Id);
        const newReports = await Report.insertMany(reports);
        newReports.forEach(report => console.log("Report succesfully created", report));
    } catch (error) {throw { message:"Error while trying to create reports!", error: error.message }};
};

module.exports = async () => {
    await deleteCollections();
    const ids = await createUsers();
    await createReports(ids[0], ids[1]);
    console.log("Seeds successfully planted!");
};