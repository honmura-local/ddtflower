#メッセージそのもの取得
SELECT
	id
	,message_title
	,message_content
FROM
	message_inf
WHERE
	message_type = 0
ORDER BY 
	create_datetime DESC

# メッセージそのもの追加
INSERT INTO
	message_inf(
		message_type
		,message_title
		,message_content
		,create_datetime
		,update_datetime
	)
	VALUES(
		0
		,{{タイトル}}
		,{{本文}}
		,NOW()
		,NOW()
	)
# メッセージそのもの更新
UPDATE
	message_inf
SET
	message_title = {{タイトル}}
	,message_content = {{本文}}
	,update_datetime = NOW()
WHERE
	id = {{message_infのid}}
	
# メッセージ宛先追加
INSERT INTO
	message_to(
		message_key
		,user_key
		,create_datetime
		,update_datetime
	)
	VALUES(
		{message_infのid}
		,{user_key}
		,NOW()
		,NOW()
	)

	
	