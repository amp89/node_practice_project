import mongoose from "mongoose";

import config from '../config';


let db;
mongoose.connect(config.mongodbUri,{useMongoClient:true});

mongoose.Promise = global.Promise

db = mongoose.connection;

db.on("error",console.error.bind(console,'connection error w/ mongoose....'));

db.once('openUri',()=>{console.log("Mongo is now connected via mongoose.")});


/*
var itemSchema = mongoose.Schema({title:String,content:String});
var Item = mongoose.model('Item',itemSchema);
*/
let userSchema = mongoose.Schema({username:String,password:String});
let User = mongoose.model("User",userSchema)



export default User;
