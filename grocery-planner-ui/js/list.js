// Render functions
const renderLocation = (location) => {
    return (`<div class="search-dropdown-item" data-location-id="${location.locationId}"><p>${location.name}</p></div>`);
};

window.onload = () => {
    setUpSearchDropdown(document.getElementById('location-container'), lookupLocations, renderLocation, locationClickHandler);
}

const setUpSearchDropdown = async (container, obtainListCallback, renderCallback, clickCallback) => {
    const input = container.querySelector('.search-dropdown-input');
    const resultContainer = container.querySelector('.search-dropdown-container');

    setupDelayedChangeInput(input, async (value) => {
        const list = await obtainListCallback(value);

        let newContent = '';
        for (let item of list)
        {
            const rendered = await renderCallback(item);
            newContent += rendered;
        }
        resultContainer.innerHTML = newContent;
        
        if (clickCallback)
        {
            resultContainer.querySelectorAll('.search-dropdown-item')
            .forEach((element) => {
                element.addEventListener('click', clickCallback);
            });

            resultContainer.innerHTML = '';
        }
    });
}

const setupDelayedChangeInput = (inputElement, callback) => {
    const invokeCallback = () => callback(inputElement.value);
    let keyupInterval;
    inputElement.addEventListener('keyup', (event) => {
        clearInterval(keyupInterval);
        keyupInterval = setTimeout(invokeCallback, 500);
    });
};

// Location-Specific Stuff

const locationClickHandler = (event) => {
    const origin = event.target;
    const locationId = origin.getAttribute('data-location-id');
    window.localStorage.setItem('kroger_location_id', locationId);
};

const lookupLocations = async (zipCode) => {
    const accessToken = window.localStorage.getItem('kroger_access_token');

    const response = await fetch(`http://localhost:7071/api/find-location?zipCode=${zipCode}`, {
        method: 'POST',
        body: JSON.stringify({
            'accessToken': accessToken,
        })
    });
    const responseJson = await response.json();

    return responseJson;
}