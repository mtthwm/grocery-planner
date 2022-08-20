const fetch = require('node-fetch');

const base64Encode = (value) => {
    const buffer = Buffer.from(value, 'utf8');
    return buffer.toString('base64');
};

module.exports = async function (context, req) {
    const authorizationCode = req.query.code;
    const bearerToken = `basic ${base64Encode(`${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`)}`;

    // Create the request body in query string format 
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authorizationCode);
    body.append('redirect_uri', process.env.KROGER_REDIRECT_URI);

    // Make a request to the Kroger API
    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/connect/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': bearerToken,
        },
        body: body.toString(),
    });
    const responseJson = await response.json();

    context.res = {
        status: 200,
        body: {
            access_token: responseJson.access_token,
        }
    }
}