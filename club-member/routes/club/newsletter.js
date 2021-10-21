var express = require('express');
var router = express.Router();
var auth = require( '../../middleware/auth.js' );

var NewsletterController = require("../../custom_modules/controllers/newslettercontroller.js");
var ctl = new NewsletterController("Newsletter controller");


router.get('/', async function(req, res, next) {

	res.render('club/newsletter/index', 
				{ 
					'data': (await ctl.get_list(req.pool)).rows,
				}
			  );
});

router.get('/new', function(req, res, next) {

	res.render('club/newsletter/edit', { "data": { "id": 0 }, "message": "" });
});

router.get('/edit/:id', async function(req, res, next) {

	id = req.params.id;
 	res.render('club/newsletter/edit', { 'data': await ctl.get_single(req.pool, id) });
});

router.post('/submit', async function(req, res, next) {

	try
	{
		await ctl.update(req.pool, req.body['id'], req.body['title'], req.body['content']);
		res.redirect(301, '/club/newsletter');
	}
	catch (e)
	{
		let data = { 
						"id": req.body['id'], 
						"title": req.body['title'],
						"content": req.body['content'] 
				   }
		res.redirect('club/newsletter/edit', { "data": data, "message": "" });
	}
});

router.post('/delete', async function(req, res, next) {

	try
	{
		await ctl.delete(req.pool, req.body['id']);
		res.redirect(301, '/club/newsletter');
	}
	catch (e)
	{
		console.log(e);
		res.redirect('club/newsletter/edit/'+req.body['id']);
	}
})

module.exports = router;