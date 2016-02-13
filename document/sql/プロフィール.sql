# ユーザIDはセッションからとりましょう

#-----------------------------------------------------
# 全部
SELECT 
	*
FROM
	user_inf
WHERE
	id = {{ユーザID}}

#-----------------------------------------------------

#プロフィール取得
delimiter $$
CREATE PROCEDURE getUserProfile(in userKey int)
BEGIN
CREATE TEMPORARY TABLE tmp_profile AS SELECT user_name, name_kana, user_sex, birthday_date, zip_code, address, mail_address, telephone, telephone2, mail_deny FROM user_inf WHERE id = 'userId';
END$$
delimiter ;

CALL getUserProfile('user_key'); SELECT * FROM tmp_profile;
