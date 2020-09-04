const express = require('express');
const app = express();
const morgan = require('morgan');
const apiRoutes = require('./src/routes');
const databaseConfig = require('./src/config/db')

app.use(morgan('dev'))
app.use(express.json({ limit: '20mb', extended: true }))
app.use(express.urlencoded({ limit: '20mb', extended: false }))

app.use('/paystack', apiRoutes);

const port = 2000;
app.listen(port, () => {
    console.log(`::: server listening on port ${port}. Open via http://localhost:${port}/`)
    databaseConfig();
})