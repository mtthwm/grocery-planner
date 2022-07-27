const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('../shared/config');
const dbContext = require('../shared/dbContext');
const validation = require('../shared/validation');

module.exports = async function (context, req) {
    const accessToken = req.body.accessToken;

    const userId = await validation.validateUser(accessToken);

    if (!userId)
    {
        context.res = {
            status: 401
        }
        return;
    }

    const {endpoint, key} = config;

    const cosmosClient = new CosmosClient({endpoint, key});
    const container = await dbContext.setupContainer(cosmosClient, config);

    const list = await getList(container, userId);

    if (list) {
        context.res = {
            status: 200,
            body: {
                list,
            }
        }
    } else {
        context.res = {
            status: 404,
            body: {
                errors: [
                    'List not found'
                ]
            }
        }
    }
}

const getList = async (container, userId) => {
    const querySpec = {
        query: `SELECT * from ${container.id} l WHERE l.user="${userId}"`,
    }

    const {resources: items} = await container.items.query(querySpec).fetchAll();

    if (items.length > 0) {
        return items[0];
    } else {
        return null;
    }    
};