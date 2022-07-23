const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('../shared/config');
const dbContext = require('../shared/dbContext');
const validation = require('../shared/validation');

module.exports = async function (context, req) {
    const list = req.body.list;
    const accessToken = req.body.accessToken;

    const userId = await validation.validateUser(accessToken);
    if (!userId)
    {
        context.res = {
            status: 401
        }
        return; 
    }

    list['user'] = userId;

    if (!validation.validateList(list))
    {
        context.res = {
            status: 403
        }
        return; 
    }

    const {endpoint, key} = config;

    const cosmosClient = new CosmosClient({endpoint, key});
    const container = await dbContext.setupContainer(cosmosClient, config);

    const created = saveList(container, list);

    if (created) {
        context.res = {
            status: 200,
            body: {
                list: list
            },
        }
    } else {
        context.res = {
            status: 500,
            body: {
                errors: [
                    "An error occurred"
                ]
            }
        }
    }
};

const saveList = async (container, list) => {
    const querySpec = {
        query: `SELECT * from ${container.id} l WHERE l.user="${list.user}"`,
    }

    const {resources: items} = await container.items.query(querySpec).fetchAll();

    if (items.length > 0) {
        const existing = items[0];
        existing.location = list.location;
        existing.items = list.items;
        result = await container.item(existing.id).replace(existing);
    } else {
        result = await container.items.create(list);
    }
    
    return result.resource;
};