'use strict';
const bcrypt = require('bcrypt');

module.exports = class UserController {

	async get_list(pool)
	{
		var params = {
		}
		console.log("[get_list]..." + JSON.stringify(params));

		// NOTE:
		// Get list of kiosk instances
		//
		var result = {};

		var sql = "SELECT * FROM \"users\""

		var queryResult = await pool.query(sql);
		
		if (queryResult.rowCount > 0)
		{
			result = queryResult;
		}
		
		return result;
	}

	async get_single(pool, id)
	{
		var params = {
			"id": id
		}
		console.log("[get_single]..." + JSON.stringify(params));

		// NOTE:
		// Get list of kiosk instances
		//
		var result = {};

		var sql = 'SELECT * \
					FROM \"users\" \
					WHERE \"id\" = $1::int'

		var queryResult = await pool.query(sql,[id]);

		//console.log(queryResult);
		
		if (queryResult.rowCount > 0)
		{
			result = queryResult.rows[0];
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
				//let encrypted_password = await bcrypt.hash(password, 10)
				//console.log(encrypted_password)

				var recordExist = await pool.query('SELECT * FROM \"users\" WHERE \"username\" = $1::text',[uname]);
				if (recordExist.rowCount > 0)
				{
					if(await bcrypt.compare(password, recordExist.rows[0].password))
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

	async update_user(pool, id, uname, password, type)
	{
		//id = -1;
		
		var params = {
			"username": uname,
			"password": password,
			"type": type
		}
		console.log("[update_blacklist]..." + JSON.stringify(params));

		// NOTE:
		// Create record in blacklisted_guests if id is blank and
		// Update record in blacklisted_guestss based on the id parameters
		//
		var result = false;

		if (uname)
		{	
			var recordExist = await pool.query('SELECT * FROM \"users\" WHERE \"id\" = $1::int',[id]);

			if (recordExist.rowCount > 0)
			{
				let encrypted_password = await bcrypt.hash(password, 10)

				console.log("[update_blacklist--update]..." + JSON.stringify(params));

				var updateSql = 'UPDATE \"users\" SET username=$2::text, password=$3::text, usertype=$4::text WHERE \"id\" = $1::int';

				var updateResult = await pool.query(updateSql, [id, uname, encrypted_password, type]);
			
				if (updateResult.rowCount > 0)
				{
					result = true;
				}
			}
			else
			{
				let encrypted_password = await bcrypt.hash(password, 10)

				console.log("[update_blacklist--insert]..." + JSON.stringify(params));

				var sql = 'INSERT INTO \"users\" \
							(username, password, usertype) VALUES \
							($1::text, $2::text, $3::text)';

				var insertResult = await pool.query(sql, [uname, encrypted_password,type]);

				if (insertResult.rowCount > 0)
				{
					result = true;
				}
			}
		}

		return result;
	}

	async user_delete(pool, id)
	{
		var params = {
			"id": id
		}
		console.log("[delete_user]..." + JSON.stringify(params));

		// NOTE:
		// Get list of kiosk instances
		//
		var result = {};

		var sql = 'DELETE FROM \"users\" \
					WHERE \"id\" = $1::int '

		var queryResult = await pool.query(sql,[id]);

		//console.log(queryResult);
		
		if (queryResult.rowCount > 0)
		{
			result = queryResult;
		}
		
		return result;
	}

	async update(pool, payload)
	{
		//id = -1;
		
		var params = {
			"username": payload.username,
			"password": payload.password
		}
		console.log("[update_user]..." + JSON.stringify(params));

		var result = false;

		if (payload)
		{	
			let id = payload.id;
			if (!id) id = 0
			let username = payload.username;
			let resetPassword = payload.resetPassword;
			let password = payload.password;
			let repeatPassword = payload.repeatPassword;
			let email_address = payload.email_address;
			if (!email_address) email_address = payload.emailAddress;
			let type = "staff";

			var recordExist = await pool.query('SELECT * FROM \"users\" WHERE \"id\" = $1::int',[id]);

			if (recordExist.rowCount > 0)
			{
				console.log("[user--update]..." + JSON.stringify(params));

				var updateSql = 'UPDATE \"users\" SET username=$2::text, email_address=$3::text, usertype=$4::text WHERE \"id\" = $1::int';

				var updateResult = await pool.query(updateSql, [id, username, email_address, type]);
			
				if (updateResult.rowCount > 0)
				{
					if (resetPassword == "resetPassword")
						{
							let encrypted_password = await bcrypt.hash(password, 10)

							if (password != "" && password == repeatPassword)
							{
								var updateSql2 = 'UPDATE \"users\" SET \"password\"=$2::text WHERE \"id\" = $1::int';

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
				let encrypted_password = await bcrypt.hash(password, 10)

				console.log("[user--insert]..." + JSON.stringify(params));

				var sql = 'INSERT INTO \"users\" \
							(username, password, email_address, usertype) VALUES \
							($1::text, $2::text, $3::text, $4::text)';

				var insertResult = await pool.query(sql, [username, encrypted_password, email_address, type]);

				if (insertResult.rowCount > 0)
				{
					result = true;
				}
			}
		}

		return result;
	}

	async delete(pool, id)
	{
		var params = {
			"id": id
		}
		console.log("[delete_user]..." + JSON.stringify(params));

		// NOTE:
		// Get list of kiosk instances
		//
		var result = {};

		var sql = 'DELETE FROM \"users\" \
					WHERE \"id\" = $1::int '

		var queryResult = await pool.query(sql,[id]);

		//console.log(queryResult);
		
		if (queryResult.rowCount > 0)
		{
			result = queryResult;
		}
		
		return result;
	}
};