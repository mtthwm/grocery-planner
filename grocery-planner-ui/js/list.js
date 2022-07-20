
const GroceryList = function (container, initialList=[]) {
    this._container = container;
    this._list = initialList;

    this._renderProduct = (product) => {
        return(`<li>${product.description}</li>`)
    };

    this.add = (item) => {
        console.log(item);
        this._list.push(item);
        console.log(this._renderProduct(item));
        this.render();
    };

    this.remove = (item) => {
        const index = this._list.findIndex(element => {
            return JSON.stringify(element) === JSON.stringify(item);
        });
        this._list.splice(index, 1);
        this.render();
    };

    this.render = () => {
        const content = this._list.map(item => {
            return this._renderProduct(item)
        }).join('');
        console.log(content, this._list);
        this._container.innerHTML = content;  
    };
};


// Render functions
const renderLocation = (location) => {
    return (`<div class="search-dropdown-item" data-location-id="${location.locationId}"><p>${location.name}</p></div>`);
};

const renderProducts = (product) => {
    return (`
    <div class="search-dropdown-item" data-product-description="${product.description}">
        <p>${product.description}</p>
    </div>`);
}

window.onload = () => {
    const groceryList = new GroceryList(document.querySelector('#item-container > .list-container'));

    const productClickHandler = (event) => {
        const origin = event.target;
        const data = {description: origin.getAttribute('data-product-description')};
        groceryList.add(data);
    }

    setUpSearchDropdown(document.getElementById('location-container'), lookupLocations, renderLocation, locationClickHandler);
    setUpSearchDropdown(document.getElementById('add-container'), lookupProducts, renderProducts, productClickHandler);
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
            const searchDropdownItems = resultContainer.querySelectorAll('.search-dropdown-item');
            
            searchDropdownItems.forEach((element) => {
                element.addEventListener('click', clickCallback);
            });
        }
    });
}

const setupDelayedChangeInput = (inputElement, callback) => {
    const invokeCallback = () => callback(inputElement.value);
    let keyupInterval;
    inputElement.addEventListener('keyup', (event) => {
        clearInterval(keyupInterval);
        keyupInterval = setTimeout(invokeCallback, 250);
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

const lookupProducts = async (term) => {
    const accessToken = window.localStorage.getItem('kroger_access_token');

    const response = await fetch(`http://localhost:7071/api/search-products?term=${term}&locationId=${window.localStorage.getItem('kroger_location_id')}`, {
        method: 'POST',
        body: JSON.stringify({
            'accessToken': accessToken,
        })
    });
    const responseJson = await response.json();
    return responseJson;
}