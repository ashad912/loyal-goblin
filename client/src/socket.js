import io from 'socket.io-client'

export const socket =  io({
  autoConnect: false,
})


//SUBSCRIBE
export const joinRoomSubscribe = (roomId) => {
    socket.on('joinRoom', roomId, () => {
        return  roomId
    })
}

export const leaveRoomSubscribe = (id) => {
    socket.on('leaveRoom', id, () => {
        return id
    })
}

export const addMemberToRoomSubscribe = (roomId) => {
    socket.on('addMemberToRoom', roomId, () => {
        return  roomId
    })
}

export const deleteRoomSubscribe = (roomId) => {
    socket.on('deleteRoom', roomId, () => {
        return  roomId
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

// export const registerUserSubscribe = (user) => {
//     socket.on('registerUser', user, () => {
//         return user
//     })
// }

// export const unregisterUserSubscribe = (id) => {
//     socket.on('unregisterUser', id, () => {
//         return id
//     })
// }

export const modifyUserStatusSubscribe = (data) => {
    socket.on('modifyUserStatus', data, () => {
        return data
    })
}

export const instanceRefreshSubscribe = (roomId) => {
    socket.on('instanceRefresh', roomId, () => {
        return roomId
    })
}

//EMIT
export const joinRoomEmit = (roomId) => {
    socket.emit('joinRoom', roomId)
}

export const leaveRoomEmit = (id, roomId) => {
    const data = {id: id, roomId: roomId}
    socket.emit('leaveRoom', data)
}

export const addMemberToRoomEmit = (roomId) => {
    socket.emit('addMemberToRoom', roomId)
}

export const deleteRoomEmit = (roomId) => {
    socket.emit('deleteRoom', roomId)
}

export const addItemEmit = (item, roomId) => {
    const data = {item: item, roomId: roomId}
    socket.emit('addItem', data)
}

export const deleteItemEmit = (id, roomId) => {
    const data = {id: id, roomId: roomId}
    socket.emit('deleteItem', data)
}

// export const registerUserEmit = ( user, roomId) => {
//     const data = {user: user, roomId: roomId}
//     socket.emit('registerUser', data)
// }

// export const unregisterUserEmit = ( id, roomId) => {
//     const data = {id: id, roomId: roomId}
//     socket.emit('unregisterUser', data)
// }

export const modifyUserStatusEmit = ( user, roomId) => {
    const data = {user: user, roomId: roomId}
    socket.emit('modifyUserStatus', data)
}

export const instanceRefreshEmit = (roomId) => {
    socket.emit('instanceRefresh', roomId)
}