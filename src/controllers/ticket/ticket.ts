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

    public async getAllTickets(ctx: Context): Promise<void> {
        try {
            const tickets = await TicketModel.find({}).sort({ created: -1 }) // display the latest first
            ctx.body = { message: 'These are all of the tickets', tickets }
        } catch (error) {
            console.log(error)
            ctx.body = error
        }

    }

    public async editTicket(ctx: Context): Promise<void> {
        try {
            const body: ITicket = ctx.request.body
            const { id } = ctx.params
            const schema = Joi.object().keys({
                fullname: Joi.string().optional(),
                email: Joi.string().optional(),
                subject: Joi.string().optional(),
                description: Joi.string().optional(),
                department: Joi.string().optional(),
                priority: Joi.string().optional(),
            })

            const value: ITicket = await schema.validateAsync(body);
            await TicketModel.updateOne(
                {
                    _id: id
                },
                {
                    fullname: value.fullname,
                    email: value.email,
                    subject: value.subject,
                    description: value.description,
                    department: value.department,
                    priority: value.priority
                }
            );
            ctx.body = { message: 'Ticket updated successfully' };
        } catch (error) {
            ctx.body = error
        }
    }

    public async deleteTicket(ctx: Context): Promise<void> {
        try {
            // get ticket _id from mongodb
            const { _id } = ctx.params
            // get the user id
            const { id } = ctx.state.user
            await TicketModel.deleteOne({ _id })
            await UserModel.updateOne({
                _id: id
            }, {
                $pull: {
                    tickets: {
                        ticket: _id
                    }
                }
            })
            ctx.body = { message: 'Ticket successfully delted' }
        } catch (error) {
            ctx.body = error
        }
    }

    public async closeTicket(ctx: Context): Promise<void> {
        try {
            const { _id } = ctx.params
            // update some props of the ticket
            await TicketModel.updateOne({
                _id
            }, {
                status: 'Closed',
                closed: true,
                dueDate: new Date()
            })
            ctx.body = { message: 'Ticket successfully closed' }
        } catch (error) {
            ctx.body = error
        }
    }
}