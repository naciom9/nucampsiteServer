const express = require('express');
const partnerRouter = express.Router();

partnerRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the partners to you');
})
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    res.end('Deleting all partners');
});


partnerRouter.route('/:partnerId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send you a partner ${req.params.partnerId}`);
})
.post((req, res) => {
    res.end(`Will add details to partner: ${req.params.partnerId}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`Updating the partner: ${req.params.partnerId} Will update the partner: ${req.body.name}, with: ${req.body.description}`);
})
.delete((req, res) => { 
    res.end(`Deleting ${req.params.partnerId}`);
});

module.exports = partnerRouter;