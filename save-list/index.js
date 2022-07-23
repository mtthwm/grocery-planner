const CosmosClient = require("@azure/cosmos").CosmosClient;
const fetch = require('node-fetch');
const config = require('./config');
const dbContext = require('./dbContext');

module.exports = async function (context, req) {
    const list = req.body.list;
    const accessToken = req.body.accessToken;

    const userId = await validateUser(accessToken);
    if (!userId)
    {
        context.res = {
            status: 401
        }
        return; 
    }

    list['user'] = userId;

    if (!validateList(list))
    {
        context.res = {
            status: 403
        }
        return; 
    }

    const {endpoint, key, databaseId, containerId} = config;

    // Set up database
    const client = new CosmosClient({endpoint, key});

    const database = client.database(databaseId);
    const container = database.container(containerId);

    await dbContext.createDB(client, config);

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

const validateUser = async (accessToken) => {
    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/identity/profile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    const responseJson = await response.json();

    if (!responseJson || responseJson.code == 'AUTH-1007' || (responseJson && responseJson.errors))
    {
        return null;
    }
    else 
    {
        return responseJson.data.id;
    }
};

const validateList = async (list) => {
    return list && list.items && list.location && list.user;
};