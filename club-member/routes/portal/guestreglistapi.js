var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var GuestRegListController = require("../../custom_modules/controllers/guestreglistcontroller.js");
var ctl = new GuestRegListController("Guest Reg List controller");

var moment = require('moment');  

router.post('/getlist', async function(req, res) 
{
	var guestRegID = req.body.guestRegID;
	res.json({ data: await ctl.get_list(req.pool, guestRegID) });
});


router.post('/createnew', async function(req, res) 
{
	let payload = {
		"guestRegID": req.body.guestRegID,
		"name": req.body.name
	}

	if (await ctl.create_new(req.pool, payload))
	{
		res.json({ message: "ok" });
	}
	else
	{
		res.json({ message: "error" });
	}
});

router.post('/delete', async function(req, res, next) {

	try
	{
		await ctl.delete_by_id(req.pool, req.body['id']);
		res.json({ message: "ok" });
	}
	catch (e)
	{
		console.log(e);
		res.json({ message: "error" });
	}
})

module.exports = router;