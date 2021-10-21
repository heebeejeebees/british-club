'use strict';
const e = require("express");
const bcrypt = require('bcrypt');

module.exports = class MemberController {

	async get_single(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id,
			}

			console.log("[MemberDetails][get_user]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Member\" WHERE \
						\"MemberID\" = $1::int "

			var queryResult = await pool.query(sql,[id]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult;
			}
		}
		catch (err)
		{
			console.log(err)
		}
		
		return result;
	}

	async get_Details(pool, id, type)
	{
		var result = {};

		try
		{
			var params = {
				"ID" 	: id,
				"type"	: type
			}

			console.log("[MemberDetails][get_Details]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"MemberDetails\" WHERE \
						\"MemberID\" = $1::int AND \"Tipe\" = $2::text "

			var queryResult = await pool.query(sql,[id,type]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult;
			}
		}
		catch (err)
		{
			console.log(err)
		}
		
		return result;
	}

	async get_Preferences(pool, id, type)
	{
		var result = {};

		try
		{
			var params = {
				"ID" 	: id,
				"type"	: type
			}

			console.log("[MemberDetails][get_work]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"MemberPreferences\" WHERE \
						\"MemberID\" = $1::int AND \"Type\" = $2::text "

			var queryResult = await pool.query(sql,[id , type]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult;
			}
		}
		catch (err)
		{
			console.log(err)
		}
		
		return result;
	}

	async get_hash(value)
	{
		return await bcrypt.hash(value, 10)
	}

	async update(pool, number, email, address1, address2, city, pcode, country, cname, wtitle, mID, tipe )
	{
		console.log("update");

		let result = false;

		try
		{
			var params = {
	            "number" 	: number, 
				"email"  	: email,
				"address1"	: address1,
				"address2"	: address2,
				"city"		: city,
				"pcode"		: pcode,
				"country"	: country,
				"cname"		: cname,
				"wtitle"	: wtitle,
				"member"	: mID,
				"Tipe"		: tipe
			}
			
			console.log("[Member Details][params]..." + JSON.stringify(params));

			var recordExist = await pool.query('SELECT * FROM \"MemberDetails\" WHERE \
									 \"MemberID\"=$1::int AND \"Tipe\"=$2::text',[mID, tipe]);
			console.log(recordExist.rowCount);

			if (recordExist.rowCount > 0 )
			{

				console.log("[Member Details][update]..." + JSON.stringify(params));

				var updateSql = 'UPDATE public.\"MemberDetails"\ \
									SET \"Mobile\"=$1::text, \"Email\"=$2::text, \
								\"Address1\"=$3::text, \"Address2\"=$4::text, \
								\"City\"=$5::text, \"Postal\"=$6::int, \
								\"Country\"=$7::text, \"Company\"=$8::text, \
								\"Job\"=$9::text WHERE \"Tipe\"= $11::text AND \
								\"MemberID\"=$10::int';
				
				var updateResult = await pool.query(updateSql, [number, email, address1, address2, city, pcode, country, cname, wtitle, mID, tipe]);
			
				if (updateResult.rowCount > 0)
				{
					console.log(result);
					result = true;
				}
			}
			else
			{
			//var result = false;	
				console.log("[Member Details][insert]..." + JSON.stringify(params));

				var Sql = 'INSERT INTO public.\"MemberDetails\" ( \
					\"Mobile\", \"Email\", \"Address1\", \"Address2\", \"City\", \
					\"Postal\", \"Country\", \"Company\", \"Job\", \"MemberID\", \"Tipe\" ) \
					VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, \
						$6::int, $7::text, $8::text, $9::text, $10::int, $11::text)';

				var insertResult = await pool.query(Sql, [number, email, address1, address2, city, pcode, country, cname, wtitle, mID, tipe]);
			
				if (insertResult.rowCount > 0)
				{
					console.log(result);
					result = true;
				}
			}
		}
		catch (err)
		{
			console.log(err);
		}

		return result;
	}

	async upreferences(pool, mID, Phone, Email, Work, WEmail, Type)
	{
		let result = false;

		try
		{
			var params = {
	            "MemberID"  : mID,
				"Phone"		: Phone,
				"Email"		: Email,
				"Work"		: Work,
				"WEmail"	: WEmail,
				"Type"		: Type
			}

			console.log("[Preferences][update]..." + JSON.stringify(params));

			var recordExist = await pool.query('SELECT * FROM \"MemberPreferences\" WHERE \
									 \"MemberID\"=$1::int AND \"Type\"=$2::text',[mID, Type]);
			console.log(recordExist.rowCount);

			if (recordExist.rowCount > 0 )
			{
				//var result = false;			
				var updateSql = 'UPDATE public.\"MemberPreferences\" \
								SET \"Phone\"=$2::int, \"Email\"=$3::int, \
								\"Work\"=$4::int, \"WEmail\"=$5::int  \
								WHERE \"MemberID\"=$1::int AND \"Type\"=$6::text';

				var updateResult = await pool.query(updateSql, [mID, Phone, Email, Work, WEmail, Type]);
			
				if (updateResult.rowCount > 0)
				{
					console.log(result);
					result = true;
				}
			}
			else{
				console.log("[Preferences][insert]..." + JSON.stringify(params));

				var Sql = 'INSERT INTO public.\"MemberPreferences\"( \
					       \"MemberID\", \"Phone\", \"Email\", \"Work\", \"WEmail\", \"Type\") \
						   VALUES ($1::int, $2::int, $3::int, $4::int, $5::int, $6::text)';
				console.log(Sql)
				var insertResult = await pool.query(Sql, [mID, Phone, Email, Work, WEmail, Type]);
			
				if (insertResult.rowCount > 0)
				{
					console.log(result);
					result = true;
				}
			}
		}
		catch (err)
		{
			console.log(err);
		}

		return result;
	}
	

};