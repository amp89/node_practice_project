//const express = require('express');
import express from 'express'
const config = require('./config')
const server = express();


server.get("/",(req,res) => {

    res.send("hello friend");

});


//server.listen(config.port, config.host, ()=>{
server.listen(8080, '0.0.0.0', ()=>{
    console.info("Listening on ",config.host," PORT ",config.port);
});
