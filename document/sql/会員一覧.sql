# ユーザIDはセッションからとりましょう

#-----------------------------------------------------
# ユーザ情報(自分)
SELECT 
	*
FROM
	user_inf
WHERE
	id = {{ユーザID}}

#-----------------------------------------------------

#-----------------------------------------------------
# ユーザ情報
SELECT 
	*
FROM
	user_inf
ORDER BY {{ソート項目}} {{ASC or DESC}}
#-----------------------------------------------------

#-----------------------------------------------------
# ユーザ情報検索条件フル指定
SELECT
	*
FROM
	user_inf
WHERE
	user_name
LIKE
	'%{{氏名}}%'
AND
	name_kana
LIKE
	'%{{氏名カナ}}%'
AND
	telephone
LIKE
	'%{{電話番号}}%'
AND
	mail_address
LIKE
	'%{{メアド}}%'
AND
	id in(
SELECT
	user_key
FROM
	user_classwork
INNER JOIN
	classwork
ON
	user_work_status = 3
AND
	classwork.id = user_classwork.classwork_key
INNER JOIN
	time_table_day
ON
	time_table_day.id = classwork.time_table_day_key
AND 
	time_table_day.lesson_date <= {{期間TO}}
AND
	time_table_day.lesson_date >= {{期間FROM}}
)
AND
	id in(
SELECT
	user_key
FROM
	user_lesson
WHERE
	lesson_key = {{lesson_key}}	
)
#-----------------------------------------------------
#-----------------------------------------------------
# ユーザ情報検索条件フル指定を分解してみる
SELECT
	*
FROM
	user_inf
#-----------------------------------------------------
# 氏名指定時
WHERE
	user_name
LIKE
	'%{{氏名}}%'
#-----------------------------------------------------
# 氏名カナ指定時
AND
	name_kana
LIKE
	'%{{氏名カナ}}%'
#-----------------------------------------------------
# 電話番号指定時
AND
	telephone
LIKE
	'%{{電話番号}}%'
#-----------------------------------------------------
# メールアドレス指定時
AND
	mail_address
LIKE
	'%{{メアド}}%'
#-----------------------------------------------------
# 期間TO、又は期間FROM指定時
AND
	id in(
SELECT
	user_key
FROM
	user_classwork
INNER JOIN
	classwork
ON
	user_work_status = 3
AND
	classwork.id = user_classwork.classwork_key
INNER JOIN
	time_table_day
ON
	time_table_day.id = classwork.time_table_day_key
#-----------------------------------------------------
# 期間TO指定時
AND 
	time_table_day.lesson_date <= {{期間TO}}
#-----------------------------------------------------
# 期間FROM指定時
AND
	time_table_day.lesson_date >= {{期間FROM}}
)
#-----------------------------------------------------
# テーマ指定時
AND
	id in(
SELECT
	user_key
FROM
	user_lesson
WHERE
	lesson_key = {{lesson_key}}
)

#-----------------------------------------------------


#----------------------------------------------------
# テーマ指定用リスト作成
SELECT
    id AS lesson_key
    ,lesson_name
FROM
    lesson_inf
WHERE
    rec_status = 0
AND
    school_key = 1
#----------------------------------------------------

#会員一覧
# ユーザ情報(自分)
delimiter $$
CREATE PROCEDURE getSelfUserInfo(in userKey int)
BEGIN
CREATE TEMPORARY TABLE 
	tmp_user_info AS
SELECT 
	*
FROM
	user_inf
WHERE
	id = userKey
;
END$$
delimiter ;

CALL getSelfUserInfo('user_key'); SELECT * FROM tmp_user_info;

# ユーザ情報
delimiter $$
CREATE PROCEDURE getUserInfoList(in sortTarget varchar(30), sortOrder tinyint)
BEGIN

IF sortOrder = 0 THEN
	CREATE TEMPORARY TABLE 
		tmp_user_info_list AS
	SELECT 
		*
	FROM
		user_inf
	ORDER BY 
		sortTarget ASC
	;
ELSE
	CREATE TEMPORARY TABLE 
		tmp_user_info_list AS
	SELECT 
		*
	FROM
		user_inf
	ORDER BY 
		sortTarget DESC
	;
END IF;

END$$
delimiter ;

CALL getUserInfoList('sort_target', 'sort_order'); SELECT * FROM tmp_user_info_list;

# テーマ指定用リスト作成
delimiter $$
CREATE PROCEDURE getListForChooseThemes()
BEGIN
CREATE TEMPORARY TABLE 
	tmp_themes AS
SELECT
    id AS lesson_key
    ,lesson_name
FROM
    lesson_inf
WHERE
    rec_status = 0
AND
    school_key = 1
;
END$$
delimiter ;

CALL getListForChooseThemes(); SELECT * FROM tmp_themes;