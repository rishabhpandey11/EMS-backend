import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use use hota hai middleware ke liye
// cors middleware frontend se aane wali requests ko handle karta hai (specially jab frontend-backend alag origin par ho)
app.use(cors({
    origin: process.env.CORS_ORIGIN,  // yeh allow karega kis frontend origin se requests accepted hongi (e.g., http://localhost:4200)
    credentials: true  // cookies, authorization headers allow kiye jaayenge (important for login/session)
}))




// JSON data parse karne ke liye body parser middleware (limit set kar ke large payloads se bachav hota hai)
app.use(express.json({limit: "16kb"}))

// URL encoded data parse karta hai (form data wagairah ke liye), extended true ka matlab nested objects bhi parse ho sakte hain
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// Static files (images, frontend assets, etc.) serve karta hai 'public' folder se
app.use(express.static("public"))

// Client se aayi cookies ko parse karne ke liye (session handling wagairah me kaam aata hai)
app.use(cookieParser())



//routes import
import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import leaveRouter from './routes/leave.routes.js'


//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter)
// app.get('/api/v1/tasks/test', (req, res) => res.send('Task route works!'))

//routes for leaves
app.use("/api/v1/leaves", leaveRouter)

//message 
import messageRouter from './routes/message.routes.js';

app.use('/api/v1/messages', messageRouter);




// http://localhost:8000/api/v1/users/register

export { app }