const { model, Schema } = require("mongoose");

module.exports = model("Report", new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        description: { type: String, trim: true },
        image: {
            type: String,
            required: true,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfpPVijwnCRZeDmz9C-E9_lcYR_mho_M2FBQ&usqp=CAU"
        },
        location: { type: String, trim: true },
        fixed: { type: Boolean, required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    },
    { timestamps: true }
));