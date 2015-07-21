INSERT INTO 
	suggestion_box(
		user_key
		,suggest_type		--種別
		,suggest_title		--タイトル
		,suggest_content	--内容
		,send_datetime
		,create_datetime
		,update_user
		,update_datetime
	)
	VALUES (
		'user_key'
		,'suggest_type'
		,'suggest_title'
		,'suggest_content'
		,NOW()
		,NOW()
		,'user_key'
		,NOW()
	)