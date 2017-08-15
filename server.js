import express from 'express';
import path from 'path';

import {MongoClient,ObjectId} from 'mongodb';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import assert from 'assert';

import config from './config';

import Item from './models/item'
import User from './models/user'

//import io from 'socket.io';


const server = express();



server.set('view engine','ejs');
server.set('views',path.join(__dirname,'views'));


server.use(bodyParser.urlencoded({extended:true}));

server.get("/",(req,res) => {
    res.redirect("/all");
});



server.get("/all",(req,res) => {
    Item.find({}).exec((err,data) => {
            console.log(data);
            res.render("all",{list:data});
        });
});


server.post("/add",(req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    let newItem = new Item({
        title:title,
        content:content
    })

    newItem.save((err, instance) => {
        if(err){
            return console.error(err);
        }
        res.redirect("/all")
    });
});


server.post("/delete",(req,res) => {
    let idToDelete = req.body.id;

    Item.find({_id:ObjectId(idToDelete)}).remove().exec((err,data) => {
        if(err){
            return console.error(err);
        }
        res.redirect("/all");
    });
});


server.post("/update",(req,res) => {
    let idToUpdate = req.body.id;
    let newTitle = req.body.title;

    Item.update({_id:ObjectId(idToUpdate)},{title:newTitle},(err,data) => {
        if(err){
            return console.error(err);
        }
        res.redirect("/all")

    })

});



const serverObj = server.listen(config.port, config.host, ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});

const io = require('socket.io')(serverObj);

///////////////////SOCKET STUFF////////////////////////////////////////////////

server.get("/socket-test",(req,res) => {
    res.render("socket-test")

});

io.on('connection',(s) => {
    console.log("Someone has connected to a websocket.");
    s.on("test-data",(data)=>{
        console.log("recieved on test-data: ",data);
        s.emit("test-data","I recieved your test data \""+data+"\"");
    });


    s.on("chat",(data)=>{
        console.log("recieved on chat: ",data);
        s.broadcast.emit("chat",{message:data.message,username:data.username});
        s.emit("chat",{message:data.message,username:data.username});
    });


    s.on("disconnect",()=>{console.log("User disconnected")});
});


/////////////////BCRYPT STUFF///////////////////////////////////

import bcrypt from 'bcrypt';

const saltRounds = 10;


/////////////////PASSPORT STUFF/////////////////////////////////

import passport from 'passport';
let LocalStrategy = require('passport-local').Strategy
server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser(function(user,done){
    done(null,user._id);
})

passport.deserializeUser(function(id,done){
    User.findById(id, (err,user) => {
        done(err,user);
    })
})

passport.use(new LocalStrategy(
    (username,password,done) => {
        bcrypt.genSalt(saltRounds,function(err,salt){
            bcrypt.hash(password,salt,(err,hash)=>{
                console.log("OHHHH PUT ME IN THE DB: ",hash);
            });
        });

            User.findOne({username:username},(err,user) => {
                if(err){
                    console.log(err);
                    return done(err);
                };
                if(!user){
                    console.log("no user");
                    return done(null,false,{message:"bad user"});
                };
                //if(user.password != hash){
                console.log("PWD:",password);
                console.log("HASH:",user.password);
                bcrypt.compare(password,user.password,(err,res) =>{
                    console.log("bad pwd, ",err);
                    if(!res){
                            return done(null,false,{message:"bad pwd"});
                    }
                });
                return done(null,user);

                });




}));

server.get("/login",(req,res) => {
    res.render("login");

});

server.post("/login",passport.authenticate("local",{
    successRedirect: "/all",
    failureRedirect: "/login",
    failureFlash:false,
    session:true
}));




























//
