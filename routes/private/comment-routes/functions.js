const Comment = require("../../../models/Comment.model");
const User = require("../../../models/User.model");
const Report = require("../../../models/Report.model");

const checkPostNewCommentInput = async (input, reportId, userId) => {
    if (!(reportId.length === 24) || !/^[a-z0-9]+$/.test(reportId)) {
        const error = new Error("Provided _id for the report is invalid!");
        error.status = 400;
        throw error;
    };

    const { comment } = await input;

    if (!comment) {
        const error = new Error("Comment is required!");
        error.status = 400;
        throw error;
    };

    const checkedInput = { comment, user: userId, report: reportId };
    return checkedInput;
};

const checkReportId = async (updatedReport, commentId, userId) => {
    if (!updatedReport) {
        await Comment.findOneAndDelete({ _id: commentId, user: userId });
        const error = new Error("The provided _id for the report does not match any report in our database!");
        error.status = 404;
        throw error;
    };
};

const createComment = async (checkedInput, reportId, userId) => {
    const { _id: commentId } = await Comment.create(checkedInput);

    const updatedReport = await Report.findByIdAndUpdate(reportId, { $push: { comments: commentId } }).select("_id");
    await checkReportId(updatedReport, commentId, userId);

    const createdComment = await Comment.findById(commentId, { __v: 0 }).populate("user", "username name profileImage");
    await User.findByIdAndUpdate(userId, { $push: { comments: commentId } });
    return createdComment;
};

const postNewComment = async (input, reportId, userId) => {
    const checkedInput = await checkPostNewCommentInput(input, reportId, userId);
    const createdComment = await createComment(checkedInput, reportId, userId);
    return createdComment;
};

module.exports = { postNewComment };