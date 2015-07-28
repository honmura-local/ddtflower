# 受講情報の更新
UPDATE
	user_classwork
SET
	user_classwork_cost = {{受講料}}
	,use_point = {{使用ポイント※但し受講料より多い場合は受講料と同額}}
    ,get_point = {{point_rate * 受講料}}
	,late_time = {{遅刻時間}}
	,update_datetime = NOW()
WHERE
	id = {{user_classwork_key}}

# 備品代情報の更新
INSERT INTO
	commodity_sell(
		sell_datetime
		, sell_number
		, pay_cash
		, use_point
        ,get_point
		,content
		,user_key
		,school_key
		,commodity_key
		,create_datetime
	)
	VALUES (
		 NOW()
		,{{個数}}
		,{{備品代}}
		,{{受講情報の更新時のポイントのあまり}
        ,{{point_rate * 備品代}}
		,{{備品代}}
		,{{ユーザID}}
		,{{セッションのschool_key}}
		,{{commodity_key※セレクトで指定した値}}
		,NOW()
	)

UPDATE
	commodity_sell
SET
	sell_datetime = NOW()
	,sell_number = {{個数}}
	,pay_cash = {{備品代}}
	,use_point = {{受講情報の更新時のポイントのあまり}
    ,get_point = {{point_rate * 備品代}}
	,update_datetime = NOW()
WHERE
	id = {{commodity_key※セレクトで指定した値}}

# 取得ポイントがある場合
UPDATE
	user_inf
SET
	,get_point = get_point + {{get_point}}
	,update_datetime = NOW()
WHERE
	id = {{ユーザID}}

# 使用ポイントがある場合(⬆️と同時にやろうと思えばできるけど複雑なんで分けた方が良さげ)
UPDATE
	user_inf
SET
	 use_point = use_point + {{使用ポイント}}
	,get_point = get_point - {{使用ポイント}}
	,update_datetime = NOW()
WHERE
	id = {{ユーザID}}
