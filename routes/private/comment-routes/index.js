const { Router } = require("express");
const { postNewComment, putComment, deleteComment } = require("./functions");

const router = Router();

router.post("/:reportId", async (req, res) => {
    try {
        const { reportId } = req.params;
        const { _id: userId } = await req.user;
        const newComment = await postNewComment(reportId, userId, await req.body);
        res.status(201).json(newComment);
    } catch (error) {
        if (!error.status) error.status = 500;
        if ((error.status === 500) && (error.name === "ValidationError")) {
            error.status = 404;
            error.message = "The provided _id for the report does not match any report in our database!";
        };
        res.status(error.status).json({ message: "Error while trying to post a new comment!", error: error.message });
    };
});

router.put("/:commentId", async (req, res) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = await req.user;
        const updatedComment = await putComment(commentId, userId, await req.body);
        res.status(200).json(updatedComment);
    } catch (error) {
        if (!error.status) error.status = 500;
        if ((error.status === 500) && (error.path === "_id")) {
            error.status = 404;
            error.message = "The provided _id for the comment does not match any report you posted!";
        };
        res.status(error.status).json({ message: "Error while trying to update a comment!", error: error.message });
    };
});

router.delete("/:commentId", async (req, res) => {
    try {
        const { commentId } = req.params;
        const { _id: userId } = await req.user;
        await deleteComment(commentId, userId);
        res.status(204).json();
    } catch (error) {
        if (!error.status) error.status = 500;
        if ((error.status === 500) && (error.path === "_id")) {
            error.status = 404;
            error.message = "The provided _id for the comment does not match any comment you posted!";
        };
        res.status(error.status).json({ message: "Error while trying to delete comment!", error: error.message });
    };
});

module.exports = router;