import fetch from 'node-fetch';
import pkg from '../../package.json';
import https from 'https';
const version = pkg.version;
class RequestManager {
    #header = {};

    constructor() {
        this.#setHeaders('User-Agent', `mDexAPI/${version} Server-side Node`);
    }

    async request(endpoint, method = 'GET', options = {}) {
        if (!endpoint || typeof endpoint != 'string')
            throw new Error('Invalid api endpoint');
        endpoint = endpoint[0] == '/' ? endpoint : `/${endpoint}`;
        console.log(method);
        const reqOptions = {
            method: method,
            headers: this.#header
        }

        if (method !== 'GET') {
            if (typeof options !== 'object') this.#setHeaders('Content-Type', 'text/plain')
            else this.#setHeaders('Content-Type', 'application/json');
        }

        console.log(this.#header)



        if (method == 'GET') {
            const response = await fetch(`https://api.mangadex.org${endpoint}`, this.options);

            const parsed = await response.json();
        } else {
            reqOptions.body = JSON.stringify(options);
            const response = await fetch(`https://api.mangadex.org${endpoint}`, reqOptions);

            const parsed = await response.json();
            console.log(parsed);
        }

        
    }

    #setHeaders(name, value) {
        this.#header[name] = value;

    }

}


export default new RequestManager();