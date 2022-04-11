const { model, Schema } = require("mongoose");

module.exports = model("Comment", new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        report: { type: Schema.Types.ObjectId, ref: "Report", required: true },
        comment: { type: String, trim: true }
    },
    { timestamps: true }
));