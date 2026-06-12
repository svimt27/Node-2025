import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
app.use(cors({
    origin:process.env.CROS_ORIGIN,
    crendentials:true

}));

app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRouter from "./routes/user.router.js";

/* routes  declartion*/

app.use('/api/v1/users',userRouter)


export {app}