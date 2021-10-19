'use strict';

module.exports = class NewsletterController {

    async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[newsletter][get_list]..." + JSON.stringify(params));

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

	async get_latest(pool, threshold)
	{
		var result = {}

		try
		{
			var params = {
			}
			console.log("[newsletter][get_latest]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Newsletter\" ORDER BY \
							\"NewsID\" DESC LIMIT $1::int "

			var queryResult = await pool.query(sql,[threshold]);
			
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

			console.log("[newsletter][get_single]..." + JSON.stringify(params));

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

	async update(pool, id, title, content)
	{
		let result = false;

		try
		{
			var params = {
	            "id" : id,
	            "title" : title,
	            "content" : content,
			}

			console.log("[newsletter][update]...1" + JSON.stringify(params));

			//var result = false;

			if (title)
			{	
				var recordExist = { "rowCount": 0 };
				if (id && id != "")
				{
					var recordExist = await pool.query('SELECT * FROM \"Newsletter\" WHERE \"NewsID\" = $1::int',[id]);
					console.log(recordExist.rowCount);
				}

				if (recordExist.rowCount > 0)
				{
					console.log("[newsletter-update]...2" + JSON.stringify(params));

					var updateSql = 'UPDATE \"Newsletter\" SET \"Title\"=$2::text, \"Content\"=$3::text \
												WHERE \"NewsID\" = $1::int';

					var updateResult = await pool.query(updateSql, [id, title, content]);
				
					if (updateResult.rowCount > 0)
					{
						result = true;
					}
				}
				else
				{
					console.log("[newsletter--insert]..." + JSON.stringify(params));

					var sql = 'INSERT INTO \"Newsletter\" \
								(\"Title\", \"Content\") VALUES \
								($1::text, $2::text)';

					var insertResult = await pool.query(sql, [title, content]);

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

	async delete(pool, id)
	{
		let result = {};

		try
		{
			var params = {
				"ID" : id
			}

			console.log("[newsletter][delete]..." + JSON.stringify(params));

			var sql = '	DELETE FROM \"Newsletter\" \
						WHERE \"NewsletterID\" = $1::int '

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