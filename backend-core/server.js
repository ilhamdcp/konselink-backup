const app = require('express')();
const bodyparser = require('body-parser');
const cors = require('cors');
const session = require('./utils/session')
const loginRoute = require('./route/loginRoute');
const profileRoute = require('./route/profileRoute');
const registerRoute = require('./route/registerRoute');
const listRoute = require('./route/listRoute');
const detailRoute = require('./route/detailRoute');
const scheduleRoute = require('./route/scheduleRoute');
const adminRoute = require('./route/adminRoute');
const chatRoute = require('./route/chatRoute');
const PORT = process.env.PORT || 3000;

app.use(session);

app.use(cors());

app.use(bodyparser.json());

app.use(loginRoute);

app.use('/profile', profileRoute);

app.use('/register', registerRoute);

app.use('/list', listRoute);

app.use('/detail', detailRoute);

app.use('/schedule', scheduleRoute);

app.use('/admin', adminRoute);

app.use('/chat', chatRoute);

app.use(function (req, res) {
    res.status(404).json({
        code: 404,
        message: "The requested url does not exists"
    })
});

app.listen(PORT, () => console.log("listening on port: "+ PORT));

module.exports = app;