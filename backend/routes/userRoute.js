const userRoute = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const uplaod = require('../config/multer')


userRoute.post('/register', async (req, res) => {
    console.log("on register controller");
    const { name, email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        return res.status(400).send({ message: "Email already exist" })
    } else {
        const user = await new User({
            name,
            email,
            password: hashedPass
        }).save()

        //jwt tocken

        const {_id} = user.toJSON()
        const token=jwt.sign({_id:_id},process.env.JWT_SECRET)
        res.cookie('jwt',token,{
            httpOnly:true,
            maxAge:24*60*60*1000                //1day
        })
        res.send({
            message:'Success'
        })

    }
})


userRoute.post("/login", async (req, res) => {
    // console.log('On login controller');
    const { email, password } = req.body
    const userData = await User.findOne({email}) 
    if(!userData){
        return res.status(404).send({ message: 'User not found' })
    }
    if(!(await bcrypt.compare(password, userData.password))){
        console.log('Password didnt match');
        return res.status(400).send({ message: 'Password is Incorrect' })
    }

    const token = jwt.sign({_id: userData._id}, process.env.JWT_SECRET)
    res.cookie('jwt',token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.send({ message : 'Success' })
})
userRoute.get('/profile',async (req, res) => {
    try {
        console.log('On profile controller');
        const token = req.cookies['jwt']
        console.log(req.cookies);
        const claims = jwt.verify(token, process.env.JWT_SECRET)
        if(!claims) return res.status(401).send( { message: 'Unauthenticated' })

        const userData = await User.findOne({ _id: claims._id })
        const { password, ...data } = userData.toJSON()
        console.log(data);
        res.send(data)

    } catch (error) {
        console.log(error);
    }
})


userRoute.post('/profile-upload-single',uplaod.single('image'), async(req, res) => {
    try {
        console.log('upload controller');
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, process.env.JWT_SECRET)
        if(!claims) return res.status(401).send({ message: 'Unauthenticated' })

        const updateImg = await User.updateOne(
            {_id: claims._id},
            {
                $set:{
                    image: req.file.filename
                }
            }
        );

        if(!updateImg) return res.status(401).json({ message: "Something went wrong!" })
        return res.status(200).json({ message: 'Image Uploaded Successfully' })

    } catch (error) {
        console.log(error);
    }
})

userRoute.post('/logout', async( req, res) => {
    console.log('logging out');
    res.cookie('jwt','',{maxAge:0})
    res.send({ message : 'Logged Out' })
})


module.exports = userRoute