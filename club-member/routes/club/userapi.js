var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );
var VERIFY_TOKEN = require('../../custom_modules/utils/verifytoken.js');

var UserController = require("../../custom_modules/controllers/usercontroller.js");
var user_ctl = new UserController("User controller");

router.get('/getlist', async function(req, res) 
{
	res.json({ data: await user_ctl.get_list(pool) });
});

router.post('/getsingle', async function(req, res) 
{

	var id = req.body.id;

	console.log('body',req.body);

	res.json({ data: await user_ctl.get_single(req.pool, id) });
});

router.post('/update', async function(req, res) 
{

	var id = req.body.id;
	var uname = req.body.uname;
	var password = req.body.password;
	var type = req.body.type;

	console.log('user -- update');
	console.log(req.body);

	if (await user_ctl.update_user(
						req.pool, id, uname, password, type
						))
	{
		res.json({ message: "ok" });
	}
	else
	{
		res.json({ message: "error" });
	}
});

router.post('/delete', VERIFY_TOKEN, async function(req, res) 
{

	var id = req.body.id;

	console.log('body',req.body);

	res.json({ data: await user_ctl.user_delete(req.pool, id) });
});

module.exports = router;