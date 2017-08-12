//const express = require('express');
import express from 'express';
import path from 'path';

import MongoClient from 'mongodb';

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
MongoClient.connect(config.mongodbUri, (err,d) => {

    assert.equal(null,err);
    console.log("Mongo is connected!");
    db=d;

})

///////////ROUTES//////////////////////////////

server.get("/all",(req,res) => {

    res.render("all",{list:[
            {
                id:1,
                title:'first'
            },

            {
                id:2,
                title:'second'
            },

            {
                id:3,
                title:'third'
            },

        ]});
});

server.post("/add",(req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    console.log("Title: ",title,", ","Content: ",content)
    res.render("all",{list:[
            {
                id:1,
                title:'first'
            },

            {
                id:2,
                title:'second'
            },

            {
                id:3,
                title:'third'
            },

        ]});
});

server.post("/delete",(req,res) => {
    let idToDelete = req.body.id;
    console.log("ID: ",idToDelete);
    res.render("all",{list:[
            {
                id:1,
                title:'first'
            },

            {
                id:2,
                title:'second'
            },

            {
                id:3,
                title:'third'
            },

        ]});
});



server.listen(config.port, config.host, ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});
