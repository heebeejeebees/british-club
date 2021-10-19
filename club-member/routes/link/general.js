var express = require('express');
var router = express.Router();
var constants = require('../../constants');

var moment = require('moment');

router.all('/', async function(req, res, next) {

	res.send(403).render();
});

router.get('/visit/:code', function(req, res, next) {

	res.redirect(constants.APP_BASE_URL + 'security/guestreg/detail/' + req.params['code'])
})

module.exports = router;
