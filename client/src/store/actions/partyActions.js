import axios from 'axios'
import {socket, socketAuthenticateEmit, joinRoomEmit, leaveRoomEmit, partyRefreshEmit, deleteRoomEmit, instanceRefreshEmit} from '../../socket'
import { setActiveInstanceId } from './missionActions'


export const updateParty = (params, socketAuthReconnect) => {
    return async dispatch => {
        
            try {
                console.log('updateParty')
                let query = ''
                if(params && params.autoFetch){
                    query ='?autoFetch=true'
                }
                const res = await axios.get('/party' + query)
                
                if(res.data && res.status === 200){
                    dispatch({type: "UPDATE_PARTY", party: res.data})
                    const party = res.data
                    
                    if(!socket.connected){
                        //console.log('connect from updateParty')
                        socket.open()
                        socket.emit('authentication', {});
                        
                    }
                    
                }else{
                    dispatch({type: "DELETE_PARTY"})
                }
               
            }
    
            catch (e) {
                console.log(e)
                dispatch( {type: "NO_CONNECTION", error: e})
                
                    
            }
          
    }
}

export const createParty =  (name, leader) => {
    return async dispatch => {
        try {
            const res = await axios.post('/party/create', {name})
            
            dispatch({type: "CREATE_PARTY", name, partyId: res.data.partyId, leader})

            if(!socket.connected){
                console.log('connect from createParty')
                socket.open()
                socket.emit('authentication', {});
            }     
        }catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})  
        }
    }
}

export const deleteParty =  () => {
    return async dispatch => {
        try {
            const res = await axios.delete('/party/remove')
            
            dispatch({type: "DELETE_PARTY"})
            instanceRefreshEmit(res.data._id)
            deleteRoomEmit(res.data._id)
            

            if(socket.connected){
                socket.disconnect()
            }     
        }catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const addMember =  (partyId, memberId) => {
    return async dispatch => {
        try {
            const res = await axios.patch('/party/addMember', {partyId, memberId})
            console.log(res.data)
            dispatch({type: "ADD_MEMBER", party: res.data})
            partyRefreshEmit(res.data._id)
            instanceRefreshEmit(res.data._id)
                
        }catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const removeMember =  (partyId, memberId) => {
    return async dispatch => {
        try {
                const res = await axios.patch('/party/leave', {partyId, memberId})
                console.log(res.data, res.data.length) //res.data returns string -> if null string length:0
                
                if(res.data){ //check also string length
                    
                    
                    dispatch({type: "REMOVE_MEMBER", party: res.data}) //updating leader redux - he has just dropped the member
                    leaveRoomEmit(memberId, partyId)  //from party point of view - some user left the party with success - take his id and trigger leave event
                    instanceRefreshEmit(partyId)
                }else{
                    
                    leaveRoomEmit(memberId, partyId)
                    instanceRefreshEmit(partyId)
                    if(socket.connected){
                        socket.disconnect()
                    }
                    dispatch({type: "DELETE_PARTY"}) //clearing member redux - he has just left (only for member!)
                }

                
        }catch (e) {
            console.log(e)
            
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}


export const giveLeader =  (partyId, memberId) => {
    return async dispatch => {
        try {
                const res = await axios.patch('/party/leader', {partyId, memberId})
                console.log(res.data, res.data.length) //res.data returns string -> if null string length:0
                
                if(res.data){ 
                    
                    
                    dispatch({type: "GIVE_LEADER", party: res.data}) //updating leader redux - he has just dropped the member
                    partyRefreshEmit(res.data._id)
                    instanceRefreshEmit(res.data._id)
                    
                }
               
                
        }catch (e) {
            console.log(e)
            
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}