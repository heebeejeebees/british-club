var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var UserController = require("../../custom_modules/controllers/usercontroller.js");
var ctl = new UserController("User controller");


router.get('/', auth, async function(req, res, next) {

	res.render('club/user/index', { 'data': (await ctl.get_list(req.pool)).rows });
});

router.get('/new', auth, function(req, res, next) {

	res.render('club/user/new', { "data": { "id": 0 }, "message": "" });
});

router.get('/edit/:id', auth, async function(req, res, next) {

	id = req.params.id;
 	res.render('club/user/edit', { 'data': await ctl.get_single(req.pool, id) });
});

router.post('/submit', auth, async function(req, res, next) {

	try
	{
		await ctl.update(req.pool, req.body);
		res.redirect(301, '/club/user');
	}
	catch (e)
	{
		console.log(e)
		res.render('club/user/edit', { "data": { 
													"id": req.body['id'], 
													"name": req.body['name'] 
											   }, "message": "" });
	}
});

router.post('/delete', auth, async function(req, res, next) {

	try
	{
		await ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/club/user');
	}
	catch (e)
	{
		console.log(e);
		res.redirect(301, '/club/user');
	}
})

module.exports = router;