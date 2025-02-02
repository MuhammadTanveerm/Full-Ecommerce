const express = require('express') 

const  app =express()
const cookieParser =require("cookie-parser")
const errormiddleware = require('./middleware/error.js')
app.use(express.json())
app.use(cookieParser())
// Routes 
const product = require('./routes/productRoute')
const user= require('./routes/userRoute.js')
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use(errormiddleware)
module.exports =app



