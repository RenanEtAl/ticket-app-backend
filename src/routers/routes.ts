import Router from "koa-router";
import { Auth } from "../controllers/auth/auth";


export function registerRoutes() {
    const router = new Router()
    // auth routes
    router.post('/register', Auth.prototype.create)
    router.post('/login', Auth.prototype.login)

    return router
}