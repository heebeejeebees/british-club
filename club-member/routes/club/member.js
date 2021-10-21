var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );
const fs = require('fs');

var MemberController = require("../../custom_modules/controllers/membercontroller.js");
var member_ctl = new MemberController("Member controller");

var MemberPPController = require("../../custom_modules/controllers/memberppcontroller.js");
var memberpp_ctl = new MemberPPController("Member pp controller");

router.get('/', auth, async function(req, res, next) {

	res.render('club/member/index', { 'data': (await member_ctl.get_list(req.pool)).rows });
});

router.get('/new', auth, function(req, res, next) {

	res.render('club/member/new', { "data": { "id": 0 }, "message": "" });
});

router.get('/edit/:id', auth, async function(req, res, next) {

	id = req.params.id;
 	res.render('club/member/edit', { 'data': await member_ctl.get_single(req.pool, id), 'profilePicture': await memberpp_ctl.get_by_member_id(req.pool, id) });
});

router.post('/submit', auth, async function(req, res, next) {

	try
	{
		await member_ctl.update(req.pool, req.body);
		res.redirect(301, '/club/member');
	}
	catch (e)
	{
		console.log(e)
		res.render('club/member/edit', { "data": { "id": req.body['id'], "nama": req.body['name'] }, "message": "" });
	}
});

router.post('/delete', auth, async function(req, res, next) {

	try
	{
		await member_ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/club/member');
	}
	catch (e)
	{
		console.log(e);
		res.render('club/member/edit', { "data": { "nama": req.body['nama'] }, "message": "" });
	}
})

router.post('/pp-upload', auth, async function(req, res, next) {
	console.log(req.body)
	var b64 = req.files.file.data.toString('base64');

	let payload = {
		"id": req.body['id'],
		"profilePicture": b64
	}

	memberpp_ctl.update(req.pool, payload);

	res.json({ message: 'ok' });
})
module.exports = router;