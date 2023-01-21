import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";  
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js"
import cors from "cors";
import UploadRoute from "./Routes/UploadRoute.js"

const app = express();

app.use(express.static('public'))
app.use('/images',express.static("images"))

app.use(bodyParser.json({limit:'30mb',extended:true}))

app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors());
dotenv.config();


mongoose.connect(process.env.MONGO_DB,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>app.listen(process.env.PORT ||3000,()=>{
    console.log(`connected to ${process.env.PORT}`);
})).catch((e)=>console.log(e));


app.use('/auth',AuthRoute);
app.use('/user',UserRoute);
app.use('/post', PostRoute)
app.use('/upload', UploadRoute)

app.use('/public/images/:id',(req,res)=>{
    const img = req.params;
    res.sendFile(path.join(__dirname, '/public/images/', img));

})