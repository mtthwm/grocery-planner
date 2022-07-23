const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: 'mtthwmrls',
    containerId: 'groceries',
    partitionKey: {kind: 'Hash', paths: ['/groceries']}
};

module.exports = config;