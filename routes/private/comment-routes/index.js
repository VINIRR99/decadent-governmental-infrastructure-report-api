const { Router } = require("express");
const { postNewComment } = require("./functions");

const router = Router();

router.post("/:reportId", async (req, res) => {
    try {
        const { reportId } = req.params;
        const { _id: userId } = await req.user;
        const newComment = await postNewComment(await req.body, reportId, userId);
        res.status(201).json(newComment);
    } catch (error) {
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: "Error while trying to post a new comment!", error: error.message });
    };
});

module.exports = router;