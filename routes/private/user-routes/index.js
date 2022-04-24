const { Router } = require("express");
const { updateUser } = require("./functions");

const router = Router();

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

module.exports = router;