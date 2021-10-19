var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var MemberController = require("../../custom_modules/controllers/billingcontroller.js");
var billing_ctl = new MemberController("Billing controller");

var moment = require('moment');  

router.get('/', async function(req, res, next) {

	res.render('club/billing/index', { 'data': (await billing_ctl.get_list(req.pool)).rows,
									   'moment': moment  });
});

router.get('/new', async function(req, res, next) {

	res.render('club/billing/edit', { 'data': { 'BillingID': 0 },
									  'data2': (await billing_ctl.get_ListMember(req.pool)).rows,
									  'moment': moment  });
});

router.get('/edit/:id', async function(req, res, next) {

	id = req.params.id;
 	res.render('club/billing/edit', { 'data2' : (await billing_ctl.get_ListMember(req.pool)).rows,
	 								  'data': await billing_ctl.get_single(req.pool, id),
	 						          'moment': moment  });
});

router.post('/submit', async function(req, res, next) {

	try
	{
		await billing_ctl.update(req.pool, req.body['id'], req.body['name'], req.body['Date'], req.body['Amount'], req.body['Desc']);
		res.redirect(301, '/club/billing');
	}
	catch (e)
	{
		res.render('club/billing/edit', { "data": { "id": req.body['id'], "nama": req.body['nama'] }, "message": "" });
	}
});

router.post('/delete', async function(req, res, next) {

	try
	{
		await kelurahan_ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/gpm/kelurahan');
	}
	catch (e)
	{
		console.log(e);
	}
})

module.exports = router;