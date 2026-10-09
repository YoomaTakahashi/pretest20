require('dotenv').config({path:`.env`})
const express = require('express')
const fileUp = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors({

    origin:"http://localhost:3000",
    credentials: true

}))

app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))
app.use(fileUp())

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

//staff

const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

//eva

const edit_eva =require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

//คอมมิท
const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)


app.use((req,res)=> res.status(404).json({message:"Route Not found"}))
app.listen(3001,()=>{

    console.log("Server Running on Port 3001");
    

})