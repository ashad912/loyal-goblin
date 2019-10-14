//SUBSCRIBE
export const joinRoomSubscribe = (socket, roomId) => {
    socket.on('joinRoom', roomId, () => {
        return  roomId
    })
}

export const addItemSubscribe = (socket, item) => {
    socket.on('addItem', item, () => {
        return item
    })
}

export const deleteItemSubscribe = (socket, id) => {
    socket.on('deleteItem', id, () => {
        return id
    })
}

export const registerUserSubscribe = (socket, user) => {
    socket.on('registerUser', user, () => {
        return user
    })
}

export const unregisterUserSubscribe = (socket, id) => {
    socket.on('unregisterUser', id, () => {
        return id
    })
}

export const modifyUserStatusSubscribe = (socket, data) => {
    socket.on('modifyUserStatus', data, () => {
        return data
    })
}

//EMIT
export const joinRoomEmit = (socket, roomId) => {
    socket.emit('joinRoom', roomId)
}

export const addItemEmit = (socket, item, roomId) => {
    const data = {item: item, roomId: roomId}
    socket.emit('addItem', data)
}

export const deleteItemEmit = (socket, id, roomId) => {
    const data = {id: id, roomId: roomId}
    socket.emit('deleteItem', data)
}

export const registerUserEmit = (socket, user, roomId) => {
    const data = {user: user, roomId: roomId}
    socket.emit('registerUser', data)
}

export const unregisterUserEmit = (socket, id, roomId) => {
    const data = {id: id, roomId: roomId}
    socket.emit('unregisterUser', data)
}

export const modifyUserStatusEmit = (socket, user, roomId) => {
    const data = {user: user, roomId: roomId}
    socket.emit('modifyUserStatus', data)
}