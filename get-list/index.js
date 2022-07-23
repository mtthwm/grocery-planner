const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require('../shared/config');
const dbContext = require('../shared/dbContext');
const validation = require('../shared/validation');

module.exports = async function (context, req) {
    const {endpoint, key} = config;

    const cosmosClient = new CosmosClient({endpoint, key});
    const container = await dbContext.setupContainer(cosmosClient, config);
}