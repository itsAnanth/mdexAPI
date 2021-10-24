import Request from "../src/modules/Request.js";
import Manga from '../src/structures/Manga.js';
import Auth from '../src/structures/Auth.js';
import { config } from 'dotenv';

config();

(async function () {
    console.log(process.env.USER, process.env.PASSWORD);
    await Auth.login(process.env.USER, process.env.PASSWORD, true);

    // const res = await Manga.get('a96676e5-8ae2-425e-b549-7f15dd34a6d8');
    // console.log(res);
})();