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
import { socketJoinRoomAuth, socketConnectAuth } from "./middleware/auth";
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

io.use(async (socket, next) => {

  try{
    await socketConnectAuth(socket)
    
  }catch(e){
    console.log(e)
    return next(new Error('authentication error'));
  }

  return next();
  
});

//const mission = io.of("/mission");

io.on("connection", socket => {
  
  console.log("New client connected", socket.id);

  socket.on("joinRoom", async (roomId) => {
    try{
      await socketJoinRoomAuth(socket, roomId)

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
  })


 // io.of("mission")
          // .to(partyId)
          // .emit("joinRoom", partyId);

  /////////
  socket.on("addItem", data => {
    io.of("mission")
      .to(data.roomId)
      .emit("addItem", data.item);
  });

  socket.on("deleteItem", data => {
    io.of("mission")
      .to(data.roomId)
      .emit("deleteItem", data.id);
  });

  // socket.on("registerUser", data => {
  //   io.of("mission")
  //     .to(data.roomId)
  //     .emit("registerUser", data.user);
  // });



  socket.on("modifyUserStatus", data => {
    io.of("mission")
      .to(data.roomId)
      .emit("modifyUserStatus", data.user);
  });

  socket.on("disconnect", () => console.log("Client disconnected", socket.id));
});

//api -> create event instance
//-> promise -> authMiddleware + authEventMiddleware -> load component with id of instance (!!!) -> socket emit connection
//==io.use -> query being in party by token->user->party //additional eventToken
//-> joining room refs by instance id
