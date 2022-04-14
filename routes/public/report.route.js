const { Router } = require("express");
const Report = require("../../models/Report.model");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const reports = await Report.find({}, { __v: 0 }).populate("user", "username name profileImage").populate({
            path: "comments",
            select: "-report -__v",
            populate: { path: "user", select: "username name profileImage" }
        });
        res.status(200).json(reports);
    } catch (error) {res.status(500).json({ message: "Error while trying to get all reports!", error: error.message })};
});

module.exports = router;