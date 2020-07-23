export const global = (io: any) => {
    // global connection event from socket.io
    io.on('connection', (socket: any) => {
        // event to refresh the page
        socket.on('refresh', () => {
            // emit a global event (without data) to the user
            io.emit('refreshPage', {})
        })
    })
}