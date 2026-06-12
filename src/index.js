import connectDB from "./db/index.js";
import {app} from "./app.js";

connectDB().then(()=>{
    app.listen(`${process.env.PORT}`,()=>{
        console.log('Port is listening on : ' , `${process.env.PORT}`);   
    })
}).catch((err)=>{
    console.error("Connection faild",err);
})