import connectDB from "./db/index.js";
import {app} from "./app.js";

connectDB().then(()=>{
    app.listen(`${process.env.PORT}`,()=>{
        console.log('Port is listening on : ' , `${process.env.PORT}`);   
    })
}).catch((err)=>{
    console.error("Connection faild",err);
})

// const app = express()
// (()=>{
//     try {
//      await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`) 
//      app.on('error',(error)=>{
//        console.log("Error",error)
//        throw error
//      })      
//      app.listen(process.env.PORT,()=>{
//   console.log(`Port is listenig on this ${PORT}`)
//      })
//     } catch (error) {
//         console.log(error)
//     }
// })()