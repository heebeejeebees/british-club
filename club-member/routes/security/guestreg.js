var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_security.js' );

var GuestRegController = require("../../custom_modules/controllers/guestregcontroller.js");
var ctl = new GuestRegController("Guest Reg controller");

var GuestRegGuestListController = require("../../custom_modules/controllers/guestreglistcontroller.js");
var list_ctl = new GuestRegGuestListController("Guest Reg Guest List controller");

var moment = require('moment');  

router.get('/', auth, async function(req, res, next) {

	let data = null
	try
	{
		data = (await ctl.get_list_by_date(req.pool)).rows
	}
	catch (err)
	{
		console.log(err)
	}
	
	let ctx = {
		'data': data,
		'moment': moment
	}
	res.render('security/guestreg/index', ctx);
});

router.get('/view/:id', auth, async function(req, res, next) {

	id = req.params.id;
	guestReg = await ctl.get_single_with_member(req.pool, id);
	guestRegList = null;
	guestRegListQueryResult = await list_ctl.get_list(req.pool, id);
	if (guestRegListQueryResult && guestRegListQueryResult.rows && guestRegListQueryResult.rows.length>0)
	{
		guestRegList = guestRegListQueryResult.rows;
	}
 	res.render('security/guestreg/view', 
	 				{ 
						 'data': {
							"today": moment().format("YYYY-MM-DD"), 
							"guestRegId": id, 
							"guestReg": guestReg,
							"guestRegList": guestRegList 
						 }, 
						 'moment': moment 
					});
});

router.get('/detail/:id', auth, async function(req, res, next) {

	id = req.params.id;

	let guestRegDetail = {}
	let guestRegDetailQueryResult = await list_ctl.get_list_with_member_by_qr_code(req.pool, id);
	
	if (guestRegDetailQueryResult.rows.length>0)
	{
		guestRegDetail = guestRegDetailQueryResult.rows[0];
	}
 	res.render('security/guestreg/detail', 
	 				{ 
						 'data': {
							"today": moment().format("YYYY-MM-DD"), 
							"guestRegId": id,
							"guestRegDetail": guestRegDetail,
							"code": id
						 },
						 'moment': moment 
					});
});

router.post('/checkin', auth, async function(req, res, next)
{
	let code = req.body['code'];
	console.log(code);

	guestRegDetail = null;
	let guestRegDetailQueryResult = await list_ctl.get_list_with_member_by_qr_code(req.pool, code);
	if (guestRegDetailQueryResult.rows.length>0)
	{
		guestRegDetail = guestRegDetailQueryResult.rows[0];
	}

	if (guestRegDetail)
	{
		await list_ctl.update_check_in(req.pool, guestRegDetail.GuestRegGuestListID)
	}

	res.redirect('/security/guestreg/detail/'+code);
})

module.exports = router;
