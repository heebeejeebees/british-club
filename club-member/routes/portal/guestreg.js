var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_portal.js' );
var constants = require('../../constants');

var GuestRegController = require("../../custom_modules/controllers/guestregcontroller.js");
var ctl = new GuestRegController("Guest Reg controller");

var GuestRegGuestListController = require("../../custom_modules/controllers/guestreglistcontroller.js");
var list_ctl = new GuestRegGuestListController("Guest Reg Guest List controller");

var moment = require('moment');  

router.get('/', auth, async function(req, res, next) 
{
	let data = null
	try
	{
		data = (await ctl.get_list(req.pool, req.session.user.member.MemberID)).rows
	}
	catch (err)
	{
		console.log(err)
	}
	res.render('portal/guestreg/index', { 'data': data, 'moment': moment, 'user': req.session.user });
});

router.get('/new', auth, function(req, res, next) 
{
	res.render('portal/guestreg/edit', { "data": { "today": moment().format("YYYY-MM-DD") }, 'user': req.session.user, "message": "" });
});

router.post('/create', auth, async function(req, res, next) {

	try
	{
		let payload = req.body;
		payload['member'] = req.session.user.member;
		//console.log(payload)

		let result_id = await ctl.create_new(req.pool, payload);
		if (result_id != -1)
			res.redirect(301, '/portal/guestreg/new/list/'+result_id);
		else
			throw new Error('not created')
	}
	catch (e)
	{
		let data = {  
						"date": req.body['date'],    
				   }
		res.redirect('portal/guestreg/edit', { "data": data, "message": "", 'user': req.session.user });
	}
});

router.get('/new/list/:id', auth, async function(req, res, next) 
{
	id = req.params.id;
	guestReg = await ctl.get_single(req.pool, id);
	res.render('portal/guestreg/list', { "data": { "today": moment().format("YYYY-MM-DD"), "guestRegId": id, "guestReg": guestReg }, 'moment': moment, "message": "", 'user': req.session.user });
});

router.get('/new/confirm/:id', auth, async function(req, res, next)
{
	id = req.params.id;
	guestReg = await ctl.get_single(req.pool, id);
	guestRegList = null;
	guestRegListQueryResult = await list_ctl.get_list(req.pool, id);
	if (guestRegListQueryResult && guestRegListQueryResult.rows && guestRegListQueryResult.rows.length>0)
	{
		guestRegList = guestRegListQueryResult.rows;
	}
	res.render('portal/guestreg/confirm', 
			{ 
				"data": { 
					"today": moment().format("YYYY-MM-DD"), 
					"guestRegId": id, 
					"guestReg": guestReg,
					"guestRegList": guestRegList 
				}, 
				'moment': moment, "message": "",
				'user': req.session.user
			});
})

router.post('/new/confirm', auth, async function(req, res, next)
{
	id = req.body['id'];
	result = await ctl.confirm(req.pool, id);
	res.redirect(301, '/portal/guestreg')
})

router.get('/view/:id', auth, async function(req, res, next) {

	id = req.params.id;
	guestReg = await ctl.get_single(req.pool, id);
	guestRegList = null;
	guestRegListQueryResult = await list_ctl.get_list(req.pool, id);
	if (guestRegListQueryResult && guestRegListQueryResult.rows && guestRegListQueryResult.rows.length>0)
	{
		guestRegList = guestRegListQueryResult.rows;
	}
 	res.render('portal/guestreg/view', 
	 				{ 
						 'data': {
							"today": moment().format("YYYY-MM-DD"), 
							"guestRegId": id, 
							"guestReg": guestReg,
							"guestRegList": guestRegList,
							"appUrl": constants.APP_BASE_URL
						 }, 
						 'moment': moment,
						 'user': req.session.user
					});
});

router.post('/delete', auth, async function(req, res, next) {

	try
	{
		await ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/portal/guestreg');
	}
	catch (e)
	{
		console.log(e);
		res.redirect('portal/guestreg/edit/'+req.body['id']);
	}
})

module.exports = router;