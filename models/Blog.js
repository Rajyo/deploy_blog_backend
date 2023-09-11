const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4,
    },
    desc: {
        type: String,
        required: true,
        min: 12,
    },
    cover: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    // category: {
    //     type: String,
    //     enum: ["Music", "Movie", "Sports"],
    //     required: true,
    // },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'UserProfile',
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model("Blog", BlogSchema)