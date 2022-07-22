module.exports = async function (context, req) {
    const query = new URLSearchParams('?response_type=code');
    query.append('client_id', encodeURI(process.env.KROGER_CLIENT_ID));
    query.append('redirect_uri', encodeURI(process.env.KROGER_REDIRECT_URI));

    const scopes = 'profile.compact+product.compact';

    const url = `https://${process.env.KROGER_API_DOMAIN}/v1/connect/oauth2/authorize?scope=${scopes}&${query.toString()}`;

    context.res = {
        status: 200,
        body: {
            url
        }
    }
}