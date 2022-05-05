const { model, Schema } = require("mongoose");

module.exports = model("Report", new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String, trim: true, maxlength: 2200, default: "" },
        image: {
            type: String,
            default: "https://res.cloudinary.com/dulbuc924/image/upload/v1651761945/reports/lyp8kvhuymamdlrorgsg.jpg"
        },
        location: { type: String, trim: true, required: true },
        fixed: { type: Boolean, required: true, default: false },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    },
    { timestamps: true }
));