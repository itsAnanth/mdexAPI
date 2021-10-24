import Request from "../modules/Request.js";
class Manga {

    static async get(id) {
        const res = await Request.request(`/manga/${id}`, 'GET');
        return res.data;
    }
}


export default Manga;