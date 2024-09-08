
const express = require('express');
const app = express();
const path = require('path');
const http = require("http");
const socketio = require("socket.io");//runs on http server for running
const server = http.createServer(app);//give server
const io = socketio(server); // calls socketio func and pass server which we use in future 
server.listen(3000, () => console.log('Server running on port 3000'));

app.set("view engine" , "ejs");//setup ejs 
app.use(express.static(path.join(__dirname,"public"))) // set public,  images css  we can uses 
io.on("connection",function (socket) {
    socket.on("send-location",function(data){
        io.emit("recieve-location",{id:socket.id,...data});//we will send location of every user
    });
    console.log("connected");
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    });
});

app.get("/",function(req,res) {
    res.render("index"); // routing
});