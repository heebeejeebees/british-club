var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var SecurityOfficer = require("../../custom_modules/controllers/securityofficercontroller.js");
var ctl = new SecurityOfficer("Security officer controller");


router.get('/', async function(req, res, next) {

	res.render('club/sofficer/index', { 'data': (await ctl.get_list(req.pool)).rows });
});

router.get('/new', function(req, res, next) {

	res.render('club/sofficer/new', { "data": { "id": 0 }, "message": "" });
});

router.get('/edit/:id', async function(req, res, next) {

	id = req.params.id;
 	res.render('club/sofficer/edit', { 'data': await ctl.get_single(req.pool, id) });
});

router.post('/submit', async function(req, res, next) {

	try
	{
		console.log(req.body['id'])
		await ctl.update(req.pool, req.body['id'], req.body['username'], req.body['password'], req.body['repeatpassword'], req.body['name']);
		res.redirect(301, '/club/sofficer');
	}
	catch (e)
	{
		let data = { 
			"id": req.body['id'], 
			"username": req.body['username'],
			"password":  req.body['password'],
			"name": req.body['name'],
		}
		res.render('club/sofficer/edit', { "data": data, "message": "" });
	}
});

router.post('/delete', async function(req, res, next) {

	try
	{
		await ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/club/sofficer');
	}
	catch (e)
	{
		console.log(e);
		res.redirect(301, '/club/sofficer');
	}
})

module.exports = router;