/* ToDo create server */

import express from 'express';
import path from 'path';

const app = express();

app.use(express.static('/'));

app.get('/', function (req, res) {
    res.sendFile(path.join('index.html'));
});