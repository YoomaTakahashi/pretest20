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

app.use((req,res)=> res.status(404).json({message:"Route Not found"}))
app.listen(3001,()=>{

    console.log("Server Running on Port 3001");
    

})