var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var BillViewController = require("../../custom_modules/controllers/bvcontroller.js");
var ctl = new BillViewController("Billing controller");


router.get('/', async function(req, res, next) {
	
	res.render('portal/billing/index', { 'user': req.session.user,
										 'data': (await ctl.get_single(req.pool,req.session.user.member.MemberID)).rows,
										 'data2': (await ctl.get_chart(req.pool,req.session.user.member.MemberID)).rows,
									     'data3': (await ctl.get_user(req.pool,req.session.user.member.MemberID)).rows,	});
});

module.exports = router;
