const endPoint = "https://swapi.co/api/";
const fetch = require('node-fetch');

module.exports = {

    getAll: async (elements, page) => {

        try {
            // const response = await fetch(`${endPoint}${elements}/gttererg=${page}`);
            const response = await fetch(`${endPoint}${elements}/?page=${page}`);
            return await response.json();
        } catch (err) {
            console.log(err);
            return "error"
        }
    },

    search: async (category, name) => {

        try {
            const response = await fetch(`${endPoint}${category}/?search=${name}`);
            return await response.json();
        } catch (err) {
            console.log(err);
            return "error"
        }
    },

    getThis: async (url) => {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            console.log(err);
            return "error"
        }
    }
};