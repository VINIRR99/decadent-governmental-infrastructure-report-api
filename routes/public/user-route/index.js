const { Router } = require("express");
const { getUser } = require("./functions");

const router = Router();

router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUser(username);
        res.status(200).json(user);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error when trying to get user!", error: error.message })
    };
});

module.exports = router;