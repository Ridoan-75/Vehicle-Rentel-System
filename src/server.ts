import express, { Request, Response } from "express"
import dotenv, { config } from "dotenv"


dotenv.config()
const app = express()

const port = process.env.port;


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})