import app from '@app'
import cron from 'node-cron'
import socket from "socket.io";
import socketIOAuth from 'socketio-auth'


import { MissionInstanceExpiredEvent } from "@models/missionInstanceExpiredEvent";
import { OrderExpiredEvent } from "@models/orderExpiredEvent";

import * as utils from '@utils/methods' 
import rallyStore from '@store/rally.store'
import SocketController from '@controllers/socket.controller'

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Listening at ${port}`);
  utils.initCleaning() 
  rallyStore.updateQueue();

  if(process.env.REPLICA === 'true'){
    MissionInstanceExpiredEvent.registerWatch()
    OrderExpiredEvent.registerWatch()
  }

  cron.schedule('0 0 10 * * *', () => { //every day at 10:00 AM
    utils.initCleaning() 
    socketController.allClients = []
  },{
    scheduled: true,
    timezone: "Europe/Warsaw" ///Warsaw UTC+1/UTC+2 -> stable hour despite of the timezone change
  })

});

const socketController = new SocketController()



socketIOAuth(socket(server), {
  authenticate: function(socket, data, callback){socketController.authenticate(socket, data, callback)},
  postAuthenticate: function(socket){socketController.postAuthenticate(socket)},
  disconnect: function(socket){socketController.disconnect(socket)},
  timeout: 5000
});