'use strict';

module.exports = class BillingViewController {

	async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[BillingView][get_list]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Billing_Aging_View\""

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

	async get_user(pool,id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[BillingView][get_user]..." + JSON.stringify(params));

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
	async get_chart(pool,id)
	{
		var result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[BillingView][get_Chart]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Billing_Month\" WHERE \
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

	async get_single(pool, id)
	{
		var result = {};

		try
		{
            
			var params = {
				"ID" : id
			}

			console.log("[BillingView][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Billing_Aging_View\" WHERE \
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
};
