import cron from 'node-cron'
import socket from "socket.io";
import socketIOAuth from 'socketio-auth'

import keys from '@config/keys'
import logger from '@logger';
import { MissionInstanceExpiredEvent } from "@models/missionInstanceExpiredEvent";
import { OrderExpiredEvent } from "@models/orderExpiredEvent";

import * as utils from '@utils/functions' 
import rallyStore from '@store/rally.store'
import socketController from '@controllers/socket.controller'

const port = keys.dbPort;

(async function (){

  const app = await require('@app').default()

  //const app = await getApp()
  const server = app.listen(port, () => {
    logger.info(`Listening at ${port}`);
    utils.initCleaning() 
    rallyStore.updateQueue();
  
    if(keys.replica){
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
  
  
  socketIOAuth(socket(server), {
    authenticate: function(socket, data, callback){socketController.authenticate(socket, data, callback)},
    postAuthenticate: function(socket){socketController.postAuthenticate(socket)},
    disconnect: function(socket){socketController.disconnect(socket)},
    timeout: 5000
  });

})()

