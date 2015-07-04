# パスワードはphpで言うならsha1()をかけてから保存
UPDATE
	user_inf	
SET
	password = {{sha1暗号化password}}
    ,update_datetime = NOW()
WHERE
	id = {{ユーザID}}