const bcrypt = require('bcrypt-nodejs');
const mongo = require('./connectDB');
const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {

    newUser(data) {
        if (!this.validateEmail(data.email)) {
            throw new Error('ERREMAIL');
        }
        const salt = bcrypt.genSaltSync(8);
        const newUser = {
            email: data.email,
            password: this.generateHash(data.password, salt),
            salt,
        };
        mongo.addNewUser(newUser);
        return {email: data.email}
    },

    async findUser(data) {
        const user = await mongo.findByEmail(data.email);
        if (user && user.password === this.generateHash(data.password, user.salt)) {
            return {email: user.email};
        }
        throw new Error("ERRLOG");
    },

    generateHash(password, salt) {
        return bcrypt.hashSync(password, salt, null);
    },

    validateEmail(email) {
        return emailRE.test(String(email).toLowerCase());
    },

};
