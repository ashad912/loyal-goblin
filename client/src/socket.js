

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

export const joinRoomSubscribe = (socket, roomId) => {
    socket.on('joinRoom', roomId, () => {
        return roomId
    })
}

export const addItemEmit = (socket, item, roomId) => {
    const data = {item: item, roomId: roomId}
    socket.emit('addItem', data)
}

export const deleteItemEmit = (socket, id, roomId) => {
    const data = {id: id, roomId: roomId}
    socket.emit('deleteItem', data)
}

export const joinRoomEmit = (socket, roomId) => {
    socket.emit('joinRoom', roomId)
}