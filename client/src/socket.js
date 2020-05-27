import io from 'socket.io-client'

export const socket =  io({
  autoConnect: false,
})


//SUBSCRIBE

export const socketAuthenticatedSubscribe = (callback) => {
    socket.on('authenticated', () => {
        return callback()
    })
}

export const socketUnauthorizedSubscribe = (callback) => {
    socket.on('unauthorized', (err) => {
        return callback(err)
    })
}


export const joinPartySubscribe = (roomId) => {
    socket.on('joinParty', roomId, () => {
        return  roomId
    })
}

export const leavePartySubscribe = (id) => {
    socket.on('leaveParty', id, () => {
        return id
    })
}

export const refreshPartySubscribe = (data) => {
    socket.on('refreshParty', data, () => {
        return data
    })
}

export const deletePartySubscribe = (roomId) => {
    socket.on('deleteParty', roomId, () => {
        return roomId
    })
}

export const addItemSubscribe = (item) => {
    socket.on('addItem', item, () => {
        return item
    })
}

export const deleteItemSubscribe = (id) => {
    socket.on('deleteItem', id, () => {
        return id
    })
}

export const finishMissionSubscribe = (awards) => {
    socket.on('finishMission', awards, () => {
        return awards
    })
}

export const modifyUserStatusSubscribe = (data) => {
    socket.on('modifyUserStatus', data, () => {
        return data
    })
}

export const refreshMissionsSubscribe = (roomId) => {
    socket.on('refreshMissions', roomId, () => {
        return roomId
    })
}

// export const multipleSessionSubscribe = (socketId) => {
//     socket.on('multipleSession', socketId, () => {
//         return socketId
//     })
// }

//EMIT

export const socketAuthenticateEmit = () => {
    socket.emit('authentication', {});
}

export const joinPartyEmit = (roomId) => {
    socket.emit('joinParty', roomId)
}

export const leavePartyEmit = (id, roomId) => {
    const data = {id, roomId}
    socket.emit('leaveParty', data)
}

export const refreshPartyEmit = (roomId, authCheck) => {
    socket.emit('refreshParty', {roomId, authCheck})
}

export const deletePartyEmit = (roomId) => {
    socket.emit('deleteParty', roomId)
}

export const addItemEmit = (item, roomId) => {
    const data = {item, roomId}
    socket.emit('addItem', data)
}

export const deleteItemEmit = (id, roomId) => {
    const data = {id, roomId}
    socket.emit('deleteItem', data)
}

export const finishMissionEmit = (awards, roomId) => {
    const data = {awards, roomId}
    socket.emit('finishMission', data)
}

export const modifyUserStatusEmit = ( user, roomId) => {
    const data = {user, roomId}
    socket.emit('modifyUserStatus', data)
}

export const refreshMissionsEmit = (roomId) => {
    socket.emit('refreshMissions', roomId)
}