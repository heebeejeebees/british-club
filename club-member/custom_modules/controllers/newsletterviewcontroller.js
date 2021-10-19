'use strict';

module.exports = class NewsletterViewController {

    async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[View newsletter][get_list]..." + JSON.stringify(params));

			var sql = "SELECT * FROM \"Newsletter\""

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

			console.log("[View newsletter][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Newsletter\" WHERE \
							\"NewsID\" = $1::int "

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
    
};