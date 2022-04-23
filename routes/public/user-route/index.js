const { Router } = require("express");
const { getUser } = require("./functions");

const router = Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getUser(userId);
        res.status(200).json(user);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error when trying to get user!", error: error.message });
    };
});

module.exports = router;