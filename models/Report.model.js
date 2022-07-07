const { model, Schema } = require("mongoose");

module.exports = model("Report", new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String, trim: true, maxlength: 2200, required: true },
        image: {
            type: String,
            default: "https://res.cloudinary.com/dulbuc924/image/upload/v1657207384/report-app/maunpwjp1cspbqtwrqyv.jpg"
        },
        fixed: { type: Boolean, required: true, default: false },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    },
    { timestamps: true }
));