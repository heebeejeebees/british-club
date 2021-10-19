var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_portal.js' );

var moment = require('moment');

var NewsletterViewController = require("../../custom_modules/controllers/newslettercontroller.js");
var ns_ctl = new NewsletterViewController("Newsletter controller");

router.all('/', auth, async function(req, res, next) {

	let newsletters = []
	try
	{
		newsletters = (await ns_ctl.get_latest(req.pool, 4)).rows
	}
	catch (err) {}
	
	let ctx = { 
		'moment': moment,
		'user': req.session.user,
		'newsletters': newsletters
	}
	res.render('portal/index', ctx);
});

router.get('/login', function(req, res, next) {

	res.render('portal/login')
})

router.get('/logout', function(req, res, next) {
  
 	try
	{
		req.session.destroy()
		res.redirect('/portal/login');
	}
	catch
	{
		logger.error(err);
		res.status(500).send({ message: 'something went wrong', collection: 'user'});
	}
});

module.exports = router;
