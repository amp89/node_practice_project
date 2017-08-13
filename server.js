//const express = require('express');
import express from 'express';
import path from 'path';

import {MongoClient,ObjectId} from 'mongodb';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import assert from 'assert';

import config from './config';

import Item from './models/item'

const server = express();

server.set('view engine','ejs');
server.set('views',path.join(__dirname,'views'));

server.use(bodyParser.urlencoded({extended:true}));

server.get("/",(req,res) => {
    //res.send("hello friend");
    res.render("index",{greeting:"Hello Friend!"});

});


let db;//This can probably just move into models
//connect
console.log(config.mongodbUri);
/*
mongoose.connect(config.mongodbUri,{uri_decode_auth:true,useMongoClient:true});
mongoose.Promise = global.Promise
db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error w/ mongoose....'));
db.once('openUri',()=>{console.log("Mongo is now connected via mongoose.")});
*/
//db stuff


///////////ROUTES//////////////////////////////

server.get("/all",(req,res) => {
    Item.find({}).exec((err,data) => {
            console.log(data);
            res.render("all",{list:data});
        });


    /*
    db.collection("test").find({}).toArray((err,data) => {
        assert.equal(null,err);
        console.log("------- all ---------");
        console.log(data);
        let all_results = data;
        res.render("all",{list:all_results});
    });
    */
});

server.post("/add",(req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    //let myclass = mongoose.model("Item");
    let newItem = new Item({
        title:title,
        content:content
    })

    newItem.save((err, instance) => {
        if(err){
            return console.error(err);
        }
        console.log("Saved... ",instance);
        res.redirect("/all")
    });

    /*
    db.collection('test').insertOne({'title':title,'content':content},function(err,r){
        assert.equal(err,null);
        assert.equal(1,r.insertedCount);
        console.log("Inserted ",r.insertedCount," record(s)");
        db.collection("test").find({}).toArray((err,data) => {
            assert.equal(null,err);
            console.log(data);
            let all_results = data;
            res.render("all",{list:all_results});
        });
    })
    */
});

server.post("/delete",(req,res) => {
    let idToDelete = req.body.id;
    console.log("ID: ",idToDelete);
    Item.find({_id:ObjectId(idToDelete)}).remove().exec((err,data) => {
        console.log('deleted thing');
        res.redirect("/all");

    });





});


server.post("/update",(req,res) => {
    let idToUpdate = req.body.id;
    let newTitle = req.body.title;

    console.log("ID: ",idToUpdate);
    Item.update({_id:ObjectId(idToUpdate)},{title:newTitle},(err,data) => {
        console.log("Updated thing");
        res.redirect("/all")

    })
    /*
    db.collection("test").updateOne({_id:ObjectId(idToUpdate)},{$set:{title:newTitle}},(err,ref) => {
        assert.equal(err,null);
        console.log("updated rec id: ",ref._id);

        db.collection("test").find({}).toArray((err,data) => {
            assert.equal(null,err);
            console.log(data);
            let all_results = data;
            res.render("all",{list:all_results});
        });

    })
    */



});



server.listen(config.port, config.host, ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});
