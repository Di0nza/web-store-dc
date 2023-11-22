const express = require('express');
require('dotenv').config();
const app = express();
const dbConnection = require('./db')
const path = require('path');
const fileUpload = require('express-fileupload')
const router = require('./routes/index')

dbConnection();

app.use(express.json());
app.use(express.static(path.resolve(__dirname,'static')));
app.use(fileUpload({}));
app.use('/api', router);


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`)
})