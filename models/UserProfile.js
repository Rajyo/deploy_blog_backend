const mongoose = require("mongoose")

const UserProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    profile: {
        name: {
            type: String,
        },
        avatar: {
            type: String,
        },
        bio: {
            type: String,
        },
        address: {
            type: String
        },
    },
}, {timestamps: true})

module.exports = mongoose.model("UserProfile", UserProfileSchema)