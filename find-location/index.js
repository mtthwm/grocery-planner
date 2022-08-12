const fetch = require('node-fetch');
const validation = require('../shared/validation');

module.exports = async function (context, req) {
    const zipCode = req.query.zipCode;
    const accessToken = req.body.accessToken;
    const resultCount = 50;
    const excludedChains = ['SHELL COMPANY', 'JEWELRY']

    const userId = await validation.validateUser(accessToken);
    if (!userId)
    {
        context.res = {
            status: 401
        }
        return; 
    }

    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/locations?filter.zipCode.near=${zipCode}&filter.limit=${resultCount}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const responseJson = await response.json();
    
    if (responseJson.error && responseJson.error == 'API-401: Invalid Access Token')
    {
        context.res = {
            status: 401,
            body: {
                error: 'Token expired or Invalid'
            }
        }
        return;
    } 
    else 
    {
        const locations = responseJson.data.filter((item) => !excludedChains.includes(item.chain))
        context.res = {
            status: 200, /* Defaults to 200 */
            body: locations,
        };
        return;
    }
}