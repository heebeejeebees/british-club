'use strict';
const bcrypt = require('bcrypt');

module.exports = class SecurityOfficerController {

	async get_list(pool)
	{
		var params = {
		}
		console.log("[get_list]..." + JSON.stringify(params));

		var result = {};

		var sql = "SELECT * FROM \"SecurityOfficer\""

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
					FROM \"SecurityOfficer\" \
					WHERE \"SecurityOfficerID\" = $1::int'

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

				var recordExist = await pool.query('SELECT * FROM \"SecurityOfficer\" WHERE \"username\" = $1::text',[uname]);
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

	async update(pool, id, uname, resetPassword, password, repeatedpassword, name)
	{
		var params = {
			"id": id,
			"username": uname,
			"password": password,
			"name": name
		}
		console.log("[update_securityofficer]..." + JSON.stringify(params));

		var result = false;

		if (uname)
		{
			try
			{
				var recordExist = { "rowCount": 0 };
				if (id && id != "")
				{
					recordExist = await pool.query('SELECT * FROM \"SecurityOfficer\" WHERE \"SecurityOfficerID\" = $1::int',[id]);
				}

				if (recordExist.rowCount > 0)
				{
					console.log("[security officer--update]..." + JSON.stringify(params));

					var updateSql = 'UPDATE \"SecurityOfficer\" SET \"username\"=$2::text, \"Name\"=$3::text WHERE \"SecurityOfficerID\" = $1::int';

					var updateResult = await pool.query(updateSql, [id, uname, name]);
				
					if (updateResult.rowCount > 0)
					{
						if (resetPassword == "resetPassword")
						{
							let encrypted_password = await bcrypt.hash(password, 10)

							if (password != "" && password == repeatedpassword)
							{
								var updateSql2 = 'UPDATE \"SecurityOfficer\" SET \"password\"=$2::text WHERE \"SecurityOfficerID\" = $1::int';

								var updateResult2 = await pool.query(updateSql2, [id, encrypted_password]);

								if (updateResult2.rowCount > 0)
								{
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

					console.log("[security officer--insert]..." + JSON.stringify(params));

					var sql = 'INSERT INTO \"SecurityOfficer\" \
								(\"username\", \"password\", \"Name\") VALUES \
								($1::text, $2::text, $3::text)';

					var insertResult = await pool.query(sql, [uname, encrypted_password, name]);

					if (insertResult.rowCount > 0)
					{
						result = true;
					}
				}
			}
			catch (err)
			{
				console.log(err)
			}
		}

		return result;
	}

	async delete(pool, id)
	{
		var params = {
			"id": id
		}
		console.log("[delete_security_officer]..." + JSON.stringify(params));

		var result = {};

		var sql = 'DELETE FROM \"SecurityOfficer\" \
					WHERE \"SecurityOfficerID\" = $1::int '

		var queryResult = await pool.query(sql,[id]);

		if (queryResult.rowCount > 0)
		{
			result = queryResult;
		}
		
		return result;
	}
};