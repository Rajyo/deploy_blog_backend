const blogController = require("express").Router()
const Blog = require("../models/Blog")
const Category = require("../models/Category")
const verifyToken = require('../middlewares/verifyToken')
const uploadImage = require("../utils/uploadImage")

blogController.get('/getUserBlogs', verifyToken, async (req, res) => {
    try {
        const blogs = await Blog.find().populate("userId", '-password').populate('category')
        const userBlogs = blogs.filter(blog => blog.userId.id == req.user.id )
        
        return res.status(200).json(userBlogs)
    } catch (error) {
        return res.status(500).json(error)
    }
})


blogController.get('/getAll', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('userId', '-password').populate('category')
        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(500).json(error)
    }
})


blogController.get('/find/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("userId", '-password').populate('category')
        return res.status(200).json(blog)
    } catch (error) {
        return res.status(500).json(error)
    }
})


blogController.post('/', verifyToken, async (req, res) => {
    try {
        const cloudCover = await uploadImage(req.body.cover)
        const category = await Category.findOne({category: req.body.category})
        const blog = await Blog.create({ ...req.body, userId: req.user.id, category: category._id, cover: cloudCover})
        const cat = await Category.findOneAndUpdate(category._id, {$push: {blog}})
        return res.status(201).json(blog)
    } catch (error) {
        return res.status(500).json(error)
    }
})


blogController.put("/updateBlog/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('category')
        if (blog.userId.toString() !== req.user.id.toString()) {
            throw new Error("You can update only your own posts")
        }

        var categoryy = await Category.findOne({category: blog.category.category})
        categoryy.blog.pop(blog.category)
        categoryy.save()

        if(req.body.cover == undefined){
            var category = await Category.findOne({category: req.body.category})
            var updatedBlog = await Blog
                .findByIdAndUpdate(req.params.id, { title: req.body.title, desc: req.body.desc, cover: req.body.cover, category: category._id}, { new: true })
                .populate('userId', '-password')
        }else{
            const cloudCover = await uploadImage(req.body.cover)
            var category = await Category.findOne({category: req.body.category})
            var updatedBlog = await Blog
                .findByIdAndUpdate(req.params.id, { title: req.body.title, desc: req.body.desc, cover: cloudCover, category: category._id}, { new: true })
                .populate('userId', '-password')
        }
        
        await Category.findOneAndUpdate(category._id, {$push: {blog}})
        return res.status(200).json(updatedBlog)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})


blogController.delete('/deleteBlog/:id', verifyToken, async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.userId.toString() !== req.user.id.toString()){
            throw new Error("You can delete only your own posts")
        }
        
        await Blog.findByIdAndDelete(req.params.id)

        return res.status(200).json({msg: "Successfully deleted the blog"})
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = blogController