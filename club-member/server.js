var constants = require('./constants');
var VERIFY_TOKEN = require('./custom_modules/utils/verifytoken.js');

var moment = require('moment');
var jwt = require('jsonwebtoken');
var path = require('path');
var fileUpload = require('express-fileupload');
//var dtime = require('date-and-time');

const { Pool, Client } = require('pg')
const now = new Date();

var UserController = require("./custom_modules/controllers/usercontroller.js");
var user_ctl = new UserController("User controller");

var SOfficerController = require("./custom_modules/controllers/securityofficercontroller.js");
var sofficer_ctl = new SOfficerController("SOfficer controller");

var MemberController = require("./custom_modules/controllers/membercontroller.js");
var member_ctl = new MemberController("Member controller");

var MemberPPController = require("./custom_modules/controllers/memberppcontroller.js");
var memberpp_ctl = new MemberPPController("Member pp controller");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Club-CRM', //Club-CRM//club
  password: 'test', //test//1//password123
  port: 5432,
})

var express = require('express'),
app = express(),
port = process.env.PORT || constants.SERVER_PORT,
bodyParser = require('body-parser');
cookieParser = require('cookie-parser');
const fs = require('fs');

//var path = __dirname + '/views/';
var root_folder = __dirname + "/";

var assets_path = __dirname + constants.ASSETS_DIR;
//var photo_path = __dirname + constants.PHOTO_DIR;
//photo_path = photo_path.replace(/\\/g, '/');

//Set Body Parser
app.use(cookieParser());
//app.use(constants.APPLICATION_NAME + constants.PHOTO_DIR, express.static(photo_path));
app.use(bodyParser.json({limit: constants.MAX_FILE_SIZE}));
app.use(bodyParser.urlencoded({limit: constants.MAX_FILE_SIZE, extended: true}));

const session = require('express-session');
var FileStore = require('session-file-store')(session);
var fileStoreOptions = {};
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'fat dog in the prairie'
}));

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));

// middleware to use for all requests
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //console.log('Request received.');
    //console.log(req.body);
    next(); // make sure we go to the next routes and don't stop here
});

app.use(path.join(constants.APPLICATION_NAME, '/public'), express.static(path.join(__dirname, '/public')));

app.use(function(req, res, next) { 'use strict'; req.pool = pool; next(); });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(constants.APPLICATION_NAME, require('./routes/club/general'));
app.use(constants.APPLICATION_NAME + '/user', require('./routes/club/user'))
app.use(constants.APPLICATION_NAME + '/member', require('./routes/club/member'));
app.use(constants.APPLICATION_NAME + '/billing', require('./routes/club/billing'));
app.use(constants.APPLICATION_NAME + '/newsletter', require('./routes/club/newsletter'));
app.use(constants.APPLICATION_NAME + '/sofficer', require('./routes/club/sofficer'))

app.use(constants.PORTAL_NAME, require('./routes/portal/general'));
app.use(constants.PORTAL_NAME + '/guestreg', require('./routes/portal/guestreg'));
app.use(constants.PORTAL_NAME + '/api/guestreglist', require('./routes/portal/guestreglistapi'));
app.use(constants.PORTAL_NAME + '/bview', require('./routes/portal/billview'));
app.use(constants.PORTAL_NAME + '/newsletter',require('./routes/portal/newsletterp'));
app.use(constants.PORTAL_NAME + '/memberdetails',require('./routes/portal/memberdetails'));


app.use(constants.SECURITY_PORTAL_NAME, require('./routes/security/general'));
app.use(constants.SECURITY_PORTAL_NAME + '/guestreg', require('./routes/security/guestreg'));

app.use(constants.LINK_PORTAL_NAME, require('./routes/link/general'));

// API ROUTES -------------------
// we'll get to these in a second
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'club-member API!' });
});

//user API -------------------------------------------------------

apiRoutes.post('/token', async function(req, res)
{
	var uname = req.body.uname;
	var password = req.body.password;

	console.log(req.body)

	let hash_password = await user_ctl.get_hash(password)

	try
	{
		if (await user_ctl.login(pool, uname, password))
		{
			var user_info = {
                        username: uname 
                    	}

	    var token = jwt.sign(
	                      user_info, 
	                      constants.TOKEN_SECRET, 
	                      { 
	                        expiresIn: 86400
	                      }
	                );

	   	req.session.token = token
	   	req.session.user = user_info
		req.session.key = null

			res.json({ auth: true })
		}
		else
		{
			throw "Authentication failed"
		}
	}
	catch (err)
	{
	  return res.status(500).send({ auth: false, token: null, message: err, hash: hash_password });
	}
})

// apply the routes to our application with the prefix /api
app.use(constants.APPLICATION_NAME+'/api', apiRoutes);
app.use(constants.APPLICATION_NAME + '/api/user', require('./routes/club/userapi'));

var securityApiRoutes = express.Router();

securityApiRoutes.post('/token', async function(req, res)
{
	var uname = req.body.uname;
	var password = req.body.password;

	console.log(req.body)

	let hash_password = await sofficer_ctl.get_hash(password)

	try
	{
		if (await sofficer_ctl.login(pool, uname, password))
		{
			var user_info = {
                        username: uname 
                    	}

	    var token = jwt.sign(
	                      user_info, 
	                      constants.SECURITY_PORTAL_TOKEN_SECRET, 
	                      { 
	                        expiresIn: 86400
	                      }
	                );

	   	req.session.token = token
	   	req.session.user = user_info
	   	req.session.key = 'security'

			res.json({ auth: true })
		}
		else
		{
			throw "Authentication failed"
		}
	}
	catch (err)
	{
	  return res.status(500).send({ auth: false, token: null, message: err, hash: hash_password });
	}
})

app.use(constants.SECURITY_PORTAL_NAME+'/api', securityApiRoutes);

var memberApiRoutes = express.Router();

memberApiRoutes.post('/token', async function(req, res)
{
	var uname = req.body.uname;
	var password = req.body.password;

	console.log(req.body)

	let hash_password = await member_ctl.get_hash(password)

	try
	{
		if (await member_ctl.login(pool, uname, password))
		{
			let member = await member_ctl.get_single_by_uname(pool, uname)
			let member_pp = null;
			try
			{
				member_pp = (await memberpp_ctl.get_by_member_id(req.pool, member.MemberID))['ProfilePicture']
			}
			catch {}

			var user_info = {
                        username: uname,
                        member: member,
						pp: member_pp
                    	}

	    var token = jwt.sign(
	                      user_info, 
	                      constants.PORTAL_TOKEN_SECRET, 
	                      { 
	                        expiresIn: 86400
	                      }
	                );

	   	req.session.token = token
	   	req.session.user = user_info
	   	req.session.key = 'member'

			res.json({ auth: true })
		}
		else
		{
			throw "Authentication failed"
		}
	}
	catch (err)
	{
	  return res.status(500).send({ auth: false, token: null, message: err, hash: hash_password });
	}
})

app.use(constants.PORTAL_NAME+'/api', memberApiRoutes);

app.use(express.static(__dirname + '/node_modules'));
app.use(constants.APPLICATION_NAME + constants.ASSETS_DIR, express.static(assets_path));

// =======================
// start the server ======
// =======================
app.listen(port);
//console.log(constants.PHOTO_DIR);
//console.log(constants.DEFAULT_FILE_TYPE);
//var id="S7521381";
//console.log("https://iotapi.certissecurity.com/photogateway" + constants.PHOTO_DIR + "/"+ id + constants.DEFAULT_FILE_TYPE);
console.log('Magic happens at http://localhost:'+ port + constants.APPLICATION_NAME);
