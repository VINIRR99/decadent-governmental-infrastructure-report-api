const { Router } = require("express");
const uploadCloud = require("../../../configs/cloudinary.config");
const { updateUser, deleteUser } = require("./functions");

const router = Router();

router.put("/upload-image", uploadCloud.single("image"), async (req, res) => {
    try {
        const { path: profileImage } = req.file;
        const { _id: userId } = await req.user;
        const updatedUser = await updateUser({ profileImage }, userId);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while uploading user profile image", error: error.message });
    };
});

router.put("/", async (req, res) => {
    try {
        const { _id: userId } = await req.user;
        const updatedUser = await updateUser(await req.body, userId);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while updating an user information!", error: error.message });
    };
});

router.delete("/", async (req, res) => {
    try {
        const { _id: userId } = await req.user;
        await deleteUser(userId, await req.body);
        res.status(204).json();
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while deleting user!", error: error.message });
    };
});

module.exports = router;