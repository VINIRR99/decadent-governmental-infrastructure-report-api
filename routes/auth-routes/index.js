const { Router } = require("express");
const { signup, signupErrorStatus } = require("./functions");

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const response = await signup(await req.body);
        res.status(201).json(response);
    } catch (error) {
        const status = signupErrorStatus(error.message);
        res.status(status).json({ message: "Error on signup!", error: error.message });
    };
});

module.exports = router;