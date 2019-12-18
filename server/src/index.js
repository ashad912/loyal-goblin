import express from "express";
const fileUpload = require("express-fileupload");
import { userRouter } from "./routes/user";
import { missionRouter } from "./routes/mission";
import { rallyRouter, updateRallyQueue } from "./routes/rally";
import { itemRouter } from "./routes/item";
import { productRouter } from "./routes/product";
import { partyRouter } from "./routes/party";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import socket from "socket.io";
import { socketRoomAuth, socketConnectAuth } from "./middleware/auth";
import { validateInMissionInstanceStatus } from './utils/methods' 
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
    createParentPath: true
  })
);

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/mission", missionRouter);
app.use("/rally", rallyRouter);
app.use("/item", itemRouter);
app.use("/product", productRouter);
app.use("/party", partyRouter);



app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

const server = app.listen(port, () => {
  console.log(`Listening at ${port}`);
  updateRallyQueue();
});

//cant refactor socket methods to separate file :<< but it worked on another computer, maybe clean and rebuild?

var io = socket(server); //param is a server, defined upper



var allClients = [];




async function authenticate(socket, data, callback) {
  let multipleSession = false
  try{
    const user = await socketConnectAuth(socket)

  
    if(allClients.length && allClients.filter((client) => client.userId === user._id.toString()).length > 0){
      multipleSession = true
      throw new Error('Multiple session error')  
    }
  
    //console.log(socket.id, user._id)
    const newClient = {socketId: socket.id, userId: user._id.toString()}
  
    allClients.push(newClient);
    return callback(null, true)
  }catch(e){
    if(multipleSession){
      return callback(new Error("multipleSession")); 
    }else{
      return callback(new Error("Invalid party conditions")); 
    }
    
    //return callback(new Error("Socket Auth failed"));
  }
  

}

// io.use(async (socket, next) => {

//   try{
    
    
//   }catch(e){
//     console.log(e)
//     await asyncEmit("multipleSession", socket)
//     socket.disconnect()
//     return next(new Error('Socket authentication error'));
//   }

//   return next();
  
// });

//const mission = io.of("/mission");




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
    socket.broadcast.to(data.roomId).emit("leaveRoom", data.id);
    socket.broadcast.to(data.roomId).emit("instanceRefresh", data.roomId);
  });


  socket.on("addMemberToRoom", async (roomId) => {
    try{
        console.log('Party has been changed!');
        socket.broadcast.to(roomId).emit("addMemberToRoom", roomId);
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
    console.log(`${data.roomId} for user ${data.user._id} with status ${data.user.readyStatus} or ${data.user.inMission}`)
    socket.broadcast.to(data.roomId).emit("modifyUserStatus", data.user);
  });

  socket.on("instanceRefresh", roomId => {
    io.to(roomId).emit("instanceRefresh", roomId);
  });

 // io.of("mission")
          // .to(partyId)
          // .emit("joinRoom", partyId);

  /////////
  socket.on("addItem", async data => {
    
      await socketRoomAuth(socket, roomId)

      socket.broadcast.to(data.roomId).emit("addItem", data.item);
    
    
  });

  socket.on("deleteItem", async data => {
    await socketRoomAuth(socket, roomId)

    socket.broadcast.to(data.roomId)
      .emit("deleteItem", data.id);
  });

  // socket.on("registerUser", data => {
  //   io.of("mission")
  //     .to(data.roomId)
  //     .emit("registerUser", data.user);
  // });



 

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
    const roomId = await validateInMissionInstanceStatus(userId)
    if(roomId){
      console.log(`${roomId} for user ${userId} with status inMission: false`)
      socket.broadcast.to(roomId).emit("modifyUserStatus", {_id: userId, inMission: false});
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