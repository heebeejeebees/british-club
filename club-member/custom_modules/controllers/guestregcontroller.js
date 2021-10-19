'use strict';

var moment = require('moment');

module.exports = class GuestRegController 
{

    async get_single(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[Guest][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestReg\" WHERE \
							\"GuestRegID\" = $1::int "

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

	async get_single_with_member(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[Guest][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegView\" WHERE \
							\"GuestRegID\" = $1::int "

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

	async get_list(pool,id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}
			console.log("[Guest][get_list]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestReg\" WHERE \
						\"MemberID\" = $1::int "

			var queryResult = await pool.query(sql,[id]);
			console.log('result...',queryResult.rowCount);

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

	async get_list_by_date(pool)
	{
		var result = {};

		try
		{
			let params = {}
			console.log("[Guest][get_list_by_date]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegView\""

			var queryResult = await pool.query(sql);
			console.log('result...',queryResult.rowCount);

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

	async create_new(pool, payload)
	{
		let result = -1;

		try
		{				
			let memberId = payload['member']['MemberID'] 
			let visitDate = payload['date']
			console.log("[guest--create_new]..." + JSON.stringify(payload));

			var sql = 'INSERT INTO \"GuestReg\" \
						(\"MemberID\",\"Date\",\"Status\") VALUES \
						($1::int, $2::date, $3::text) RETURNING \"GuestRegID\"';

			var insertResult = await pool.query(sql, [memberId, visitDate, "NEW"]);

			if (insertResult.rowCount > 0)
			{
				result = insertResult.rows[0]['GuestRegID'];
			}
		}
		catch (err)
		{
			console.log(err)
		}

		return result;
	}

	async confirm(pool, id)
	{
		let result = false;

		try
		{				
			console.log("[guest registration--confirm]..." + JSON.stringify(id));

			var sql = 'UPDATE \"GuestReg\" SET \"Status\"=\'CONFIRMED\' \
						WHERE \"GuestRegID\" = $1::int';

			var queryResult = await pool.query(sql, [id]);

			if (queryResult.rowCount > 0)
			{
				result = true;
			}
		}
		catch (err)
		{
			console.log(err)
		}

		return result;
	}

	async update_Date(pool, id, date, Mid)
	{
		let result = false;

		try
		{
			var params = {
	            "id" : id,
				"date" : date,
				"Mid" : Mid
			}

			console.log("[GuestReg][update]...1 " + JSON.stringify(params));

			//var result = false;

			if (date)
			{	
				console.log("[GuestReg][update]...1.2 " + date);

				var recordExist = { "rowCount": 0 };
				if (id && id != "")
				{
					var testSQL = 'SELECT * FROM \"GuestReg\" WHERE \"PKey\"=$1::int';
					recordExist = await pool.query(testSQL, [id]);
				}

				console.log("record count ", recordExist.rowCount);

				if (recordExist.rowCount > 0)
				{
					console.log("[GuestReg]...2" + JSON.stringify(params));

					var updateSql = 'UPDATE \"GuestReg\" SET \"Date\"=$2::date \
												WHERE \"PKey\"=$1::int';

					var updateResult = await pool.query(updateSql, [id, date]);
				
					if (updateResult.rowCount > 0)
					{
						result = true;
					}
				}
				else
				{
					console.log("[member--insert]..." + JSON.stringify(params));

					var sql = 'INSERT INTO \"GuestReg\" \
								(\"Date\") VALUES \
								($1::date)';

					var insertResult = await pool.query(sql, [date]);

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

	//guest list command
	async get_single_guest(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[Guest][get_single_guest]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegristrationGuestList\" WHERE \
							\"GuestRegID\" = $1::int "

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
}
