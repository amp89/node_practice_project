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



server.listen(config.port, config.host, ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});
