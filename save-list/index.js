const CosmosClient = require("@azure/cosmos").CosmosClient;
const fetch = require('node-fetch');
const config = require('./config');
const dbContext = require('./dbContext');

module.exports = async function (context, req) {
    const list = req.body.list;
    const accessToken = req.body.accessToken;
    console.log(req.body);

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
    console.log(created);

    context.res = {
        status: 200,
        body: {
            list: list
        },
    }
};

const saveList = async (container, list) => {
    const {resources: createdItem } = await container.items.create(list);
    return resources;
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

    console.log(responseJson);

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