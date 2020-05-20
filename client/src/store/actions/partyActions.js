import axios from 'axios'
import {socket, socketAuthenticateEmit, leavePartyEmit, refreshPartyEmit, deletePartyEmit} from '../../socket'
import { getMissionList } from './missionActions'


export const updateParty = (params) => {
    return async dispatch => {
        
            try {
                
                const query = params && params.autoFetch ? '?autoFetch=true' : ''
                const res = await axios.get('/party' + query)
                
                if(res.data && res.status === 200){
                    dispatch({type: "UPDATE_PARTY", party: res.data.party})
                    if(res.data.bag){
                       // console.log(res.data.bag)
                        dispatch({type: "UPDATE_PROFILE_BAG", bag: res.data.bag})
                    }
                    
                    
                    if(!socket.connected){
                        //console.log('connect from updateParty')
                        socket.open()
                        socketAuthenticateEmit()
                    }
                    
                }else{
                    dispatch({type: "DELETE_PARTY"})
                }
            } catch (e) {
                console.log(e)
                dispatch( {type: "NO_CONNECTION", error: e})
            }     
    }
}

export const createParty = (name, leader) => {
    return async dispatch => {
        try {
            const res = await axios.post('/party/create', {name})
            
            //dispatch({type: "CREATE_PARTY", name, partyId: res.data.partyId, leader})
            dispatch({type: "CREATE_PARTY", party: res.data})
            
            if(!socket.connected){
                //console.log('connect from createParty')
                socket.open()
                socketAuthenticateEmit()
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
            dispatch(getMissionList())   
            
            
            deletePartyEmit(res.data._id)
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
            
            const party = res.data
            dispatch({type: "ADD_MEMBER", party})
            dispatch(getMissionList())   
            refreshPartyEmit(party._id)
     
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
            //console.log(res.data, res.data.length) //res.data returns string -> if null string length:0
            dispatch(getMissionList())
            
            leavePartyEmit(memberId, partyId) //not self-disconnected - we have to deliever message

            if(res.data){ //check also string length
                dispatch({type: "REMOVE_MEMBER", party: res.data}) //updating leader redux - he has just dropped the member
            }else{
                
                dispatch({type: "DELETE_PARTY"}) //clearing member redux - he has just left (only for member!)
                if(socket.connected){
                    socket.disconnect()
                }  
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
            
            if(res.data){ 
                const party = res.data
                dispatch({type: "GIVE_LEADER", party}) //updating leader redux - he has just dropped the member
                dispatch(getMissionList()) 
                refreshPartyEmit(party._id) 
            }        
        }catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}