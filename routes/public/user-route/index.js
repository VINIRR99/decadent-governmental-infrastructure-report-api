const { Router } = require("express");
const { getUser } = require("./functions");

const router = Router();

router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUser(username);
        res.status(200).json(user);
    } catch (error) {res.status(500).json({ message: "Error when trying to get user!", error: error.message })};
});

module.exports = router;