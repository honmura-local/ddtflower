UPDATE
	user_inf
SET
	user_name = {{姓 + スペース + 名}}
	,zip_code = {{郵便番号}}
	,address = {{住所}}
	,user_sex = {{性別}}
	,birthday_date = {{誕生日}}
	,telephone = {{電話番号}}
	,telephone2 = {{緊急番号}}
	,mail_address = {{メールアドレス}}
WHERE 
	id = {{ユーザID}}