const { model, Schema } = require("mongoose");

module.exports = model("User", new Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        profileImage: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
        reports: [{ type: Schema.Types.ObjectId, ref: "Reports" }],
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        readLater: [{ type: Schema.Types.ObjectId, ref: "Reports" }]
    },
    { timestamps: true }
));