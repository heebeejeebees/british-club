'use strict';
const e = require("express");
const bcrypt = require('bcrypt');

module.exports = class MemberPPController {
	
	async get_by_member_id(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[memberpp][get_by_member_id]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"MemberProfilePicture\" WHERE \
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

	async update(pool, payload)
	{
		let result = false;

		var id = payload['id'];
		var profilePicture = payload['profilePicture'];

		try
		{
			var params = {
	            "id" : id
			}

			console.log("[memberpp][update]...1 " + JSON.stringify(params));

			//var result = false;

			if (id && profilePicture)
			{	
				console.log("[memberpp][update]...1.2 " + id);

				var recordExist = { "rowCount": 0 };
				if (id && id != "")
				{
					var testSQL = 'SELECT * FROM \"MemberProfilePicture\" WHERE \"MemberID\"=$1::int';
					recordExist = await pool.query(testSQL, [id]);
				}

				console.log("record count ", recordExist.rowCount);

				if (recordExist.rowCount > 0)
				{
					console.log("[memberpp-update]...2" + JSON.stringify(params));

					var updateSql = 'UPDATE \"MemberProfilePicture\" SET \"ProfilePicture\"=$2::text \
												WHERE \"MemberID\"=$1::int';

					var updateResult = await pool.query(updateSql, [id, profilePicture]);
				
					if (updateResult.rowCount > 0)
					{
						result = true;
					}
				}
				else
				{
					console.log("[memberpp--insert]..." + JSON.stringify(params));
					var sql = 'INSERT INTO \"MemberProfilePicture\" \
								(\"MemberID\",\"ProfilePicture\") VALUES \
								($1::int, $2::text)';

					var insertResult = await pool.query(sql, [id, profilePicture]);

					if (insertResult.rowCount > 0)
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

};