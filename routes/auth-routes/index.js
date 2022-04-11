const { Router } = require("express");
const { signup } = require("./functions");

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const response = await signup(await req.body);
        res.status(201).json(response);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error on signup!", error: error.message });
    };
});

module.exports = router;