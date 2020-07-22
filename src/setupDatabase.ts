import mongoose from 'mongoose'

async function databaseSetUp() {
    const connected: boolean = await connectToDatabase()
    if (!connected) { process.exit(1) }

}

async function connectToDatabase(): Promise<boolean> {
    // mongoose
    const connectionOptions = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }

    try {
        await mongoose.connect(`${process.env.TICKET_APP_DB_URL}`, connectionOptions)
        console.log('Connected to database')
        return true
    } catch (error) {
        console.log('Error occured while connecting to db', error)
        return false

    }
}

export { databaseSetUp }