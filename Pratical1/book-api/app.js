/*Import Express and body-parser*/
const express = require('express');
const bodyParser = require("body-parser");

/*Instantiate the Express app*/
const app = express();

/*Define the Port*/
const port = 3000;

/*In-memory Book Data*/
let books = [
    {id: 1, title: 'The Lord of gthe Rings', author: 'J.R.R. Tolkien'},
    {id: 1, title: 'Pride and Prejudice', author:'Jane Austen'},
];