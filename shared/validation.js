const fetch = require('node-fetch');

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

module.exports = {validateUser, validateList};