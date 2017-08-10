const express = require('express')
    , http = require('http')
    , sockets = require('socket.io')


const config = require('./server/config')

const app = express()

const server = http.createServer(app)
const io = sockets(server);

const port = config.port

let users = []
let connections = []
let messages = []

app.use(express.static('./public'));

io.on('connection', function(socket) {
    connections.push(socket);
    console.log(`${socket.id} connected: ${connections.length} acitve connections.`)

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket),1);
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == socket.id){
                users.splice(i, 1);
                break;
            }
        }
        console.log(`Connection disconnected: ${connections.length} active connections.`)
        io.sockets.emit('update users', {users: users});
        if (!connections.length){
            messages=[];
        }          
    })

    socket.on('send message', function(data) {
        data.timestamp = new Date();
        messages.push(data)
        io.sockets.emit('message', data)
    })
    socket.on('login', function (data) {
        users.push({
            name: data,
            id: socket.id
        })
        socket.emit('logged in', {loggedIn: true, currentUser: data, history: messages})
        io.sockets.emit('update users', {users: users})
        socket.emit('update users', {users: users})
    })
})

server.listen(port, _=>{
    console.log('Listening on port: '+ port)
})

