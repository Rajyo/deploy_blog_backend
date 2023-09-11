const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
const cors = require('cors')
const blogController = require('./controllers/blogController')
const categoryController = require('./controllers/categoryController')
const userProfileController = require('./controllers/userProfileController')
//const multer = require('multer')
const app = express()
const PORT = process.env.PORT || 5000
// connect db
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB has been started successfully'))      
    } catch (error) {
        console.log(error)
    }
}
connectDB()

// routes
app.use('/images', express.static('public/images'))

// multer
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'public/images')
//     },
//     filename: function(req, file, cb){
//         cb(null, req.body.filename)
//     }
// })

// const upload = multer({
//     storage: storage
// })

app.use(cors())
app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({extended: true}))
//app.use('/auth', authController)
app.use('/blog', blogController)
//app.use('/profile', profileController)
app.use('/category', categoryController)
app.use('/userProfile', userProfileController)


// app.post('/upload', upload.single("image"), async(req, res) => {
//     return res.status(200).json({msg: "Successfully uploaded"})
// })
app.all("*", (req, res)=>{
    res.status(404).json({message: '404 Not Found'})
})
// connect server
app.listen(PORT , () => console.log('Server has been started successfully'))