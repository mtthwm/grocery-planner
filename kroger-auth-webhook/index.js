module.exports = async function (context, req) {
    const authorizationCode = req.query.code;
    const bearerToken = `basic ${btoa(`${process.env.KROGER_CLIENT_ID}:${process.env.KROGER_CLIENT_SECRET}`)}`

    const response = await fetch(`https://${process.env.KROGER_API_DOMAIN}/v1/connect/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': bearerToken,
        },
        body: {
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_url
        }
    });
    
}