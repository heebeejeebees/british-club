var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_portal.js' );

var NewsletterViewController = require("../../custom_modules/controllers/newsletterviewcontroller.js");
var ctl = new NewsletterViewController("Newsletter View controller");


router.get('/', auth, async function(req, res, next) {

	res.render('portal/newsletter/index', 
				{ 
					'data': (await ctl.get_list(req.pool)).rows,
					'user': req.session.user
				}
			  );
});

router.get('/view/:id', async function(req, res, next) {

	id = req.params.id;
 	res.render('portal/newsletter/view', { 'data': await ctl.get_single(req.pool, id), 'user': req.session.user })
})

module.exports = router;