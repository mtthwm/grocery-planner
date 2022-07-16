class Component {
    constructor (container) {
        this.state = {};
        this.#container = container;
    }

    update = function () {
        this._container.innerHTML = this.render();
    };

    setState = function (value) {
        for (let property in value)
        {
            this.state[property] = value[property];
        }
        this.state = value;
        this.update();
    };

    render () {
        return(
            `
            <h1>${this.state.hello}</h1>
            `
        );
    }
}

function Component (container) {
    this.state = {};
    this._container = container;

    this.render = () => `
    <h1>${this.state.hello}</h1>
    `;
}

Component.prototype

Component.prototype.