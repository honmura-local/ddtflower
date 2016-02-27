-- ストアドプロシージャ登録

-- 授業予約
DELIMITER $$
DROP PROCEDURE IF EXISTS `book_classwork` $$
CREATE PROCEDURE `book_classwork`(
    IN in_default_user_classwork_cost int(11)
	,IN in_default_flower_cost int(11)
	,IN in_user_key int(11)
	,IN in_classwork_key int(11)
	,IN in_stage_key int(11)
	,IN in_stage_no_present int(11)
	,IN in_level_key int(11)
	,IN in_level_no_present int(11)
	,IN in_id int(11)
	)
BEGIN

DECLARE user_classwork_is_exists int(11);
DECLARE latest_timestamp VARCHAR(25);
DECLARE updated_count int(11); 

SELECT 
	MAX(update_datetime) AS latest 
FROM
	user_classwork
INTO latest_timestamp;

-- 既にキャンセルしたレコードがあるか??
SELECT
	COUNT(id) AS id
FROM
	user_classwork
WHERE
	user_key = in_user_key
AND
	classwork_key = in_classwork_key
INTO
	user_classwork_is_exists;

START TRANSACTION;

-- 予約レコードがあればupdate無ければinsert
IF user_classwork_is_exists = 0 THEN
INSERT INTO 
	user_classwork (
	user_work_status
	,user_classwork_cost
	,flower_cost
	,user_key
	,classwork_key
	,stage_key
	,stage_no
	,level_key
	,level_no
	,order_datetime
	,create_datetime
	,update_datetime
	)
VALUES (
	1
	,in_default_user_classwork_cost
	,in_default_flower_cost
	,in_user_key
	,in_classwork_key
	,in_stage_key
	,in_stage_no_present
	,in_level_key
	,in_level_no_present
	,NOW()
	,NOW()
	,NOW()
);
ELSE
UPDATE
	user_classwork
SET
	user_work_status = 1
	,flower_cost = in_default_flower_cost
	,user_classwork_cost = in_default_user_classwork_cost
	,stage_key = in_stage_key
	,stage_no = in_stage_no_present
	,level_key = in_level_key
	,level_no = in_level_no_present
    ,update_datetime = NOW()
    ,order_datetime = NOW()
WHERE
	id = in_id;
END IF;

SELECT
	COUNT(*) 
FROM 
	user_classwork
WHERE
	update_datetime > latest_timestamp
INTO updated_count; 

COMMIT;

END $$

DELIMITER ;

-- 授業キャンセル
DELIMITER $$
DROP PROCEDURE IF EXISTS `cancel_classwork` $$
CREATE PROCEDURE `cancel_classwork`(
	IN in_id int(11)
	,in_classwork_key int(11)
	,in_cancel_charge int(11)
)
BEGIN

DECLARE latest_timestamp VARCHAR(25);
DECLARE updated_count int(11); 

SELECT 
	MAX(update_datetime) AS latest
FROM
	user_classwork
INTO latest_timestamp;

UPDATE
	user_classwork
SET
	user_work_status = 10
    ,update_datetime = NOW()
WHERE
	id = in_id;

SELECT
	COUNT(*) 
FROM 
	user_classwork
WHERE
	update_datetime > latest_timestamp
INTO updated_count; 

IF updated_count = 1 THEN
UPDATE 
	classwork
SET
	order_students = order_students-1
    ,update_datetime = NOW()
    ,cancel_charge = in_cancel_charge
WHERE
	id = in_classwork_key;

COMMIT;

ELSE
ROLLBACK;
END IF;

END $$
DELIMITER ;

-- 管理者画面 授業詳細タブ 日ごと予約一覧
DELIMITER $$
DROP PROCEDURE IF EXISTS `getAdminLessonList` $$
CREATE PROCEDURE `getAdminLessonList`(
	OUT result text,
	IN in_date VARCHAR(25)
)
BEGIN
 
SELECT 
	lesson_name
	,classwork.lesson_key AS lesson_key
	,start_time
	,end_time
	,time_table_day.lesson_date AS lesson_date
	,order_students
	,classwork.max_students AS max_students
	,classwork.min_students AS min_students
	,lesson_inf.min_students AS default_min_students
	,time_table_day.max_num AS max_num
	,time_table_day.min_num AS min_num
	,classwork_status
	,SUBSTRING(NOW(), 1,10) AS today
	,classwork.id AS classwork_key
	,classwork_note
	,classroom
    ,school_inf.id AS school_key
    ,school_name
	,time_table_day.id AS time_table_day_key
    ,timetable_inf.id AS timetable_key
FROM 
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = in_date
LEFT JOIN
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
LEFT JOIN
    school_inf 
ON
    school_inf.id = lesson_inf.school_key
RIGHT JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key;
	
END $$
DELIMITER ;

-- ブログ
#ブログ記事取得
delimiter $$
DROP PROCEDURE IF EXISTS `getBlogArticle` $$
CREATE PROCEDURE getBlogArticle(out result text)
BEGIN
SELECT 
	ub.id
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.content AS text 
FROM 
	user_blog AS ub
	,user_inf AS uin
WHERE
	ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
END$$
delimiter ;

CALL getBlogArticle(@result); SELECT @result AS 'result';

#IDからブログ記事取得
delimiter $$
DROP PROCEDURE IF EXISTS `getBlogArticleWithId` $$
CREATE PROCEDURE getBlogArticleWithId(out result text, in userKey int, articleId int)
BEGIN
SELECT 
	* 
FROM 
	user_blog 
WHERE 
	user_key = userKey 
	AND id = articleId;
END$$
delimiter ;

CALL getBlogArticleWithId(@result, 'user_key', 'id'); SELECT @result AS 'result';

#ブログ記事作成
delimiter $$
DROP PROCEDURE IF EXISTS `insertNewBlogArticle` $$
CREATE PROCEDURE insertNewBlogArticle(in userKey int, blogTitle varchar(200), blogContent text, blogPublication tinyint, blogImage1 varchar(255), blogImage2 varchar(255), blogImage3 varchar(255))
BEGIN
INSERT INTO 
	user_blog
	(
	user_key
	,title
	,content
	,post_timestamp
	,disclosure_range
	,image_1
	,image_2
	,image_3
	)
	VALUES (
	userKey
	,blogTitle
	,blogContent
	,NOW()
	,blogPublication
	,blogImage1
	,blogImage2
	,blogImage3
	);
END$$
delimiter ;

CALL insertNewBlogArticle('user_key', 'blogTitle', 'blogContent', 'blogPublication', 'image_1', 'image_2', 'image_3');

#ブログ記事更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateBlogArticle` $$
CREATE PROCEDURE updateBlogArticle(in blogId int, blogTitle varchar(200), blogContent text, blogImage1 varchar(255), blogImage2 varchar(255), blogImage3 varchar(255), blogPublication tinyint)
BEGIN
UPDATE 
	user_blog 
SET 
	title = blogTitle
	,content = blogContent 
	,image_1 = blogImage1
	,image_2 = blogImage2
	,image_3 = blogImage3
	,disclosure_range = blogPublication 
WHERE 
	id = blogId;
END$$
delimiter ;

CALL updateBlogArticle('id', 'blogTitle', 'blogContent' , 'image_1', 'image_2', 'image_3', 'blogPublication');

#ブログ記事削除
delimiter $$
DROP PROCEDURE IF EXISTS `deleteBlogArticle` $$
CREATE PROCEDURE deleteBlogArticle(in articleId int)
BEGIN
DELETE FROM 
	user_blog 
WHERE id = articleId;
END$$
delimiter ;

#マイブログ画面記事取得
delimiter $$
DROP PROCEDURE IF EXISTS `getMyBlogArticle` $$
CREATE PROCEDURE getMyBlogArticle(out result text, in userKey int)
BEGIN
SELECT 
	ub.id
	,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.content AS text
	, '' AS buttons
FROM 
	user_blog AS ub
	,user_inf AS uin 
WHERE 
	ub.user_key = userKey
	AND ub.user_key=uin.id 
ORDER BY 
	post_timestamp DESC;
END$$
delimiter ;

#マイブログ画面記事一覧取得
delimiter $$
DROP PROCEDURE IF EXISTS `getMyBlogList` $$
CREATE PROCEDURE getMyBlogList(out result text, in userKey int)
BEGIN
SELECT 
	ub.id,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.content AS text, 
	'' AS buttons 
FROM 
	user_blog AS ub
	,user_inf AS uin 
WHERE 
	ub.user_key=userKey
	AND ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
END$$
delimiter ;

-- ギャラリー
#ギャラリー記事取得
delimiter $$
DROP PROCEDURE IF EXISTS `getGalleryContents` $$
CREATE PROCEDURE getGalleryContents(out result text)
BEGIN
SELECT 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM 
	user_image AS ui
	,user_inf AS uin 
WHERE 
	ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
END$$
delimiter ;

CALL getGalleryContents(@result); SELECT @result AS 'result';

#マイギャラリー記事取得1
delimiter $$
DROP PROCEDURE IF EXISTS `getMyGalleryContents1` $$
CREATE PROCEDURE getMyGalleryContents1(out result text)
BEGIN
SELECT 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM 
	user_image AS ui
	,user_inf AS uin 
ORDER BY 
	ui.update_timestamp 
DESC 
LIMIT 300;
END$$
delimiter ;

CALL getMyGalleryContents(@result);  SELECT @result AS 'result';

##マイギャラリー記事取得2
delimiter $$
DROP PROCEDURE IF EXISTS `getMyGalleryContents2` $$
CREATE PROCEDURE getMyGalleryContents2(out result text, in userKey int)
BEGIN
SELECT 
	ui.id, ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM 
	user_image AS ui
	,user_inf AS uin 
WHERE 
	ui.user_key=userKey 
	AND ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
END$$
delimiter ;

#マイギャラリー記事作成
delimiter $$
DROP PROCEDURE IF EXISTS `insertGalleryContent` $$
CREATE PROCEDURE insertGalleryContent(in userKey int, photoTitle varchar(200))
BEGIN
INSERT INTO user_image(user_key, photo_title, update_timestamp) VALUES (userKey, photoTitle, NOW());
END$$
delimiter ;


#マイギャラリー記事更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateGalleryContent` $$
CREATE PROCEDURE updateGalleryContent(in photoSummary varchar(210), articleTitle varchar(100), articleId int)
BEGIN
UPDATE user_image SET photo_summary = photoSummary, article_title = articleTitle WHERE id = articleId;
END$$
delimiter ;


#マイギャラリー記事削除
delimiter $$
DROP PROCEDURE IF EXISTS `deleteGalleryContent` $$
CREATE PROCEDURE deleteGalleryContent(in articleId int)
BEGIN
DELETE FROM user_image WHERE id IN (articleId);
END$$
delimiter ;

-- 会員側トップ画面
DELIMITER $$
-- user_inf
DROP PROCEDURE IF EXISTS `p_user_inf` $$
CREATE PROCEDURE p_user_inf(
	IN in_user_key INT
)
BEGIN

SELECT 
	*
FROM 
	user_inf
WHERE
	id = in_user_key;

END$$

-- essage_inf
DELIMITER $$
DROP PROCEDURE IF EXISTS `p_message_inf` $$
CREATE PROCEDURE p_message_inf(
	IN in_user_key INT
)
BEGIN

SELECT 
	message_title
	,message_content
	,send_date
FROM
	message_inf
WHERE
	id IN (
		SELECT
			message_key
		FROM
			message_to
		WHERE
			user_key = in_user_key
		AND
			check_datetime IS NULL
	)
ORDER BY send_date DESC;
END$$

-- 受講可能レッスン
DELIMITER $$
DROP PROCEDURE IF EXISTS `p_booked_lessons` $$
CREATE PROCEDURE p_booked_lessons(
	IN in_user_key INT
)
BEGIN

SELECT
	user_classwork_cost
	,user_classwork_cost_aj
	,get_point
	,flower_cost
	,flower_cost_aj
	,extension_cost
	,lesson_name
	,school_name
	,start_time
	,end_time
	,lesson_date
    ,today
    ,lesson_key
	,id
	,biggest_students
	,MAX(point_rate) AS point_rate
	,students
	,order_students
    ,user_work_status
FROM (
SELECT 
	user_classwork_cost
	,user_classwork_cost_aj
	,user_classwork.get_point AS get_point
	,flower_cost
	,flower_cost_aj
	,user_classwork.extension_cost AS extension_cost
	,lesson_name
	,school_name
	,start_time
	,end_time
	,time_table_day.lesson_date AS lesson_date
	,lesson_point_rate.point_rate AS point_rate
	,students
	,order_students
    ,SUBSTRING(NOW(), 1,10) AS today
    ,user_classwork.stage_no AS stage_no
	,user_classwork.level_no AS level_no
    ,classwork.lesson_key AS lesson_key
	,user_classwork.id as id
	,biggest_students
    ,user_work_status
	,classwork.id AS classwork_key
FROM 
	user_classwork
INNER JOIN
	classwork
ON
	classwork.id = user_classwork.classwork_key
AND	
	user_classwork.user_key = in_user_key
INNER JOIN 
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
ON	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	time_table_day
ON
	time_table_day.id = classwork.time_table_day_key
INNER JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	(
        SELECT
            MAX(students) AS biggest_students
            ,lesson_key
		FROM
            lesson_point_rate
        GROUP BY
            lesson_key	
    ) AS lsp
ON
    lsp.lesson_key = lesson_inf.id
AND 
	order_students > biggest_students
INNER JOIN
	lesson_point_rate
ON
	lesson_point_rate.lesson_key = lesson_inf.id
AND(
	students <= order_students
OR
	biggest_students IS NOT NULL
)) AS student_class_rec
GROUP BY
    id;

END$$

-- キャンセル料(率)
DROP PROCEDURE IF EXISTS `p_lesson_cancel_rate` $$
CREATE PROCEDURE p_lesson_cancel_rate(
	IN in_lesson_key INT
)
BEGIN

CREATE TEMPORARY TABLE tmp_lesson_cancel_rate AS 
SELECT
	*
FROM
	lesson_cancel_rate
WHERE
	lesson_key = in_lesson_key;

END$$

-- 受講可能レッスン
DELIMITER $$
DROP PROCEDURE IF EXISTS `p_bookable_lessons` $$
CREATE PROCEDURE p_bookable_lessons(
	IN in_user_key INT
)
BEGIN

SELECT 
    lesson_name
    ,id AS lesson_key
FROM
    lesson_inf
WHERE
    id in(
        SELECT 
            lesson_key
        FROM
            user_lesson
        WHERE
            user_key = in_user_key
        AND
            rec_status = 0
    )
AND
	rec_status = 0;

END$$
DELIMITER ;

-- 会員側日ごと授業一覧
DELIMITER $$
DROP PROCEDURE IF EXISTS p_user_classwork_a_day $$
CREATE PROCEDURE p_user_classwork_a_day(
	IN in_date INT
	,IN in_user_key INT
)
BEGIN

SELECT 
	user_classwork_cost
	,user_classwork_cost_aj
	,user_classwork.flower_cost AS flower_cost
	,flower_cost_aj
	,user_classwork.extension_cost AS extension_cost
	,uc_stage_inf.stage_no AS stage_no
	,uc_lesson_sub.level_no AS level_no
	,lesson_name
	,classwork.lesson_key AS lesson_key
	,pre_order_days
	,stop_order_date
	,school_name
	,start_time
	,end_time
	,time_table_day.lesson_date AS lesson_date
	,order_students
	,classwork.max_students AS max_students
	,classwork.min_students AS min_students
	,lesson_inf.min_students AS default_min_students
	,time_table_day.max_num AS max_num
	,time_table_day.min_num AS min_num
	,ul_lesson_sub.flower_cost AS default_flower_cost
	,ul_lesson_sub.level_price AS default_user_classwork_cost
	,ul_lesson_sub.level_no AS level_no_present
	,classwork_status
	,user_work_status
	,ul_stage_inf.stage_no AS stage_no_present
	,SUBSTRING(NOW(), 1,10) AS today
	,user_classwork.id AS id
	,classwork.id AS classwork_key
	,ul_lesson_sub.id AS level_key
	,ul_stage_inf.id AS stage_key 
FROM 
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = in_date
LEFT JOIN
	user_classwork
ON
	classwork.id = user_classwork.classwork_key
AND	
	user_classwork.user_key = in_user_key
INNER JOIN 
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
ON	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	user_lesson
ON
	user_lesson.user_key = in_user_key
AND
	user_lesson.lesson_key = lesson_inf.id
LEFT JOIN
	lesson_sub AS ul_lesson_sub
ON
	ul_lesson_sub.id = user_lesson.level_key
LEFT JOIN
	stage_inf AS ul_stage_inf
ON
	ul_stage_inf.id = user_lesson.stage_key
LEFT JOIN
	lesson_sub AS uc_lesson_sub
ON
	uc_lesson_sub.id = user_classwork.level_key
LEFT JOIN
	stage_inf AS uc_stage_inf
ON
	uc_stage_inf.id = user_classwork.stage_key;

END$$
DELIMITER ;

	
#パスワード変更
delimiter $$
DROP PROCEDURE IF EXISTS `updateUserPassword` $$
CREATE PROCEDURE updateUserPassword
	(
	IN newPassword varchar(255)
	,userId int
	)
BEGIN
UPDATE 
	user_inf 
SET 
	password = newPassword
	,update_datetime = NOW() 
WHERE 
	id = userId;
END$$
delimiter ;

-- ユーザプロフィール取得
#プロフィール取得
delimiter $$
DROP PROCEDURE IF EXISTS `getUserProfile` $$
CREATE PROCEDURE getUserProfile
	(
	OUT result text
	,IN userId int
	)
BEGIN
SELECT 
	user_name
	,name_kana
	,user_sex
	,birthday_date
	,zip_code
	,address
	,mail_address
	,telephone
	,telephone2
	,mail_deny 
FROM 
	user_inf 
WHERE 
	id = userId;
END$$
delimiter ;

-- ユーザプロフィール変更
#プロフィール更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateUserProfile` $$
CREATE PROCEDURE updateUserProfile
	(
	IN userName varchar(40)
	,nameKana varchar(40)
	,zipCode varchar(8)
	,userAddress varchar(255)
	,userSex tinyint
	,birthdayDate date
	,userTelephone1 varchar(20)
	,userTelephone2 varchar(20)
	,userMailAddress varchar(255)
	,mailDeny int
	,userId int
	)
BEGIN
UPDATE 
	user_inf 
SET 
	user_name = userName
	,name_kana = nameKana
	,zip_code = zipCode
	,address = userAddress
	,user_sex = userSex
	,birthday_date = birthdayDate
	,telephone = userTelephone1
	,telephone2 = userTelephone2
	,mail_address = userMailAddress
	,mail_deny = mailDeny
	,update_datetime=NOW() 
WHERE 
	id = userId;
END$$
delimiter ;

-- 会員一覧
#会員一覧
# ユーザ情報(自分)
delimiter $$
DROP PROCEDURE IF EXISTS `getSelfUserInfo` $$
CREATE PROCEDURE getSelfUserInfo
	(
	OUT result text
	,IN userKey int
	)
BEGIN
SELECT 
	*
FROM
	user_inf
WHERE
	id = userKey
;
END$$
delimiter ;

# ユーザ情報
delimiter $$
DROP PROCEDURE IF EXISTS `getUserInfoList` $$
CREATE PROCEDURE getUserInfoList
	(
	OUT result text
	,IN sortTarget varchar(30)
	,sortOrder tinyint
	)
BEGIN

IF sortOrder = 0 THEN
	SELECT 
		*
	FROM
		user_inf
	ORDER BY 
		sortTarget ASC
	;
ELSE
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

# テーマ指定用リスト作成
delimiter $$
DROP PROCEDURE IF EXISTS `getListForChooseThemes` $$
CREATE PROCEDURE getListForChooseThemes
	(
	OUT result text
	)
BEGIN
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

-- 会員トップ画面のお知らせ
#お知らせ取得
delimiter $$
DROP PROCEDURE IF EXISTS `getUserMessage` $$
CREATE PROCEDURE getUserMessage
	(
	OUT result text
	,IN userKey int
	)
BEGIN
SELECT
	message_title
	,message_content
	,send_date 
FROM 
	message_inf 
WHERE 
	id IN 
	(
	SELECT 
		message_key 
	FROM 
		message_to 
	WHERE 
		user_key = userKey 
		AND check_datetime IS NULL
	) 
	ORDER BY 
		send_date DESC
		,id DESC;
END$$
delimiter ;

#お知らせ登録1
delimiter $$
DROP PROCEDURE IF EXISTS `insertMessageInfo` $$
CREATE PROCEDURE insertMessageInfo
	(
	IN messageTitle varchar(100)
	,messageContent text
	)
BEGIN
INSERT INTO 
	message_inf
	(
		send_date
		,message_type
		,message_title
		,message_content
		,create_datetime
		,update_datetime
	) 
	VALUES
	(
		DATE(NOW())
		,0
		,messageTitle
		,messageContent
		,NOW()
		,NOW()
	);
END$$
delimiter ;

#お知らせ登録2
delimiter $$
DROP PROCEDURE IF EXISTS `insertMessageTo` $$
CREATE PROCEDURE insertMessageTo
	(
		IN userKey int
	)
BEGIN
INSERT INTO message_to
	(
		message_key
		,user_key
		,create_datetime 
		,update_datetime
	) 
	VALUES
	(
		(SELECT 
			id 
		FROM 
			message_inf 
		ORDER BY 
			create_datetime DESC 
		LIMIT 1
		)
		,userKey
		,NOW()
		,NOW()
	);
END$$
delimiter ;
	
-- 受講承認
#受講承認
#受講承認対象の一覧取得
delimiter $$
DROP PROCEDURE IF EXISTS `getLecturePermit` $$
CREATE PROCEDURE getLecturePermit
	(
		OUT result text
	)
BEGIN
SELECT 
	'' AS columnCheckbox
	,time_table_day.id AS time_table_key 
	,time_table_day.lesson_date AS lesson_date 
	,classwork.order_students AS order_students    
	,classwork.lesson_key AS lesson_key
	,start_time 
	,end_time 
	,lesson_name 
	,user_name 
	,user_classwork.stage_no AS stage_no 
	,user_classwork.level_no AS level_no 
	,user_classwork_cost 
	,user_inf.get_point AS get_point 
	,user_classwork.id AS user_classwork_key 
	,user_inf.id AS user_key 
	,timetable_inf.school_key AS school_key
	,classwork.order_students
FROM 
	time_table_day 
INNER JOIN 
	classwork 
ON 
	time_table_day.id = classwork.time_table_day_key 
AND 
	time_table_day.lesson_date = SUBSTRING(NOW(), 1, 10) 
INNER JOIN 
	user_classwork 
ON classwork.id = user_classwork.classwork_key 
INNER 
	JOIN user_inf 
ON user_inf.id = user_classwork.user_key 
INNER JOIN  
	lesson_inf 
ON 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	timetable_inf 
ON 
	timetable_inf.id = time_table_day.timetable_key 
AND 
	user_classwork.user_work_status = 2
;
END$$
delimiter ;

#ポイントレート算出
delimiter $$
DROP PROCEDURE IF EXISTS `getPointRate` $$
CREATE PROCEDURE getPointRate
	(
		OUT result text
		,IN lessonKey int
	)
BEGIN
SELECT
    point_rate
    ,students
FROM
    lesson_point_rate
WHERE
    lesson_point_rate.lesson_key = lessonKey
;
END$$
delimiter ;

# 備品名リスト用クエリ
delimiter $$
DROP PROCEDURE IF EXISTS `getCommodityNameList` $$
CREATE PROCEDURE getCommodityNameList(out result text)
BEGIN
SELECT 
	commodity_name
	,selling_price
	,id AS commodity_key 
FROM 
	commodity_inf;
END$$
delimiter ;

#受講承認更新
#受講情報の更新
delimiter $$
DROP PROCEDURE IF EXISTS `doLecturePermit` $$
CREATE PROCEDURE doLecturePermit
	(
		IN userClassworkCost int
		,getPoint int
		,classworkUsePoint int
		,lateTime int
		,payPrice int
		,userClassworkKey int
	)
BEGIN
UPDATE
	user_classwork
SET
	user_classwork_cost = userClassworkCost
	,use_point = getPoint
    ,get_point = classworkUsePoint
	,late_time = lateTime
	,update_datetime = NOW()
	,receipt_datetime = NOW()
	,user_work_status = 3
	,pay_price = payPrice
WHERE
	id = userClassworkKey;
END$$
delimiter ; 

#獲得ポイント更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitGetPoint` $$
CREATE PROCEDURE updateLecturePermitGetPoint
	(
		IN getPoint int
		,userKey int
	)
BEGIN
	UPDATE
		user_inf
	SET
		get_point = get_point + getPoint
		,update_datetime = NOW()
	WHERE
		id = userKey
	;
END$$
delimiter ;

#使用ポイント更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitUsePoint` $$
CREATE PROCEDURE updateLecturePermitUsePoint
	(
		IN usePoint int
		,userKey int
	)
BEGIN
	UPDATE
		user_inf
	SET
		 get_point = get_point - usePoint
		,use_point = use_point + usePoint
		,update_datetime = NOW()
	WHERE
		id = userKey
	;
END$$
delimiter ;

# ポイントの更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitPoints` $$
CREATE PROCEDURE updateLecturePermitPoints
	(
		IN getPoint int 
		,usePoint int 
		,userKey int
	)
BEGIN
#備品購入情報を追加する
INSERT INTO
	#獲得ポイントがあれば
	IF getPoint <> 0 THEN
		#ユーザの獲得ポイントを更新する
		CALL updateLecturePermitGetPoint(getPoint, userKey);
	END IF;

	#使用ポイントがあれば
	IF commodityUsePoint <> 0 THEN
		#ユーザの使用ポイントを更新する
		CALL updateLecturePermitUsePoint(usePoint, userKey); 
	END IF;
END$$
delimiter ;

# 備品代情報の更新
delimiter $$
DROP PROCEDURE IF EXISTS `insertSellCommodity` $$
CREATE PROCEDURE insertSellCommodity
	(
		IN sellNumber int 
		,payCash int 
		,commodityUsePoint int 
		,commodityContent text
		,userKey int 
		,schoolKey int 
		,commodityKey int
		,getPoint int
	)
BEGIN
#備品購入情報を追加する
	INSERT INTO commodity_sell(
		sell_datetime
		,sell_number
		,pay_cash
		,use_point
		,content
		,user_key
		,school_key
		,commodity_key
		,create_datetime
		,update_datetime
	)
	VALUES (
		 NOW()
		,sellNumber
		,payCash
		,commodityUsePoint
		,commodityContent
		,userKey
		,schoolKey
		,commodityKey
		,NOW()
		,NOW()
	);

	#ポイントを反映する
	CALL updateLecturePermitPoints(getPoint, commodityUsePoint, userKey);	
END$$
delimiter ;

-- 受講承認一覧

#受講承認一覧
#受講承認一覧のデータ取得
delimiter $$
DROP PROCEDURE IF EXISTS `getLecturePermitInfoList` $$
CREATE PROCEDURE getLecturePermitInfoList
	(
		OUT result text
		,IN fromDate date
		,toDate date
	)
BEGIN
(SELECT  
	user_classwork.id AS id 
	,user_name 
	,lesson_name 
	,user_classwork.user_classwork_cost AS cost 
	,user_classwork.use_point AS use_point 
	,stage_inf.stage_no AS stage_no 
	,lesson_sub.level_no AS level_no 
	,1 AS sell_number 
	,'' AS content 
	,user_inf.id AS user_key 
	,lesson_inf.school_key AS school_key 
	, '' AS commodity_key 
	,user_inf.get_point AS get_point 
FROM 
	user_classwork 
INNER JOIN 
	classwork 
ON 
	classwork.id = user_classwork.classwork_key 
INNER JOIN 
	time_table_day 
ON 
	time_table_day.id = classwork.time_table_day_key 
AND time_table_day.lesson_date <= toDate
AND time_table_day.lesson_date >= fromDate
INNER JOIN 
	user_inf 
ON 
	user_inf.id = user_classwork.user_key 
INNER JOIN
	lesson_inf 
ON 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	stage_inf 
ON 
	stage_inf.id = user_classwork.stage_key 
INNER JOIN 
	lesson_sub 
ON 
	lesson_sub.id = user_classwork.level_key 
ORDER BY 
	time_table_day.lesson_date DESC
) 
UNION ALL 
(SELECT 
	commodity_sell.id AS id 
	,user_name 
	,'' AS lesson_name 
	,pay_cash AS cost 
	,commodity_sell.use_point AS use_point 
	,1 AS stage_no 
	,1 AS level_no 
	,sell_number 
	,content 
	,user_inf.id AS user_key 
	,commodity_sell.school_key AS school_key
	,commodity_sell.commodity_key 
	,user_inf.get_point AS get_point 
FROM 
	commodity_sell 
INNER JOIN 
	user_inf 
ON 
	user_inf.id = commodity_sell.user_key 
AND sell_datetime <= toDate
AND sell_datetime >= fromDate
INNER JOIN 
	commodity_inf  
ON 
	commodity_inf.id = commodity_sell.commodity_key 
ORDER BY 
	sell_datetime DESC
);
END$$
delimiter ;

#使用ポイントの更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitListPoint` $$
CREATE PROCEDURE updateLecturePermitListPoint
	(
		IN diffPoint int
		,userKey int
	)
BEGIN
UPDATE 
	user_inf 
SET 
	use_point = use_point + diffPoint
	,get_point = get_point - diffPoint
WHERE 
	id = userKey;	
END$$
delimiter ;

# 受講情報の場合の更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitListClasswork` $$
CREATE PROCEDURE updateLecturePermitListClasswork
	(
		IN userClassworkCost int
		,usePoint int
		,classworkId int
		,diffPoint int
		,userKey int
	)
BEGIN
#授業データの更新
UPDATE
	user_classwork
SET
	user_classwork_cost = userClassworkCost
	, use_point = usePoint
    ,update_datetime = NOW()
WHERE
	id = classworkId
;
CALL updateLecturePermitListPoint(diffPoint, userKey);
END$$
delimiter ;

# 備品代の時の更新
delimiter $$
DROP PROCEDURE IF EXISTS `updateLecturePermitListCommodity` $$
CREATE PROCEDURE updateLecturePermitListCommodity
	(
		IN userClassworkCost int
		,commodityContent text
		,usePoint int
		,commoditySellKey int
		,diff_point int
		,userKey int
	)
BEGIN
UPDATE
	commodity_sell
SET
	pay_cash = userClassworkCost
	,commodity_key=commodityContent
	,use_point = usePoint
    ,update_datetime = NOW()
WHERE
	id = commoditySellKey
;
CALL updateLecturePermitListPoint(@result, diffPoint, userKey);
END$$
delimiter ;


-- 日ごと予約者一覧画面
#日ごと予約者一覧取得
delimiter $$
DROP PROCEDURE IF EXISTS `getEachDayLessonList` $$
CREATE PROCEDURE getEachDayLessonList
	(
		OUT result text
		,IN date date
	)
BEGIN
SELECT
	time_table_day.id AS time_table_key
	,time_table_day.lesson_date AS lesson_date
	,start_time
	,end_time
	,lesson_name
	,user_name
	,stage_inf.stage_no
	,lesson_sub.level_no
    ,user_classwork.user_work_status AS user_work_status
FROM
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = date
INNER JOIN
	user_classwork
ON
	classwork.id = user_classwork.classwork_key
INNER JOIN
	user_inf
ON
	user_inf.id = user_classwork.user_key
INNER JOIN 
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key
INNER JOIN
	stage_inf
ON
	stage_inf.id = user_classwork.stage_key
INNER JOIN
	lesson_sub
ON
	lesson_sub.id = user_classwork.level_key
;	
END$$
delimiter ;

