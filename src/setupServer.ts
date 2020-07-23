import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaCors from 'koa2-cors'
import { registerRoutes } from './routers/routes'
import socketIO from 'socket.io'
import http from 'http'
import { global } from './socket/global'

async function serverSetUp() {
    const server: Koa = new Koa()
    middleWares(server)
    await startServer(server)
}


function middleWares(server: Koa) {
    server.use(bodyParser())
    server.use(koaCors())

    const routes = registerRoutes().routes()
    server.use(routes)

}

async function startServer(server: Koa) {
    try {
        const serverPort = process.env.PORT || 5000;
        // const serverStarted: Promise<void> = new Promise((resolve) => {
        //     server.listen(serverPort, resolve)
        // })
        // await serverStarted
        // console.log(`Server running on port ${serverPort}`)
        
        // with socket.io for instant update
        const httpServer = new http.Server(server.callback())
        const io = socketIO(httpServer)
        global(io)
        httpServer.listen(serverPort, () => {
            console.log(`Server running on port ${serverPort}`)
        })
    } catch (error) {
        console.log(error)
        return error
    }
}


export { serverSetUp }