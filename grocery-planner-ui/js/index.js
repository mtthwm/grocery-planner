// const LoginContainer = function (container)
// {
//     Component.call(this, container);

//     // this.render = () => {
//     //     return (`
//     //         <h1>Grocery Planner</h1>
//     //         <a href="" id="kroger-login-button">Log in with Kroger to continue!</a>
//     //     `)
//     // };
// }

// LoginContainer.prototype = new Component();
// LoginContainer.prototype.constructor = Component;

const LoginContainer = {
    __proto__: Component,
    render: () => {
        return (`
            <h1>Grocery Planner</h1>
            <a href="" id="kroger-login-button">Log in with Kroger to continue!</a>
        `)
    }
}

window.onload = async () => {
    const krogerLoginButton = document.getElementById('kroger-login-button');
    const loginContainer = new LoginContainer(document.getElementById('login-container'));

    console.log(loginContainer);
    console.log(loginContainer.setState({'test':'test'}));

    const currentSearchParams = new URLSearchParams(window.location.search);
    const code = currentSearchParams.get('code');

    if (code)
    {   
        loginContainer.setState({code: code});
    } 
    else
    {
        krogerLoginButton.href = await fetchKrogerUrl();
    }
};

const fetchKrogerUrl = async () => {
    const krogerAuthUrl = "http://localhost:7071/api/kroger-auth-url";
    // const krogerAuthUrl = "https://mtthwmrls-grocery-planner.azurewebsites.net/api/kroger-auth-url?code=axdxrZ59nhbJWV8TMVzbCyIfZ_ncN6wPPRf7rPOxd1MkAzFuvcWMkg%3D%3D"
    
    const response = await fetch(krogerAuthUrl, {
        method: 'GET'
    });
    const responseJson = await response.json();
    return responseJson.url;
};
