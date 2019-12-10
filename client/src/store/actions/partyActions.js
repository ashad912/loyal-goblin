import axios from 'axios'
import {socket, joinRoomEmit, leaveRoomEmit, refreshRoomEmit, deleteRoomEmit} from '../../socket'



export const updateParty = () => {
    return async dispatch => {
        
        try {
            const res = await axios.get('/party')
            
            if(res.data){
                dispatch({type: "UPDATE_PARTY", party: res.data})
                const party = res.data
                
                if(!socket.connected){
                    socket.open()
                    joinRoomEmit(party._id)
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
                if(res.data){
                    dispatch({type: "CREATE_PARTY", name, partyId: res.data.partyId, leader})

                    if(!socket.connected){
                        socket.open()
                        joinRoomEmit(res.data.partyId)
                    }
                    
                }
            }

     catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const deleteParty =  () => {
    return async dispatch => {
        try {
                const res = await axios.delete('/party/remove')
                if(res.data){
                    dispatch({type: "DELETE_PARTY"})
                    deleteRoomEmit(res.data._id)
                }
            }

     catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const addMember =  (partyId, memberId) => {
    return async dispatch => {
        try {
                const res = await axios.patch('/party/addMember', {partyId, memberId})
                if(res.data){
                    dispatch({type: "ADD_MEMBER", party: res.data})
                    refreshRoomEmit(res.data._id)
                }
            }

     catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}

export const removeMember =  (partyId, memberId) => {
    return async dispatch => {
        try {
                const res = await axios.patch('/party/leave', {partyId, memberId})
                console.log(res.data)
                
                if(res.data !== null){
                    dispatch({type: "REMOVE_MEMBER", party: res.data})
                    console.log(memberId, partyId)
                    leaveRoomEmit(memberId, partyId)
                }else{
                    dispatch({type: "DELETE_PARTY"})
                    deleteRoomEmit(res.data._id)
                }

                leaveRoomEmit(memberId, partyId)
                    
                
            }

     catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}