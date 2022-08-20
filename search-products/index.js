const fetch = require('node-fetch');
const validation = require('../shared/validation');

module.exports = async function (context, req) {
    const accessToken = req.body.accessToken;
    const searchTerm = req.query.term;
    const locationId = req.query.locationId;
    const resultCount = 50;

    const userId = await validation.validateUser(accessToken);
    if (!userId)
    {
        context.res = {
            status: 401
        }
        return; 
    }

    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/products?filter.term=${searchTerm}&filter.locationId=${locationId}&filter.limit=${resultCount}`, {
        method: 'GET',
        headers: {
            'accept': 'Application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    const responseJson = await response.json();

    context.res = {
        status: 200,
        body: JSON.stringify(responseJson.data),
    }
}