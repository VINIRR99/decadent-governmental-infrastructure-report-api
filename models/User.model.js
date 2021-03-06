const { model, Schema } = require("mongoose");

module.exports = model("User", new Schema({
    username: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
    name: {
        type: String,
        required: true,
        match: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
        trim: true,
        maxlength: 65
    },
    password: { type: String, required: true },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/dulbuc924/image/upload/v1657207417/report-app/omec2l61dvp2ehu20gjg.jpg"
    },
    reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    readLater: [{ type: Schema.Types.ObjectId, ref: "Report" }]
}));