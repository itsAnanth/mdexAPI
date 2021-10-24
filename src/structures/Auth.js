import Request from "../modules/Request.js"
import Logger from '../modules/Logger.js';

class Auth {
    
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     * @returns {Promise<Object>}
     */
    static async login(username, password, DEBUG = false) {
        if (
            !username || typeof username != 'string' ||
            !password || typeof password != 'string'
        ) throw new Error('Invalid credential(s)');

        const auth = await Request.request('/auth/login', 'POST', { username: username, password: password });
        if (auth.result == 'ok' && ('token') in auth) {
            Logger.log('API auth', 'Authorized');
        }
        
        return DEBUG ? auth : { success: true };
    }
}

export default Auth;