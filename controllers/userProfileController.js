const userProfileController = require('express').Router()
const UserProfile = require("../models/UserProfile")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const uploadImage = require('../utils/uploadImage')

userProfileController.post("/", async (req, res) => {
    res.status(200).json(req.body)
})

userProfileController.post('/register', async (req, res) => {
    try {
        const isExisting = await UserProfile.findOne({ email: req.body.email })
        if (isExisting) {
            throw new Error("Already such an account. Try a different email")
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // const newUser = await UserProfile.create({...req.body, password: hashedPassword})
        const newUser = await UserProfile.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profile: {
                name: "",
                avatar: "https://res.cloudinary.com/dkfvl57g1/image/upload/v1694441217/user-icon_lwfs1w.png",
                bio: "",
                address: ""
            }
        })

        const { password, ...others } = newUser._doc
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' })

        return res.status(201).json({ user: others, token })
    } catch (error) {
        return res.status(500).json(error)
    }
})

userProfileController.post('/login', async (req, res) => {
    try {
        const user = await UserProfile.findOne({ email: req.body.email })
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if (!comparePass) {
            throw new Error("Invalid credentials")
        }

        const { password, ...others } = user._doc
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        return res.status(200).json({ user: others, token })
    } catch (error) {
        return res.status(500).json(error)
    }
})

userProfileController.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await UserProfile.findById(req.params.id)
        if (user.id.toString() !== req.user.id.toString()) {
            throw new Error("You can view only your own posts")
        }

        const { password, ...others } = user._doc
        return res.status(200).json({ user: others })
    } catch (error) {
        return res.status(500).json(error)
    }
})

userProfileController.get('/', verifyToken, async (req, res) => {
    try {
        const user = await UserProfile.find().select('-password')
        const profile = user.filter(uid => uid._id.toString() == req.user.id.toString())
        return res.status(200).json(profile)
    } catch (error) {
        return res.status(500).json(error)
    }
})

userProfileController.put('/:id', verifyToken, async (req, res) => {
    try {
        const user = await UserProfile.findById(req.params.id)
        if (user.id.toString() !== req.user.id.toString()) {
            throw new Error("You can update only your own posts")
        }
        if (req.body.avatar == undefined) {
            var profile = {
                name: req.body.name,
                avatar: user.profile.avatar,
                bio: req.body.bio,
                address: req.body.address
            }
        } else {
            const cloudCover = await uploadImage(req.body.avatar)
            var profile = {
                name: req.body.name,
                avatar: cloudCover,
                bio: req.body.bio,
                address: req.body.address
            }
        }

        const updatedProfile = await UserProfile.findByIdAndUpdate(req.params.id, { username: req.body.username, email: req.body.email, profile: profile }, { new: true })

        const { password, ...others } = updatedProfile._doc
        return res.status(200).json({ user: others })
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = userProfileController