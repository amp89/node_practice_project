//const express = require('express');
import express from 'express';
import path from 'path';

import {MongoClient,ObjectId} from 'mongodb';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import assert from 'assert';

import config from './config';

const server = express();

server.set('view engine','ejs');
server.set('views',path.join(__dirname,'views'));

server.use(bodyParser.urlencoded({extended:true}));

server.get("/",(req,res) => {
    //res.send("hello friend");
    res.render("index",{greeting:"Hello Friend!"});

});


let db;

/*
MongoClient.connect(config.mongodbUri, (err,d) => {

    assert.equal(null,err);
    console.log("Mongo is connected!");
    db=d;

})
*/
///////////ROUTES//////////////////////////////

server.get("/all",(req,res) => {

    db.collection("test").find({}).toArray((err,data) => {
        assert.equal(null,err);
        console.log(data);
        let all_results = data;
        res.render("all",{list:all_results});
    });

});

server.post("/add",(req,res) => {
    let title = req.body.title;
    let content = req.body.content;
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

});

server.post("/delete",(req,res) => {
    let idToDelete = req.body.id;
    console.log("ID: ",idToDelete);
    db.collection("test").deleteOne({_id:ObjectId(idToDelete)},(err,ref) => {
        assert.equal(err,null);
        console.log("Deleted rec.");

        db.collection("test").find({}).toArray((err,data) => {
            assert.equal(null,err);
            console.log(data);
            let all_results = data;
            res.render("all",{list:all_results});
        });

    })



});


server.post("/update",(req,res) => {
    let idToUpdate = req.body.id;
    let newTitle = req.body.title;

    console.log("ID: ",idToUpdate);
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



});



server.listen(config.port, config.host, ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});
