const { Router } = require("express");
const { signup, login } = require("./functions");

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

router.post("/login", async (req, res) => {
    try {
        const response = await login(await req.body);
        res.status(200).json(response);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error on login!", error: error.message });
    };
});

module.exports = router;