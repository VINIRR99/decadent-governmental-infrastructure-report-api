const Comment = require("../../../models/Comment.model");
const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");
const { checkId, throwError } = require("../../generalFunctions");

const commentFunctions = {};

const checkCommentInput = async (idToCheck, idOwner, input) => {
    checkId(idToCheck, idOwner);

    const { comment } = await input;
    if (!comment) throwError("Comment is required!", 400);

    return { comment };
};

const createComment = async (checkedInput, reportId, userId) => {
    const { _id: commentId } = await Comment.create(checkedInput);

    await Report.findByIdAndUpdate(reportId, { $push: { comments: commentId } }).select("_id");

    const createdComment = await Comment.findById(commentId, { __v: 0 }).populate("user", "username name profileImage");
    await User.findByIdAndUpdate(userId, { $push: { comments: commentId } });
    return createdComment;
};

commentFunctions.postNewComment = async (reportId, userId, input) => {
    const checkedInput = await checkCommentInput(reportId, "report", input);
    checkedInput.report = reportId;
    checkedInput.user = userId;
    const createdComment = await createComment(checkedInput, reportId, userId);
    return createdComment;
};

const updateComment = async (checkedInput, commentId, userId) => {
    const updatedComment = await Comment.findOneAndUpdate({ _id: commentId, user: userId }, checkedInput, { new: true })
        .select("-__v").populate("user", "username name profileImage");
    return updatedComment;
};

commentFunctions.putComment = async (commentId, userId, input) => {
    const checkedInput = await checkCommentInput(commentId, "comment", input);
    const updatedComment = await updateComment(checkedInput, commentId, userId);
    return updatedComment;
};

const removeComment = async (commentId, userId) => {
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId, user: userId }).select("_id");
    if (!deletedComment) throwError("Provided id for the comment does not match any comment you created", 404);
    await Report.findOneAndUpdate({ comments: { $in: [commentId] } }, { $pull: { comments: commentId } });
    await User.findOneAndUpdate({ comments: { $in: [commentId] } }, { $pull: { comments: commentId } });
};

commentFunctions.deleteComment = async (commentId, userId) => {
    checkId(commentId, "comment");
    await removeComment(commentId, userId);
};

module.exports = commentFunctions;