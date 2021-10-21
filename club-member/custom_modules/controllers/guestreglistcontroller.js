'use strict';

var moment = require('moment');
var uuid = require('uuidv4');

module.exports = class GuestRegListController 
{

    async get_single(pool, id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[GuestRegGuestList][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegGuestList\" WHERE \
							\"GuestRegGuestListID\" = $1::int "

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

	async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}
			console.log("[GuestRegGuestList][get_list]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegGuestList\""

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

	async get_list(pool,guestRegID)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : guestRegID
			}
			console.log("[GuestRegGuestList][get_list]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegGuestList\" WHERE \
						\"GuestRegID\" = $1::int "

			var queryResult = await pool.query(sql,[guestRegID]);
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

	async get_list_with_member_by_qr_code(pool,qrCode)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : qrCode
			}
			console.log("[GuestRegGuestListView][get_list_with_member]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"GuestRegGuestListView\" WHERE \
						\"QrCode\" = $1::text AND \"Status\"='CONFIRMED' "

			var queryResult = await pool.query(sql,[qrCode]);
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
			let guestRegId = payload['guestRegID']
			let name = payload['name'] 
			console.log("[GuestRegGuestList--create_new]..." + JSON.stringify(payload));

			var sql = 'INSERT INTO \"GuestRegGuestList\" \
						(\"GuestRegID\",\"Name\",\"QrCode\") VALUES \
						($1::int, $2::text, $3::text) RETURNING \"GuestRegGuestListID\"';

			var insertResult = await pool.query(sql, [guestRegId, name, uuid.uuid()]);

			if (insertResult.rowCount > 0)
			{
				result = insertResult.rows[0]['GuestRegGuestListID'];
			}
		}
		catch (err)
		{
			console.log(err)
		}

		return result;
	}

	async delete_by_id(pool, id)
	{
		let result = false;

		try
		{
			console.log("[GuestRegGuestList--delete_by_id]..." + JSON.stringify(id));

			var sql = 'DELETE FROM \"GuestRegGuestList\" WHERE \"GuestRegGuestListID\" = $1::int';

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

	async update_by_id(pool, payload)
	{
		let result = false;

		try
		{
			let id = payload['id']
			let name = payload['name'] 
			console.log("[GuestRegGuestList--update_by_id]..." + JSON.stringify(payload));

			var sql = 'UPDATE \"GuestRegGuestList\" SET \"Name\" = $2::text WHERE  GuestRegGuestListID = $1::int';

			var updateResult = await pool.query(sql, [id, name]);

			if (updateResult.rowCount > 0)
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

	async update_check_in(pool, id)
	{
		let result = false;

		try
		{
			let payload = { "id": id }
			console.log("[GuestRegGuestList--update_check_in]..." + JSON.stringify(payload));

			var sql = 'UPDATE \"GuestRegGuestList\" SET \"TimeIn\" = NOW() WHERE \"GuestRegGuestListID\" = $1::int';

			var updateResult = await pool.query(sql, [id]);

			if (updateResult.rowCount > 0)
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
}