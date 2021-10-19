var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth_portal.js' );

var MemberDetailsControler = require("../../custom_modules/controllers/memberdetailscontroller.js");
var ctl = new MemberDetailsControler("MemberDetails controller");


router.get('/', auth, async function(req, res, next) {
	
	let member = { "Name": "", "Birth": "" }
	let homeD = { "Mobile":"", "Email": "", "Address1": "", "Address2": "", "City": "", "Postal": "", "Country": "" }
	let workD = { "Company": "", "Job": "", "Mobile":"", "Email": "", "Address1": "", "Address2": "", "City": "", "Postal": "", "Country": "" }
	let prefC = { "Phone":"", "Email": "", "Work": "", "WEmail": "" }
	let prefP = { "Phone":"", "Email": "", "Work": "", "WEmail": "" }
	try
	{
		member = (await ctl.get_single(req.pool,req.session.user.member.MemberID)).rows[0]
		homeD = (await ctl.get_Details(req.pool,req.session.user.member.MemberID,'1')).rows[0]
		workD = (await ctl.get_Details(req.pool,req.session.user.member.MemberID,'0')).rows[0]
		prefP = (await ctl.get_Preferences(req.pool,req.session.user.member.MemberID,'C')).rows[0];
		prefC = (await ctl.get_Preferences(req.pool,req.session.user.member.MemberID,'P')).rows[0];
	}
	catch (err) {}
	
	let ctx = { 
		'data': member,
		'prefC' : prefC,
		'prefP' : prefP,
		'WorkD' : workD,
		'HomeD' : homeD,
		'user': req.session.user,
	}

	res.render('portal/MemberDetails/index', ctx);
	
});

router.post('/submit', auth, async function(req, res, next) {

	try
	{
		console.log(req.body);

		let action = req.body['action'];

		if (action)
		{
			if (action == "personal_details")
			{
				console.log("personal_details");

				let number = req.body['Phone'];
				let email = req.body['Email'];
				let address1 = req.body['Address1'];
				let address2 = req.body['Address2'];
				let city = req.body['City'];
				let pcode = parseInt(req.body['Postal']);
				let country = req.body['Country'];
				let mID = parseInt(req.body['id']);
				let cname = "";
				let wtitle = "";
				let tipe = "1";
				await ctl.update(req.pool, number, email, address1, address2, city, pcode, country, cname, wtitle, mID, tipe)
			}
			else if (action == "company_details")
			{
				console.log("company_details")
				let number = req.body['WPhone'];
				let email = req.body['WEmail'];
				let address1 = req.body['WAddress1'];
				let address2 = req.body['WAddress2'];
				let city = req.body['WCity'];
				let pcode = parseInt(req.body['WPostal']);
				let country = req.body['WCountry'];
				let mID = parseInt(req.body['id']);
				let cname = req.body['Company'];
				let wtitle = req.body['Work'];
				let tipe = "0";
				await ctl.update(req.pool, number, email, address1, address2, city, pcode, country, cname, wtitle, mID, tipe)
			}
			else if (action == "preferences")
			{
				console.log("preferences")
				
				let primary = req.body['primary']
				let correspondence = req.body['correspondence']

				let mID = parseInt(req.body['id']);
				let Phone = 0
				let Email = 0
				let Work = 0
				let WEmail = 0
				let Type = 'C'
				
				if (primary == "personal_mobile")
					Phone = 1
				else if (primary == "personal_email")
					Email = 1
				else if (primary == "work_mobile")
					Work = 1
				else if (primary == "work_email")
					WEmail = 1
				
				await ctl.upreferences(req.pool, mID, Phone, Email, Work, WEmail, Type)

				Phone = 0
				Email = 0
				Work = 0
				WEmail = 0
				Type = 'P'

				if (correspondence == "personal_mobile")
					Phone = 1
				else if (correspondence == "personal_email")
					Email = 1
				else if (correspondence == "work_mobile")
					Work = 1
				else if (correspondence == "work_email")
					WEmail = 1
					
				await ctl.upreferences(req.pool, mID, Phone, Email, Work, WEmail, Type)
			}
		}

		//console.log(req.body['v1']);
		//await ctl.update(req.pool, req.body['Phone'],req.body['Email'],req.body['Address1'],req.body['Address2'],req.body['City'],req.body['Postal'],req.body['Country'],'','',req.pool,req.session.user.member.MemberID,'1');
		res.redirect(301, '/portal/memberdetails');
	}
	catch (e)
	{
		console.log(e)
		res.redirect(301, '/portal/memberdetails');
	}
});

module.exports = router;