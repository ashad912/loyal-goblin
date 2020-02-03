import express from "express";
import subdomain from 'express-subdomain'
import fileUpload from "express-fileupload"
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { missionRouter } from "./routes/mission";
import { rallyRouter, updateRallyQueue } from "./routes/rally";
import { itemRouter } from "./routes/item";
import { productRouter } from "./routes/product";
import { partyRouter } from "./routes/party";
import { barmanRouter } from "./routes/barman";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from 'node-cron'
import socket from "socket.io";
import { socketRoomAuth, socketConnectAuth } from "./middleware/auth";
import { validateInMissionInstanceStatus, validateInShopPartyStatus, initCleaning } from './utils/methods' 

import _ from "lodash";

//TO-START: npm run-script dev


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

export const app = express();
const port = process.env.PORT || 4000;

app.use(
  fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    createParentPath: true,
    useTempFiles: false,
    abortOnLimit: true,
    //4 mb file upload limit
    limits: {fileSize: 4 * 1024 * 1024}
  })
);

app.use(cors());
app.use(express.static(path.join(__dirname, "../../static")));
app.use(subdomain('goblinbarman', express.static(path.join(__dirname, "../../barman/build"))));
app.use(subdomain('goblinadmin', express.static(path.join(__dirname, "../../admin/build"))));
app.use(express.static(path.join(__dirname, "../../client/build")));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/mission", missionRouter);
app.use("/rally", rallyRouter);
app.use("/item", itemRouter);
app.use("/product", productRouter);
app.use("/party", partyRouter);
app.use("/barman", barmanRouter)


app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

if(process.env.NODE_ENV === 'dev'){
  console.log(process.env.NODE_ENV)
  app.set('subdomain offset', 1);
}

app.get('*', (req, res) => {
  
  if(req.subdomains[0]==='goblinadmin'){
    res.sendFile(path.join(__dirname, '../../admin/build/index.html'));
  }else if(req.subdomains[0]==='goblinbarman'){
    res.sendFile(path.join(__dirname, '../../barman/build/index.html'));
  }else{
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  }
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/build/index.html'));
// })

var allClients = []; //all socket clients


const server = app.listen(port, () => {
  console.log(`Listening at ${port}`);
  initCleaning() 
  updateRallyQueue();

  cron.schedule('0 0 10 * * *', () => { //every day at 10:00 AM
    initCleaning() 
    allClients = []
  },{
    scheduled: true,
    timezone: "Europe/Warsaw" ///Warsaw UTC+1/UTC+2 -> stable hour despite of the timezone change
  })

});





//cant refactor socket methods to separate file :<< but it worked on another computer, maybe clean and rebuild?

var io = socket(server); //param is a server, defined upper


async function authenticate(socket, data, callback) {
  //console.log(socket.id, 'tried socket auth')
  let multipleSession = false
  try{
    const user = await socketConnectAuth(socket)

  
    if(allClients.length && allClients.filter((client) => client.userId === user._id.toString()).length > 0){
      multipleSession = true
      throw new Error('Multiple session error')  
    }
  
    const newClient = {socketId: socket.id, userId: user._id.toString(), roomId: user.party.toString()}
  
    allClients.push(newClient);
    return callback(null, true)
  }catch(e){
    if(multipleSession){
      return callback(new Error("multipleSession")); 
    }else{
      return callback(new Error("Invalid party conditions")); 
    }
  }
  

}



//io.on("connection", socket => {
const postAuthenticate = socket => {
  //console.log(allClients)
  
  console.log("New client connected", socket.id);

  socket.on("joinRoom", async (roomId) => {
    try{
      await socketRoomAuth(socket, roomId)

      socket.join(roomId, () => {
        console.log(socket.id, "joined the room", roomId);
        socket.broadcast.to(roomId).emit("joinRoom", roomId);    
      });
    }catch(e){
      console.log(e)
    }
  });

  socket.on("leaveRoom", data => {
    console.log(`User ${data.id} left the room ${data.roomId}`)
    io.to(data.roomId).emit("instanceRefresh", data.roomId);
    io.to(data.roomId).emit("leaveRoom", data.id);
    
  });


  socket.on("partyRefresh", async (data) => {
    try{
        console.log('Party has been changed!');
        socket.broadcast.to(data.roomId).emit("partyRefresh", data);
    }catch(e){
      console.log(e)
    }
  });

  socket.on("deleteRoom", roomId => {
    console.log('Party has been removed!');
    socket.broadcast.to(roomId).emit("deleteRoom", roomId);
    socket.broadcast.to(roomId).emit("instanceRefresh", roomId);
  })


  socket.on("modifyUserStatus", data => {
    //console.log(`${data.roomId} for user ${data.user._id} with status ${data.user.readyStatus} or ${data.user.inMission}`)
    socket.broadcast.to(data.roomId).emit("modifyUserStatus", data.user);
  });

  socket.on("instanceRefresh", roomId => {
    io.to(roomId).emit("instanceRefresh", roomId);
  });


  socket.on("addItem", async data => {
    await socketRoomAuth(socket, data.roomId)
    socket.broadcast.to(data.roomId).emit("addItem", data.item);
  });

  socket.on("deleteItem", async data => {
    await socketRoomAuth(socket, data.roomId)

    socket.broadcast.to(data.roomId)
      .emit("deleteItem", data.id);
  });

  socket.on("finishMission", async data => {
    await socketRoomAuth(socket, data.roomId)
    console.log('Mission is going to end!')
  
    socket.broadcast
      .to(data.roomId)
      .emit("finishMission", data.awards);
  });


 // io.of("mission")
          // .to(partyId)
          // .emit("joinRoom", partyId);

  /////////
 

//socket.on("disconnect", () => {
  
  // let i = allClients.findIndex((client) => client.socketId === socket.id);
  // if(i < 0){
  //   console.log("Client not found")
  // }else{
  //   allClients.splice(i, 1);
  //   console.log("Client disconnected", socket.id)
  // }
  
//});




};

async function disconnect(socket) {
  
  let i = allClients.findIndex((client) => client.socketId === socket.id);
  if(i < 0){
    console.log("Client not found")
  }else{
    const userId = allClients[i].userId
    const roomId = allClients[i].roomId

    if(await validateInShopPartyStatus(userId, false)){
      socket.broadcast.to(roomId).emit("partyRefresh", roomId);
    }
  
     
    if(await validateInMissionInstanceStatus(userId, false, false)){
      console.log(`${roomId} for user ${userId} with status inMission: false`)
      socket.broadcast.to(roomId).emit("modifyUserStatus", {_id: userId, inMission: false, readyStatus: false});
      console.log(`User ${userId} left the room ${roomId}`)
      socket.broadcast.to(roomId).emit("leaveRoom", userId);
      socket.broadcast.to(roomId).emit("instanceRefresh", roomId);
    }
    allClients.splice(i, 1);
    
    console.log("Client disconnected", socket.id)
  }
}

require('socketio-auth')(io, {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  disconnect: disconnect,
  timeout: 1000
});