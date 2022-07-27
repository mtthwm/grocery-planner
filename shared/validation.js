const fetch = require('node-fetch');

const validateUser = async (accessToken) => {
    try {
        const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/identity/profile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        const responseJson = await response.json();

        return responseJson.data.id;
    } catch (err)
    {
        return null;
    }
};

const validateList = async (list) => {
    return list && list.items && list.location && list.user;
};

module.exports = {validateUser, validateList};