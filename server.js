//const express = require('express');
import express from 'express';
import path from 'path';

import MongoClient from 'mongodb';

const config = require('./config');
const server = express();

server.set('view engine','ejs');
server.set('views',path.join(__dirname,'views'));


server.get("/",(req,res) => {

    //res.send("hello friend");
    res.render("index",{greeting:"Hello Friend!"});

});


server.get("/all",(req,res) => {

    res.render("all",{list:['list','of','things']});
});


//server.listen(config.port, config.host, ()=>{
server.listen(8080, '0.0.0.0', ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);

});
