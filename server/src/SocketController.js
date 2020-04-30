import { socketRoomAuth, socketConnectAuth } from "./middleware/auth";
import { validateInMissionInstanceStatus, validateInShopPartyStatus, initCleaning } from './utils/methods' 

class SocketController{
    constructor(){
        this.allClients = [];
    }

    async authenticate(socket, data, callback) {
        //console.log(socket.id, 'tried socket auth')
        let multipleSession = false
        try{
          const user = await socketConnectAuth(socket)
      
        
          if(this.allClients.length && this.allClients.filter((client) => client.userId === user._id.toString()).length > 0){
            multipleSession = true
            throw new Error('Multiple session error')  
          }
        
          const newClient = {socketId: socket.id, userId: user._id.toString(), roomId: user.party.toString()}
        
          this.allClients.push(newClient);
          return callback(null, true)
        }catch(e){
          if(multipleSession){
            return callback(new Error("multipleSession")); 
          }else{
            console.log(e)
            return callback(new Error("Invalid party conditions")); 
          }
        }
        
      
    }
      
    postAuthenticate(socket){
       
        console.log("New client connected", socket.id);
      
        socket.on("joinParty", async (roomId) => {
          try{
            await socketRoomAuth(socket, roomId)
      
            socket.join(roomId, () => {
              console.log(socket.id, "joined the room", roomId);
              socket.broadcast.to(roomId).emit("joinParty", roomId);    
            });
          }catch(e){
            console.log(e)
          }
        });
      
        socket.on("leaveParty", data => {
          console.log(`User ${data.id} left the room ${data.roomId}`)
          socket.broadcast.to(data.roomId).emit("leaveParty", data.id);
          
        });
      
        socket.on("refreshParty", async (data) => {
          console.log('Party has been changed!');
          socket.broadcast.to(data.roomId).emit("refreshParty", data);
        });
      
        socket.on("deleteParty", roomId => {
          console.log('Party has been removed!');
          socket.broadcast.to(roomId).emit("deleteParty", roomId);
        })
      
        socket.on("refreshMissions", roomId => {
          socket.broadcast.to(roomId).emit("refreshMissions", roomId);
        });
      
      
        socket.on("modifyUserStatus", data => {
          socket.broadcast.to(data.roomId).emit("modifyUserStatus", data.user);
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
      
    };
      
    async disconnect(socket) {
    
        let i = this.allClients.findIndex((client) => client.socketId === socket.id);
        
        if(i < 0){
            console.log("Client not found")
        }else{
            const userId = this.allClients[i].userId
            const roomId = this.allClients[i].roomId
        
            if(await validateInShopPartyStatus(userId, false)){
            socket.broadcast.to(roomId).emit("partyRefresh", roomId);
            }
        
            
            if(await validateInMissionInstanceStatus(userId, false, false)){
            console.log(`${roomId} for user ${userId} with status inMission: false`)
            socket.broadcast.to(roomId).emit("modifyUserStatus", {_id: userId, inMission: false, readyStatus: false});
            console.log(`User ${userId} left the room ${roomId}`)
            socket.broadcast.to(roomId).emit("refreshParty", userId);
            }
            this.allClients.splice(i, 1);
            
            console.log("Client disconnected", socket.id)
        }
    }
}

export default SocketController