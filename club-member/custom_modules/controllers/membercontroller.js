'use strict';
const e = require("express");
const bcrypt = require('bcrypt');

module.exports = class MemberController {

    async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[member][get_list]..." + JSON.stringify(params));

			var sql = "SELECT * FROM \"Member\""

			var queryResult = await pool.query(sql);
			
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

	async get_single(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[member][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Member\" WHERE \
							\"MemberID\" = $1::int "

			var queryResult = await pool.query(sql,[id]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult.rows[0];
			}
		}
		catch (err)
		{
			console.log(err)
		}
		
		return result;
	}

	async get_single_by_uname(pool, uname)
	{
		var result = {};

		try
		{
			var params = {
				"uname" : uname
			}

			console.log("[member][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Member\" WHERE \
							\"Username\" = $1::text "

			var queryResult = await pool.query(sql,[uname]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult.rows[0];
			}
		}
		catch (err)
		{
			console.log(err)
		}
		
		return result;
	}

	async login(pool, uname, password)
	{
		var result = false;

		try
		{
			if (uname)
			{
				var recordExist = await pool.query('SELECT * FROM \"Member\" WHERE \"Username\" = $1::text',[uname]);
				if (recordExist.rowCount > 0)
				{
					if(await bcrypt.compare(password, recordExist.rows[0].Password))
					{
						result = true;
					}
				}
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

	async update(pool, payload)
	{
		let result = false;

		var id = payload['id'];
		var name = payload['name'];
		var username = payload['username'];
		var resetPassword = payload['resetPassword'];
		var password = payload['password'];
		var repeatPassword = payload['repeatPassword'];

		try
		{
			var params = {
	            "id" : id,
	            "name" : name
			}

			console.log("[member][update]...1 " + JSON.stringify(params));

			//var result = false;

			if (name)
			{	
				console.log("[member][update]...1.2 " + name);

				var recordExist = { "rowCount": 0 };
				if (id && id != "")
				{
					var testSQL = 'SELECT * FROM \"Member\" WHERE \"MemberID\"=$1::int';
					recordExist = await pool.query(testSQL, [id]);
				}

				console.log("record count ", recordExist.rowCount);

				if (recordExist.rowCount > 0)
				{
					console.log("[member-update]...2" + JSON.stringify(params));

					var updateSql = 'UPDATE \"Member\" SET \"Name\"=$2::text \
												WHERE \"MemberID\"=$1::int';

					var updateResult = await pool.query(updateSql, [id, name]);
				
					if (updateResult.rowCount > 0)
					{
						console.log(resetPassword)
						if (resetPassword == "resetPassword")
						{
							let encrypted_password = await bcrypt.hash(password, 10)

							if (password != "" && password == repeatPassword)
							{
								var updateSql2 = 'UPDATE \"Member\" SET \"Password\"=$2::text WHERE \"MemberID\" = $1::int';

								var updateResult2 = await pool.query(updateSql2, [id, encrypted_password]);

								if (updateResult2.rowCount > 0)
								{
									console.log("Update password completed.")
									result = true;
								}		
							}
						}
						else
						{
							result = true;
						}
					}
				}
				else
				{
					console.log("[member--insert]..." + JSON.stringify(params));

					if (password != "" && password == repeatPassword)
					{
						console.log("[member--after password verification]...");

						let encrypted_password = await bcrypt.hash(password, 10)

						var sql = 'INSERT INTO \"Member\" \
									(\"Name\",\"Username\",\"Password\") VALUES \
									($1::text, $2::text, $3::text)';

						var insertResult = await pool.query(sql, [name, username, encrypted_password]);

						if (insertResult.rowCount > 0)
						{
							result = true;
						}
					}
				}
			}
		}
		catch (err)
		{
			console.log(err)
		}

		return result;
	}

	async delete(pool, id)
	{
		let result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[member][delete]..." + JSON.stringify(params));

			var sql = '	DELETE FROM \"Member\" \
						WHERE \"MemberID\" = $1::int '

			var queryResult = await pool.query(sql,[id]);
			
			if (queryResult.rowCount > 0)
			{
				result = queryResult;
			}
		}
		catch (err)
		{

		}

		return result;
	}
};