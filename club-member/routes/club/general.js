var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var moment = require('moment');

router.all('/', auth, async function(req, res, next) {

	let ctx = { 
		'moment': moment
	}
	res.render('club/index', ctx);
});

router.get('/login', function(req, res, next) {

	res.render('club/login')
})

router.get('/logout', function(req, res, next) {
  
 	try
	{
		req.session.destroy()
		res.redirect('/club/login');
	}
	catch
	{
		logger.error(err);
		res.status(500).send({ message: 'something went wrong', collection: 'user'});
	}
});

module.exports = router;
