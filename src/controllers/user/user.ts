import { Context } from "koa";
import { UserModel } from "../../models/user/User.model";

export class User {
    public async getUser(ctx: Context): Promise<void> {
        try {
            // get the id of the user from user state
            const { id } = ctx.state.user
            // by the user by the id
            // exclude password
            // populate the ticket array with the props of ticket document that matches the ticket id
            const user = await UserModel.findOne({ _id: id }, { password: 0 }).populate('tickets.ticket')
            ctx.body = { message: 'User found', user }
        } catch (error) {
            ctx.body = error
        }
    }
}