const categoryController = require("express").Router()
const Category = require("../models/Category")

categoryController.get("/", async (req, res) => {
    try {
        const category = await Category.find().populate('blog')
        return res.status(200).json(category)
    } catch (error) {
        res.status(500).json(error)
    }
})

categoryController.get("/:id", async (req, res) => {
    try {
        // const category = await Category.findById(req.params.id).populate('blog')
        const category = await Category.findById(req.params.id).populate({ path: "blog", populate: { path: "userId" } })
        return res.status(200).json(category)
    } catch (error) {
        res.status(500).json(error)
    }
})

categoryController.post("/", async (req, res) => {
    try {
        const category = await Category.create({
            category: req.body.category,
            cover: req.body.cover,
            blog: []
        })
        return res.status(201).json(category)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = categoryController