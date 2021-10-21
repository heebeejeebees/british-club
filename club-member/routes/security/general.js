var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_security.js' );

var moment = require('moment');

router.all('/', auth, async function(req, res, next) {

	let ctx = { 
		'moment': moment
	}
	res.render('security/index', ctx);
});

router.get('/login', function(req, res, next) {

	let nextPage = "";
	if (req.query.nextPage && req.query.nextPage!="")
		nextPage = req.query.nextPage
	res.render('security/login', { "nextPage": nextPage })
})

router.get('/logout', function(req, res, next) {
  
 	try
	{
		req.session.destroy()
		res.redirect('/security/login');
	}
	catch
	{
		logger.error(err);
		res.status(500).send({ message: 'something went wrong', collection: 'user'});
	}
});

module.exports = router;
