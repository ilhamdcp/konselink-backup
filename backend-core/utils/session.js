const session = require('express-session');
const MemoryStore = require('memorystore')(session);

module.exports = session({
    secret: process.env.SECRET,
    store: new MemoryStore({
        checkPeriod: 36000000 // check every 1 h
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // 1 m lifetime
});