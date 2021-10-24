import fetch from 'node-fetch';
import pkg from '../../package.json';
import APIError from './APIerror.js';
import Logger from './Logger.js';

const version = pkg.version;
class RequestManager {
    #header = {};
    #activeRequests = 0;
    #MAX_REQ = 5;
    constructor() {
        this.#setHeaders('User-Agent', `mDexAPI/${version} Server-side Node`);
    }

    async request(endpoint, method = 'GET', options = {}) {
        if (!endpoint || typeof endpoint != 'string')
            throw new Error('Invalid api endpoint');

        endpoint = endpoint[0] == '/' ? endpoint : `/${endpoint}`;
        console.log(method);

        this.#activeRequests ++;

        await this.#rateLimit();

        const reqOptions = {
            method: method,
            headers: this.#header
        }

        if (method !== 'GET') {
            if (Object.keys(options).length == 0) throw new Error('Missing credential(s)');

            if (typeof options !== 'object') this.#setHeaders('Content-Type', 'text/plain')
            else this.#setHeaders('Content-Type', 'application/json');
        }

        // console.log(this.#header)



        if (method == 'GET') {
            const response = await fetch(`https://api.mangadex.org${endpoint}`, reqOptions);

            const parsed = await response.json().catch(e => Logger.log('JSON parse', e));

            return parsed;
        } else {
            reqOptions.body = JSON.stringify(options);
            const response = await fetch(`https://api.mangadex.org${endpoint}`, reqOptions);
            const parsed = await response.json().catch(e => Logger.log('JSON parse', e));

            if (!response.ok) 
                this.#statusCodes(response.status, parsed);

            return parsed;
        }

        this.#activeRequests--;


    }

    #statusCodes(code, detail) {
        if (code === 429) throw new APIError('You have been rate limited', APIError.INVALID_RESPONSE)
        else if (code >= 400) throw new APIError(detail, APIError.INVALID_RESPONSE);
        else if (code >= 300) throw new APIError(`Bad/moved endpoint: ${endpoint}`, APIError.INVALID_REQUEST);
    }

    #setHeaders(name, value) {
        if (typeof name != 'string' || typeof value != 'string')
            return Logger.log('API', 'Invalid header types');
        this.#header[name] = value;
    }

    async #rateLimit() {
        if (this.#activeRequests > this.#MAX_REQ)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.floor(this.#activeRequests / this.#MAX_REQ)));
    }

}


export default new RequestManager();