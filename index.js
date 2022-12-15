'use strict';

const path = require('path');
const express = require('express');
const app = express();

const { port, host, storage } = require('./config.json');

const DataStorage = require(path.join(__dirname, storage.storageFolder, storage.dataLayer));

const datastorage = new DataStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const homePath = path.join(__dirname, 'home.html');

app.get('/', (req, res) => res.sendFile(homePath));

app.get('/all', (req, res) => 
    datastorage.getAll().then(data => res.render('allProduct', { result:data }))
);

app.get('/getProduct', (req, res) => res.render('getProduct', {
    title: 'get',
    header: 'get',
    action: '/getProduct'

})
);

app.post('/getProduct', (req, res) => {
    if (!req.body) return res.sendStatus(500);

    const productId = req.body.id;
    datastorage.getOne(productId)
    .then((product) => res.render('productPage', {result:product}))
    .catch((error) => sendErrorPage(res, error));
});

app.get('/inputform', (req, res) => 
    res.render('form', {
        title: 'Add Product',
        header: 'Add a new product',
        action: '/input',
        productId: {value: '', readonly: ''},
        name: {value: '', readonly: ''},
        model: {value: '', readonly: ''},
        type: {value: '', readonly: ''},
        amount: {value: '', readonly: ''}
    }) );

app.post('/input', (req, res) => {
    if (!req.body) return res.statusCode(500);

    datastorage.insert(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get('/updateform', (req, res) => 
    res.render('form', {
        title: 'Update Product',
        header: 'Update product data',
        action: '/updatedata',
        productId: {value: '', readonly: ''},
        name: {value: '', readonly: 'readonly'},
        model: {value: '', readonly: 'readonly'},
        type: {value: '', readonly: 'readonly'},
        amount: {value: '', readonly: 'readonly'}
    }) 
    );


app.post('/updatedata', (req, res) => {
    if (!req.body) return res.sendStatus(500);

    datastorage.getOne(req.body.productId)
    .then((product) => 
        res.render('form', {
            title: 'Update product',
            header: 'Update product data',
            action: '/update',
            productId: {value: product.productId, readonly: 'readonly'},
            name: {value: product.name, readonly: ''},
            model: {value: product.model, readonly: ''},
            type: {value: product.type, readonly: ''},
            amount: {value: product.amount, readonly: ''}
        }))
    .catch((error) => sendErrorPage(res,error));
});

app.post('/update', (req, res) => {
    if (!req.body) return res.statusCode(500);

    datastorage.update(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get('/removeProduct', (req, res) => res.render('getProduct', {
    title: 'Remove',
    header: 'remove',
    action: '/removeProduct'

})
);

app.post('/removeProduct', (req, res) => {
    if (!req.body) return res.sendStatus(500);

    const productId = req.body.id;
    datastorage.remove(productId)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});


app.listen(port, host, () => console.log(`SERVER IS RUNNING!! ${host}:${port}`));


const sendErrorPage = (res, error, title= "ERROR", header = "ERROR") => {
    sendStatusPage(res, error, title, header);
}

const sendStatusPage = (res, status, title = 'Status', header = 'Status') => {
    return res.render('statusPage', {title, header, status});
}