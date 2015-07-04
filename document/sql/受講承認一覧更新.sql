# 受講情報の場合の更新
UPDATE
	user_classwork
SET
	user_classwork_cost = {{料金}}
WHERE
	id = {{classwork_key}}

# 備品代の時の更新
UPDATE
	commodity_sell
SET
	pay_cash =  = {{料金}}
WHERE
	id = {{commodity_sell_key}}