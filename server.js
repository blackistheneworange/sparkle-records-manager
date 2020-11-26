const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const indexRouter = require('./src/routes');

//Basic app
const port = process.env.PORT || 3000;
const appName = 'Sparkle Records Manager';

//middlewares
if(process.env.NODE_ENV!=='production'){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Methods","GET,POST, PUT, DELETE, OPTIONS");
        if(req.method==='OPTIONS'){
            return res.send();
        }
        next();
    });
}
app.use(bodyParser.json(), bodyParser.urlencoded({extended:false}));
app.use(express.static(path.resolve(__dirname,'public')));


app.use('/api/records', indexRouter);


app.use((err, req, res, next)=>{
    return res.status(err.status||500).send(err.message||err);
})

//socket
let clients = 0;
io.on('connection', (socket) => {
    ++clients;
    io.emit('client',clients)

    //add record
    socket.on('add',(data)=>{
        socket.broadcast.emit('add',data)
    })

    //update record
    socket.on('update',(data)=>{
        socket.broadcast.emit('update',data)
    })

    //delete record
    socket.on('delete',(data)=>{
        socket.broadcast.emit('delete',data)
    })

    //disconnect
    socket.on('disconnect', () => {
        --clients;
        io.emit('client', clients)
    });
});

http.listen(port,()=>{
    console.log(`${appName} listening on port ${port}`);
})
