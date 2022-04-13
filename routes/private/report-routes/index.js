const { Router } = require("express");
const { postNewReport } = require("./functions");

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { _id: userId } = await req.user;
        const newReport = await postNewReport(userId, await req.body);
        res.status(201).json(newReport);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while creating new Reports!", error: error.message });
    };
});

module.exports = router;