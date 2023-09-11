const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    category: {
        type: String,
    },
    cover: {
        type: String,
    },
    blog: [{type: mongoose.Types.ObjectId, ref: "Blog",required: true}]
})

module.exports = mongoose.model("Category", CategorySchema)