import { databaseSetUp } from './setupDatabase'
import { serverSetUp } from './setupServer'


async function init() {
    await serverSetUp()
    await databaseSetUp()
}

init()