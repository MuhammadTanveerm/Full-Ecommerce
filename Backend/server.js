const app = require('./app')
const dotenv = require('dotenv')
const connectionDatabase = require('./config/database')
//  Handling Uncaught Exception
process.on("uncaughtException", (err)=> {
    console.log(`Error: ${err.message}`)
    console.log(`shoutdown the serve because Uncaught Esx `)
    process.exit(1)
})


dotenv.config({path:"Backend/config/config.env"})
connectionDatabase()
const server = app.listen(process.env.PORT, ()=>{
    console.log(`You are sever is running at localhost: ${process.env.PORT}`)
})

// unhandled Promise Error
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shoutdown the serve because unhandled Promise  Rejection`)

    server.close(()=>{
      process.exit(1)
    });
});

