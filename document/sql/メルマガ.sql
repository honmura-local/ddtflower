
# メルマガ全部取り
SELECT 
	*
FROM
	message_inf
WHERE
	message_type = {{メール(固定)}}
	
######### ↓もそうだけどmessage_typeは何番がメールなのかはソース見ないとなので調べてください(本番のDBみるだけでもいいかも) #########

# メルマガ追加
INSERT INTO
	message_inf (
		message_type
		,send_date
		,message_title
		,message_content
		,create_datetime
	)
	VALUES (
		{{メール(固定)}}
		,{{送信日時}}
		,{{タイトル}}
		,{{本文}}
		NOW()
	)