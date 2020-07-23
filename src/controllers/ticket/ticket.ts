import Joi from 'joi'
import { Context } from 'koa'
import { ITicket } from '../../interface/ticket.interface';
import { TicketModel } from '../../models/ticket/Ticket.model';
import { UserModel } from '../../models/user/User.model';

const RANDOM_VALUE_MULTIPLIER = 10001

export class Ticket {
    public async addTicket(ctx: Context): Promise<void> {
        try {
            const body: ITicket = ctx.request.body
            // validate properties using Joi
            const schema = Joi.object().keys({
                fullname: Joi.string().required(),
                email: Joi.string().required(),
                subject: Joi.string().required(),
                description: Joi.string().required(),
                department: Joi.string().required(),
                priority: Joi.string().required(),
            })
            // call validateAsync
            const value: ITicket = await schema.validateAsync(body)
            // get the id
            const { id } = ctx.state.user
            value.user = id
            // create random ticketId
            value.ticketId = `${Math.floor(Math.random() * RANDOM_VALUE_MULTIPLIER)}`;
            // create model
            // create ticket array inside user schema
            const ticket = await TicketModel.create(value)
            // update user docoment
            if (ticket) {
                await UserModel.updateOne(
                    {
                        _id: id
                    },
                    {
                        $push: {
                            tickets: {
                                ticket: ticket._id
                            }
                        }
                    }
                )
                ctx.body = { message: 'Ticket added successfully', ticket }
            }
        } catch (error) {
            ctx.body = error
        }
    }
}