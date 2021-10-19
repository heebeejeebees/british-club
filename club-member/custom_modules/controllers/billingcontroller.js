'use strict';

module.exports = class BillingController {

    async get_list(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[Billing][get_list]..." + JSON.stringify(params));

			var sql = "SELECT * FROM \"Billing_List\""

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

	async get_ListMember(pool)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[Billing][get_ListMember]..." + JSON.stringify(params));

			var sql = "SELECT \"MemberID\",\"Name\" FROM \"Member\""

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

	async get_Member(pool,id)
	{
		var result = {};

		try
		{
			var params = {
			}
			console.log("[Billing][get_Member]..." + JSON.stringify(params));

			var sql = "SELECT * FROM \"Member\" WHERE \"MemberID\" = $1::int "

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

			console.log("[Billing][get_single]..." + JSON.stringify(params));

			var sql = "SELECT \
						* FROM \"Billing\" WHERE \
							\"BillingID\" = $1::int "

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


	async update(pool, BilID, MemID, Date, Amt, Desc )
	{
		let result = false;

		try
		{
			var params = {
	            "id"   : BilID,
	            "Mid"  : MemID,
				"Date" : Date,
				"Amt"  : Amt,
				"Desc" : Desc
			}

			console.log("[Billing][update]..." + JSON.stringify(params));

			//var result = false;

			if (MemID)
			{	
				var recordExist = await pool.query('SELECT * FROM \"Billing\" WHERE \"BillingID\" = $1::int',[BilID]);
				console.log(recordExist.rowCount);

				if (recordExist.rowCount > 0)
				{
					console.log("[Billing-update][2]..." + JSON.stringify(params));

					var updateSql = 'UPDATE \"Billing"\ SET \"MemberID"\ = $2::int \
										, \"Date"\=$3::date, \"Trans_Amt"\=$4::money, \
										\"Trans_Desc"\=$5::text \
										WHERE \"BillingID"\ = $1::int ';

					var updateResult = await pool.query(updateSql, [BilID,MemID,Date,Amt,Desc]);
				
					if (updateResult.rowCount > 0)
					{
						console.log(result);
						result = true;
					}


				}
				else
				{
					console.log("[Billing--insert]..." + JSON.stringify(params));

					var sql = 'INSERT INTO \"Billing\" \
								(\"MemberID\", \"Date\", \"Trans_Amt\", \"Trans_Desc\" ) \
	 							VALUES \
								($1::int,$2::date,$3::money,$4::text)';

					var insertResult = await pool.query(sql, [MemID,Date,Amt,Desc]);

					if (insertResult.rowCount > 0)
					{
						result = true;
					}
				}
			}
		}
		catch (err)
		{
			console.log(err);
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

			console.log("[Billing][delete]..." + JSON.stringify(params));

			var sql = '	DELETE FROM \"Billing\" \
						WHERE \"BillingID\" = $1::int '

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