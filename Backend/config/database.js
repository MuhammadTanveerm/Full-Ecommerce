
const mongoose= require('mongoose')
const connectionDatabase =()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/FullEcommerce')
    .then((data)=>{
        console.log(`Your sever connected with host: ${data.connection.host}`)
    })
}

module.exports = connectionDatabase


