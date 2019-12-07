import axios from 'axios'


export const updateParty = () => {
    return async dispatch => {
        try {
                const res = await axios.get('/party')
                if(res){
                    dispatch({type: "UPDATE_PARTY", party: res.data})
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
                if(res){
                    dispatch({type: "CREATE_PARTY", name, partyId: res.data.partyId, leader})
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
                if(res){
                    dispatch({type: "DELETE_PARTY"})
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
                if(res){
                    dispatch({type: "ADD_MEMBER", party: res.data})
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
                if(res){
                    if(res.data){
                        dispatch({type: "REMOVE_MEMBER", party: res.data})
                    }else{
                        dispatch({type: "DELETE_PARTY"})
                    }
                }
            }

     catch (e) {
            console.log(e)
            dispatch( {type: "NO_CONNECTION", error: e})     
        }
    }
}