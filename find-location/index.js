const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const zipCode = req.query.zipCode;
    const accessToken = req.body.accessToken;

    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/locations?filter.zipCode.near=${zipCode}`, {
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
    } 
    else 
    {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: responseJson.data,
        };
    }
}