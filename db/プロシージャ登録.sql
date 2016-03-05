-- ストアドプロシージャ登録

-- 授業予約
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `book_classwork` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `book_classwork`(
	-- 入力引数を指定する
    IN in_default_user_classwork_cost int(11)	-- デフォルト受講料
	,IN in_default_flower_cost int(11)			-- デフォルト花材費
	,IN in_user_key int(11)						-- ユーザID
	,IN in_classwork_key int(11)				-- 授業テーブルのID
	,IN in_stage_key int(11)					-- コースのステージ情報のID
	,IN in_stage_no_present int(11)				-- 現在のステージNo
	,IN in_level_key int(11)					-- コースのレベル情報のID
	,IN in_level_no_present int(11)				-- 現在のレベルNo
	,IN in_id int(11)							-- 授業ID
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する

-- 以下、3個の変数を用意する
DECLARE user_classwork_is_exists int(11);	-- ユーザ側の受講情報の存在確認用
DECLARE latest_timestamp VARCHAR(25);		-- 最新のタイムスタンプ
DECLARE updated_count int(11); 				-- UPDATE文による更新レコード数

-- user_classworkテーブル内のレコードの中で最新の更新日付を取得する
SELECT -- 出力対象の列を指定する 
	MAX(update_datetime) AS latest -- 最新の更新日付を取得する
FROM -- データ取得元のテーブルを指定する
	user_classwork -- 受講情報テーブル
INTO latest_timestamp;	-- SELECTに指定した値を変数に入れる

-- 既にキャンセルしたレコードがあるかを判定する
SELECT -- 出力対象の列を指定する
	COUNT(id) AS id	-- レコード数を集計する
FROM -- データ取得元のテーブルを指定する
	user_classwork -- 受講情報テーブル
WHERE -- 検索条件を指定する
	user_key = in_user_key	-- 引数で指定したユーザID
AND -- 合致条件を追加指定する
	classwork_key = in_classwork_key -- 引数の授業ID
INTO
	user_classwork_is_exists;	-- 指定したレコードが存在するかどうかの判定結果を格納する(0 or 1)

START TRANSACTION;	-- 更新失敗時のロールバックを行うため、トランザクション処理を開始する

-- 予約レコードがあればupdate無ければinsertを行うため分岐する
IF user_classwork_is_exists = 0 THEN
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO 
	user_classwork -- 受講情報テーブル 
	(
		user_work_status		-- 受講状況
		,user_classwork_cost	-- 受講料
		,flower_cost			-- 花材費
		,user_key				-- ユーザID
		,classwork_key			-- 授業ID
		,stage_key				-- ステージ情報ID
		,stage_no				-- ステージ番号
		,level_key				-- レベル情報ID
		,level_no				-- レベル番号
		,order_datetime			-- 受付日付
		,create_datetime		-- レコード作成日付
		,update_datetime		-- 更新日付
	)
-- 指定した列に対する値を以下に設定する 
VALUES (
	1								-- 1(予約受付)
	,in_default_user_classwork_cost -- 引数のデフォルト受講料
	,in_default_flower_cost			-- 引数のデフォルト花材費
	,in_user_key					-- 引数のユーザID
	,in_classwork_key				-- 引数の授業ID
	,in_stage_key					-- 引数のステージ情報ID
	,in_stage_no_present			-- 引数の現在のステージNo
	,in_level_key					-- 引数のレベル情報ID
	,in_level_no_present			-- 引数の現在のレベルNo
	,NOW() 							-- 現在時刻
	,NOW() 							-- 現在時刻
	,NOW() 							-- 現在時刻
);

-- 既にレコードが存在する場合(キャンセルからの再予約)
ELSE
UPDATE	-- 以下のテーブルのレコードを更新する
	user_classwork -- 受講情報テーブル
SET -- 更新対象の列と値を指定する
	user_work_status = 1					-- 1(予約受付)
	,flower_cost = in_default_flower_cost	-- 引数のデフォルト花材費
	,user_classwork_cost = in_default_user_classwork_cost -- 引数のデフォルト受講料
	,stage_key = in_stage_key				-- 引数のステージ情報ID
	,stage_no = in_stage_no_present			-- 引数の現在のステージNo
	,level_key = in_level_key				-- 引数のレベル情報ID
	,level_no = in_level_no_present			-- 引数の現在のレベルNo
    ,update_datetime = NOW()				-- 現在時刻	
    ,order_datetime = NOW()					-- 現在時刻
WHERE -- 検索条件を指定する
	id = in_id;								-- 引数で指定した受講IDを持つレコード
END IF; -- 分岐終了

-- 追加・更新を行ったレコード数を取得する
SELECT -- 出力対象の列を指定する
	COUNT(*) -- レコード数を集計する
FROM -- データ取得元のテーブルを指定する 
	user_classwork -- 受講情報テーブル
WHERE -- 検索条件を指定する
	update_datetime > latest_timestamp
INTO updated_count; -- UPDATE対象

IF updated_count = 1 THEN
	COMMIT;		-- UPDATE、INSERTを確定する
ELSE
	ROLLBACK;	-- 不正なUPDATE、INSERTが成立しないようにロールバックする 
END $$ -- ストアドプロシージャの処理を終える

delimiter ; -- 区切り文字を;に戻す

-- 授業キャンセル
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `cancel_classwork` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `cancel_classwork`(
	IN in_id int(11)			-- 受講テーブルID
	,in_classwork_key int(11)	-- 授業テーブルのID
	,in_cancel_charge int(11)	-- キャンセル料
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

-- 以下に変数を定義する
DECLARE latest_timestamp VARCHAR(25);	-- テーブル内の最新の更新日付取得用
DECLARE updated_count int(11); 			-- 更新レコードカウント用

SELECT -- 出力対象の列を指定する 
	MAX(update_datetime) AS latest		-- 
FROM -- データ取得元のテーブルを指定する
	user_classwork -- 受講情報テーブル
INTO latest_timestamp;

UPDATE	-- 以下に指定したテーブルのレコードを更新する
	user_classwork -- 受講情報テーブル
SET -- 更新対象の列と値を指定する
	user_work_status = 10
    ,update_datetime = NOW()	-- 現在時刻
WHERE -- 検索条件を指定する
	id = in_id;

SELECT -- 出力対象の列を指定する
	COUNT(*) 
FROM -- データ取得元のテーブルを指定する 
	user_classwork -- 受講情報テーブル
WHERE -- 検索条件を指定する
	update_datetime > latest_timestamp
INTO updated_count; 

IF updated_count = 1 THEN
UPDATE 
	classwork
SET -- 更新対象の列と値を指定する
	order_students = order_students-1
    ,update_datetime = NOW()	-- 現在時刻
    ,cancel_charge = in_cancel_charge
WHERE -- 検索条件を指定する
	id = in_classwork_key;	-- 引数の授業テーブルID

COMMIT;

ELSE
ROLLBACK;
END IF; -- 分岐終了

END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 管理者画面 授業詳細タブ 日ごと予約一覧
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getAdminLessonList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `getAdminLessonList`(
	OUT result text,
	IN in_date VARCHAR(25)
)
BEGIN -- 以降にストアドプロシージャの処理を記述する
 
SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	time_table_day
INNER JOIN
	classwork
ON -- 以下に指定した列を基に結合を行う
	time_table_day.id = classwork.time_table_day_key
AND -- 合致条件を追加指定する
	time_table_day.lesson_date = in_date
LEFT JOIN
	lesson_inf
ON -- 以下に指定した列を基に結合を行う
	lesson_inf.id = classwork.lesson_key
LEFT JOIN
    school_inf 
ON -- 以下に指定した列を基に結合を行う
    school_inf.id = lesson_inf.school_key
RIGHT JOIN
	timetable_inf
ON -- 以下に指定した列を基に結合を行う
	timetable_inf.id = time_table_day.timetable_key;
	
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- ブログ
#ブログ記事取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getBlogArticle(out result text)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ub.id
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.content AS text 
FROM -- データ取得元のテーブルを指定する 
	user_blog AS ub
	,user_inf AS uin
WHERE -- 検索条件を指定する
	ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL getBlogArticle(@result); SELECT -- 出力対象の列を指定する @result AS 'result';

#IDからブログ記事取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getBlogArticleWithId` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getBlogArticleWithId(out result text, in userKey int, articleId int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	* 
FROM -- データ取得元のテーブルを指定する 
	user_blog 
WHERE -- 検索条件を指定する 
	user_key = userKey 
	AND -- 合致条件を追加指定する id = articleId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL getBlogArticleWithId(@result, 'user_key', 'id'); SELECT -- 出力対象の列を指定する @result AS 'result';

#ブログ記事作成
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertNewBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertNewBlogArticle(in userKey int, blogTitle varchar(200), blogContent text, blogPublication tinyint, blogImage1 varchar(255), blogImage2 varchar(255), blogImage3 varchar(255))
BEGIN -- 以降にストアドプロシージャの処理を記述する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
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
	-- 指定した列に対する値を以下に設定する 
VALUES (
	userKey
	,blogTitle
	,blogContent
	,NOW() -- 現在時刻
	,blogPublication
	,blogImage1
	,blogImage2
	,blogImage3
	);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL insertNewBlogArticle('user_key', 'blogTitle', 'blogContent', 'blogPublication', 'image_1', 'image_2', 'image_3');

#ブログ記事更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateBlogArticle(in blogId int, blogTitle varchar(200), blogContent text, blogImage1 varchar(255), blogImage2 varchar(255), blogImage3 varchar(255), blogPublication tinyint)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE 
	user_blog 
SET -- 更新対象の列と値を指定する 
	title = blogTitle
	,content = blogContent 
	,image_1 = blogImage1
	,image_2 = blogImage2
	,image_3 = blogImage3
	,disclosure_range = blogPublication 
WHERE -- 検索条件を指定する 
	id = blogId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL updateBlogArticle('id', 'blogTitle', 'blogContent' , 'image_1', 'image_2', 'image_3', 'blogPublication');

#ブログ記事削除
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `deleteBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE deleteBlogArticle(in articleId int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
DELETE FROM -- データ削除対象のテーブルを指定する 
	user_blog 
WHERE -- 検索条件を指定する id = articleId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#マイブログ画面記事取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyBlogArticle(out result text, in userKey int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ub.id
	,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.content AS text
	, '' AS buttons
FROM -- データ取得元のテーブルを指定する 
	user_blog AS ub
	,user_inf AS uin 
WHERE -- 検索条件を指定する 
	ub.user_key = userKey
	AND -- 合致条件を追加指定する ub.user_key=uin.id 
ORDER BY 
	post_timestamp DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#マイブログ画面記事一覧取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyBlogList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyBlogList(out result text, in userKey int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ub.id,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.content AS text, 
	'' AS buttons 
FROM -- データ取得元のテーブルを指定する 
	user_blog AS ub
	,user_inf AS uin 
WHERE -- 検索条件を指定する 
	ub.user_key=userKey
	AND -- 合致条件を追加指定する ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- ギャラリー
#ギャラリー記事取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getGalleryContents` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getGalleryContents(out result text)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM -- データ取得元のテーブルを指定する 
	user_image AS ui
	,user_inf AS uin 
WHERE -- 検索条件を指定する 
	ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL getGalleryContents(@result); SELECT -- 出力対象の列を指定する @result AS 'result';

#マイギャラリー記事取得1
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyGalleryContents1` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyGalleryContents1(out result text)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM -- データ取得元のテーブルを指定する 
	user_image AS ui
	,user_inf AS uin 
ORDER BY 
	ui.update_timestamp 
DESC 
LIMIT 300;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

CALL getMyGalleryContents(@result);  SELECT -- 出力対象の列を指定する @result AS 'result';

##マイギャラリー記事取得2
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyGalleryContents2` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyGalleryContents2(out result text, in userKey int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	ui.id, ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
FROM -- データ取得元のテーブルを指定する 
	user_image AS ui
	,user_inf AS uin 
WHERE -- 検索条件を指定する 
	ui.user_key=userKey 
	AND -- 合致条件を追加指定する ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#マイギャラリー記事作成
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertGalleryContent(in userKey int, photoTitle varchar(200))
BEGIN -- 以降にストアドプロシージャの処理を記述する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO user_image(user_key, photo_title, update_timestamp) -- 指定した列に対する値を以下に設定する 
VALUES (userKey, photoTitle, NOW());
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す


#マイギャラリー記事更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateGalleryContent(in photoSummary varchar(210), articleTitle varchar(100), articleId int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
 user_image SET -- 更新対象の列と値を指定する photo_summary = photoSummary, article_title = articleTitle WHERE -- 検索条件を指定する id = articleId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す


#マイギャラリー記事削除
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `deleteGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE deleteGalleryContent(in articleId int)
BEGIN -- 以降にストアドプロシージャの処理を記述する
DELETE FROM -- データ削除対象のテーブルを指定する 
	user_image 
WHERE -- 検索条件を指定する 
	id IN (articleId);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 会員側トップ画面
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- user_inf
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_user_inf` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_user_inf(
	IN in_user_key int(11)	-- ユーザID
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

SELECT -- 出力対象の列を指定する 
	*
FROM -- データ取得元のテーブルを指定する 
	user_inf
WHERE -- 検索条件を指定する
	id = in_user_key;	-- ユーザID

END $$ -- ストアドプロシージャの処理を終える

-- essage_inf
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_message_inf` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_message_inf(
	IN in_user_key int(11)	-- ユーザID
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

SELECT -- 出力対象の列を指定する 
	message_title
	,message_content
	,send_date
FROM -- データ取得元のテーブルを指定する
	message_inf
WHERE -- 検索条件を指定する
	id IN (
		SELECT -- 出力対象の列を指定する
			message_key
		FROM -- データ取得元のテーブルを指定する
			message_to
		WHERE -- 検索条件を指定する
			user_key = in_user_key -- 引数のユーザID
		AND -- 合致条件を追加指定する
			check_datetime IS NULL
	)
ORDER BY send_date DESC;
END $$ -- ストアドプロシージャの処理を終える

-- 受講可能レッスン
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_booked_lessons` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_booked_lessons(
	IN in_user_key int(11)	-- ユーザID
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

SELECT -- 出力対象の列を指定する
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
FROM -- データ取得元のテーブルを指定する (
SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	user_classwork -- 受講情報テーブル
INNER JOIN
	classwork
ON -- 以下に指定した列を基に結合を行う
	classwork.id = user_classwork.classwork_key
AND -- 合致条件を追加指定する	
	user_classwork.user_key = in_user_key -- 引数のユーザID
INNER JOIN 
	lesson_inf
ON -- 以下に指定した列を基に結合を行う
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
ON -- 以下に指定した列を基に結合を行う	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	time_table_day
ON -- 以下に指定した列を基に結合を行う
	time_table_day.id = classwork.time_table_day_key
INNER JOIN
	timetable_inf
ON -- 以下に指定した列を基に結合を行う
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	(
        SELECT -- 出力対象の列を指定する
            MAX(students) AS biggest_students
            ,lesson_key
		FROM -- データ取得元のテーブルを指定する
            lesson_point_rate
        GROUP BY
            lesson_key	
    ) AS lsp
ON -- 以下に指定した列を基に結合を行う
    lsp.lesson_key = lesson_inf.id
AND -- 合致条件を追加指定する 
	order_students > biggest_students
INNER JOIN
	lesson_point_rate
ON -- 以下に指定した列を基に結合を行う
	lesson_point_rate.lesson_key = lesson_inf.id
AND -- 合致条件を追加指定する(
	students <= order_students
OR
	biggest_students IS NOT NULL
)) AS student_class_rec
GROUP BY
    id;

END $$ -- ストアドプロシージャの処理を終える

-- キャンセル料(率)
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_lesson_cancel_rate` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_lesson_cancel_rate(
	IN in_lesson_key INT
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

CREATE TEMPORARY TABLE tmp_lesson_cancel_rate AS 
SELECT -- 出力対象の列を指定する
	*
FROM -- データ取得元のテーブルを指定する
	lesson_cancel_rate
WHERE -- 検索条件を指定する
	lesson_key = in_lesson_key;

END $$ -- ストアドプロシージャの処理を終える

-- 受講可能レッスン
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_bookable_lessons` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_bookable_lessons(
	IN in_user_key int(11)	-- ユーザID
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

SELECT -- 出力対象の列を指定する 
    lesson_name
    ,id AS lesson_key
FROM -- データ取得元のテーブルを指定する
    lesson_inf
WHERE -- 検索条件を指定する
    id in(
        SELECT -- 出力対象の列を指定する 
            lesson_key
        FROM -- データ取得元のテーブルを指定する
            user_lesson
        WHERE -- 検索条件を指定する
            user_key = in_user_key -- 引数のユーザID
        AND -- 合致条件を追加指定する
            rec_status = 0
    )
AND -- 合致条件を追加指定する
	rec_status = 0;

END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 会員側日ごと授業一覧
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS p_user_classwork_a_day $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_user_classwork_a_day(
	IN in_date INT			-- 授業の日付
	,IN in_user_key int(11)	-- ユーザID
)
BEGIN -- 以降にストアドプロシージャの処理を記述する

SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	time_table_day
INNER JOIN
	classwork
ON -- 以下に指定した列を基に結合を行う
	time_table_day.id = classwork.time_table_day_key
AND -- 合致条件を追加指定する
	time_table_day.lesson_date = in_date
LEFT JOIN
	user_classwork -- 受講情報テーブル
ON -- 以下に指定した列を基に結合を行う
	classwork.id = user_classwork.classwork_key
AND -- 合致条件を追加指定する	
	user_classwork.user_key = in_user_key -- 引数のユーザID
INNER JOIN 
	lesson_inf
ON -- 以下に指定した列を基に結合を行う
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
ON -- 以下に指定した列を基に結合を行う	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	timetable_inf
ON -- 以下に指定した列を基に結合を行う
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	user_lesson
ON -- 以下に指定した列を基に結合を行う
	user_lesson.user_key = in_user_key -- 引数のユーザID
AND -- 合致条件を追加指定する
	user_lesson.lesson_key = lesson_inf.id
LEFT JOIN
	lesson_sub AS ul_lesson_sub
ON -- 以下に指定した列を基に結合を行う
	ul_lesson_sub.id = user_lesson.level_key
LEFT JOIN
	stage_inf AS ul_stage_inf
ON -- 以下に指定した列を基に結合を行う
	ul_stage_inf.id = user_lesson.stage_key
LEFT JOIN
	lesson_sub AS uc_lesson_sub
ON -- 以下に指定した列を基に結合を行う
	uc_lesson_sub.id = user_classwork.level_key
LEFT JOIN
	stage_inf AS uc_stage_inf
ON -- 以下に指定した列を基に結合を行う
	uc_stage_inf.id = user_classwork.stage_key;

END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

	
#パスワード変更
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateUserPassword` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateUserPassword
	(
	IN newPassword varchar(255)
	,userId int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
	user_inf 
SET -- 更新対象の列と値を指定する 
	password = newPassword
	,update_datetime = NOW()	-- 現在時刻 
WHERE -- 検索条件を指定する 
	id = userId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- ユーザプロフィール取得
#プロフィール取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserProfile` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserProfile
	(
	OUT result text
	,IN userId int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	user_inf 
WHERE -- 検索条件を指定する 
	id = userId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- ユーザプロフィール変更
#プロフィール更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateUserProfile` $$
-- プロシージャの登録を行う
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
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
	user_inf 
SET -- 更新対象の列と値を指定する 
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
WHERE -- 検索条件を指定する 
	id = userId;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 会員一覧
#会員一覧
# ユーザ情報(自分)
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getSelfUserInfo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getSelfUserInfo
	(
	OUT result text
	,IN userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	*
FROM -- データ取得元のテーブルを指定する
	user_inf
WHERE -- 検索条件を指定する
	id = userKey
;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# ユーザ情報
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserInfoList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserInfoList
	(
	OUT result text
	,IN sortTarget varchar(30)
	,sortOrder tinyint
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する

IF sortOrder = 0 THEN
	SELECT -- 出力対象の列を指定する 
		*
	FROM -- データ取得元のテーブルを指定する
		user_inf
	ORDER BY 
		sortTarget ASC
	;
ELSE
	SELECT -- 出力対象の列を指定する 
		*
	FROM -- データ取得元のテーブルを指定する
		user_inf
	ORDER BY 
		sortTarget DESC
	;
END IF; -- 分岐終了

END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# テーマ指定用リスト作成
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getListForChooseThemes` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getListForChooseThemes
	(
	OUT result text
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する
    id AS lesson_key
    ,lesson_name
FROM -- データ取得元のテーブルを指定する
    lesson_inf
WHERE -- 検索条件を指定する
    rec_status = 0
AND -- 合致条件を追加指定する
    school_key = 1
;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 会員トップ画面のお知らせ
#お知らせ取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserMessage` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserMessage
	(
	OUT result text
	,IN userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する
	message_title
	,message_content
	,send_date 
FROM -- データ取得元のテーブルを指定する 
	message_inf 
WHERE -- 検索条件を指定する 
	id IN 
	(
	SELECT -- 出力対象の列を指定する 
		message_key 
	FROM -- データ取得元のテーブルを指定する 
		message_to 
	WHERE -- 検索条件を指定する 
		user_key = userKey 
		AND -- 合致条件を追加指定する check_datetime IS NULL
	) 
	ORDER BY 
		send_date DESC
		,id DESC;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#お知らせ登録1
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertMessageInfo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertMessageInfo
	(
	IN messageTitle varchar(100)
	,messageContent text
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
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
	-- 指定した列に対する値を以下に設定する 
VALUES
	(
		DATE(NOW())
		,0
		,messageTitle
		,messageContent
		,NOW() -- 現在時刻
		,NOW() -- 現在時刻
	);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#お知らせ登録2
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertMessageTo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertMessageTo
	(
		IN userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO message_to
	(
		message_key
		,user_key
		,create_datetime 
		,update_datetime
	) 
	-- 指定した列に対する値を以下に設定する 
VALUES
	(
		(SELECT -- 出力対象の列を指定する 
			id 
		FROM -- データ取得元のテーブルを指定する 
			message_inf 
		ORDER BY 
			create_datetime DESC 
		LIMIT 1
		)
		,userKey
		,NOW() -- 現在時刻
		,NOW() -- 現在時刻
	);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す
	
-- 受講承認
#受講承認
#受講承認対象の一覧取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getLecturePermit` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getLecturePermit
	(
		OUT result text
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	time_table_day 
INNER JOIN 
	classwork 
ON -- 以下に指定した列を基に結合を行う 
	time_table_day.id = classwork.time_table_day_key 
AND -- 合致条件を追加指定する 
	time_table_day.lesson_date = SUBSTRING(NOW(), 1, 10) 
INNER JOIN 
	user_classwork -- 受講情報テーブル 
ON -- 以下に指定した列を基に結合を行う 
	classwork.id = user_classwork.classwork_key 
INNER 
	JOIN user_inf 
ON -- 以下に指定した列を基に結合を行う 
	user_inf.id = user_classwork.user_key 
INNER JOIN  
	lesson_inf 
ON -- 以下に指定した列を基に結合を行う 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	timetable_inf 
ON -- 以下に指定した列を基に結合を行う 
	timetable_inf.id = time_table_day.timetable_key 
AND -- 合致条件を追加指定する 
	user_classwork.user_work_status = 2
;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#ポイントレート算出
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getPointRate` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getPointRate
	(
		OUT result text
		,IN lessonKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する
    point_rate
    ,students
FROM -- データ取得元のテーブルを指定する
    lesson_point_rate
WHERE -- 検索条件を指定する
    lesson_point_rate.lesson_key = lessonKey
;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# 備品名リスト用クエリ
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getCommodityNameList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getCommodityNameList(out result text)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する 
	commodity_name
	,selling_price
	,id AS commodity_key 
FROM -- データ取得元のテーブルを指定する 
	commodity_inf;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#受講承認更新
#受講情報の更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `doLecturePermit` $$
-- プロシージャの登録を行う
CREATE PROCEDURE doLecturePermit
	(
		IN userClassworkCost int
		,getPoint int
		,classworkUsePoint int
		,lateTime int
		,payPrice int
		,userClassworkKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE	-- 以下に指定したテーブルのレコードを更新する
	user_classwork -- 受講情報テーブル
SET -- 更新対象の列と値を指定する
	user_classwork_cost = userClassworkCost
	,use_point = getPoint
    ,get_point = classworkUsePoint
	,late_time = lateTime
	,update_datetime = NOW()	-- 現在時刻
	,receipt_datetime = NOW()	-- 現在時刻
	,user_work_status = 3
	,pay_price = payPrice
WHERE -- 検索条件を指定する
	id = userClassworkKey;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す 

#獲得ポイント更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitGetPoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitGetPoint
	(
		IN getPoint int
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
		user_inf
	SET -- 更新対象の列と値を指定する
		get_point = get_point + getPoint
		,update_datetime = NOW()	-- 現在時刻
	WHERE -- 検索条件を指定する
		id = userKey
	;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#使用ポイント更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitUsePoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitUsePoint
	(
		IN usePoint int
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE	
		user_inf
	SET -- 更新対象の列と値を指定する
		 get_point = get_point - usePoint
		,use_point = use_point + usePoint
		,update_datetime = NOW()	-- 現在時刻
	WHERE -- 検索条件を指定する
		id = userKey
	;
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# ポイントの更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitPoints` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitPoints
	(
		IN getPoint int 
		,usePoint int 
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
#備品購入情報を追加する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO
	#獲得ポイントがあれば
	IF getPoint <> 0 THEN
		#ユーザの獲得ポイントを更新する
		CALL updateLecturePermitGetPoint(getPoint, userKey);
	END IF; -- 分岐終了

	#使用ポイントがあれば
	IF commodityUsePoint <> 0 THEN
		#ユーザの使用ポイントを更新する
		CALL updateLecturePermitUsePoint(usePoint, userKey); 
	END IF; -- 分岐終了
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# 備品代情報の更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertSellCommodity` $$
-- プロシージャの登録を行う
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
BEGIN -- 以降にストアドプロシージャの処理を記述する
#備品購入情報を追加する
	-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
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
	-- 指定した列に対する値を以下に設定する 
	VALUES (
		 NOW()
		,sellNumber
		,payCash
		,commodityUsePoint
		,commodityContent
		,userKey
		,schoolKey
		,commodityKey
		,NOW() -- 現在時刻
		,NOW() -- 現在時刻
	);

	#ポイントを反映する
	CALL updateLecturePermitPoints(getPoint, commodityUsePoint, userKey);	
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

-- 受講承認一覧

#受講承認一覧
#受講承認一覧のデータ取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getLecturePermitInfoList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getLecturePermitInfoList
	(
		OUT result text
		,IN fromDate date
		,toDate date
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
(SELECT -- 出力対象の列を指定する  
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
FROM -- データ取得元のテーブルを指定する 
	user_classwork -- 受講情報テーブル 
INNER JOIN 
	classwork 
ON -- 以下に指定した列を基に結合を行う 
	classwork.id = user_classwork.classwork_key 
INNER JOIN 
	time_table_day 
ON -- 以下に指定した列を基に結合を行う 
	time_table_day.id = classwork.time_table_day_key 
AND -- 合致条件を追加指定する time_table_day.lesson_date <= toDate
AND -- 合致条件を追加指定する time_table_day.lesson_date >= fromDate
INNER JOIN 
	user_inf 
ON -- 以下に指定した列を基に結合を行う 
	user_inf.id = user_classwork.user_key 
INNER JOIN
	lesson_inf 
ON -- 以下に指定した列を基に結合を行う 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	stage_inf 
ON -- 以下に指定した列を基に結合を行う 
	stage_inf.id = user_classwork.stage_key 
INNER JOIN 
	lesson_sub 
ON -- 以下に指定した列を基に結合を行う 
	lesson_sub.id = user_classwork.level_key 
ORDER BY 
	time_table_day.lesson_date DESC
) 
UNION ALL 
(SELECT -- 出力対象の列を指定する 
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
FROM -- データ取得元のテーブルを指定する 
	commodity_sell 
INNER JOIN 
	user_inf 
ON -- 以下に指定した列を基に結合を行う 
	user_inf.id = commodity_sell.user_key 
AND -- 合致条件を追加指定する sell_datetime <= toDate
AND -- 合致条件を追加指定する sell_datetime >= fromDate
INNER JOIN 
	commodity_inf  
ON -- 以下に指定した列を基に結合を行う 
	commodity_inf.id = commodity_sell.commodity_key 
ORDER BY 
	sell_datetime DESC
);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

#使用ポイントの更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitListPoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitListPoint
	(
		IN diffPoint int
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
	user_inf 
SET -- 更新対象の列と値を指定する 
	use_point = use_point + diffPoint
	,get_point = get_point - diffPoint
WHERE -- 検索条件を指定する 
	id = userKey;	
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# 受講情報の場合の更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitListClasswork` $$
-- プロシージャの登録を行う
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitListClasswork
	(
		IN userClassworkCost int
		,usePoint int
		,classworkId int
		,diffPoint int
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
#授業データの更新
UPDATE	-- 以下に指定したテーブルのレコードを更新する
	user_classwork -- 受講情報テーブル
SET -- 更新対象の列と値を指定する
	user_classwork_cost = userClassworkCost
	, use_point = usePoint
    ,update_datetime = NOW()	-- 現在時刻
WHERE -- 検索条件を指定する
	id = classworkId
;
CALL updateLecturePermitListPoint(diffPoint, userKey);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

# 備品代の時の更新
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitListCommodity` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitListCommodity
	(
		IN userClassworkCost int
		,commodityContent text
		,usePoint int
		,commoditySellKey int
		,diff_point int
		,userKey int
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
UPDATE
	commodity_sell
SET -- 更新対象の列と値を指定する
	pay_cash = userClassworkCost
	,commodity_key=commodityContent
	,use_point = usePoint
    ,update_datetime = NOW()	-- 現在時刻
WHERE -- 検索条件を指定する
	id = commoditySellKey
;
CALL updateLecturePermitListPoint(@result, diffPoint, userKey);
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す


-- 日ごと予約者一覧画面
#日ごと予約者一覧取得
DELIMITER $$ -- ;の代わりの区切り文字を設定する
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getEachDayLessonList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getEachDayLessonList
	(
		OUT result text
		,IN date date
	)
BEGIN -- 以降にストアドプロシージャの処理を記述する
SELECT -- 出力対象の列を指定する
	time_table_day.id AS time_table_key
	,time_table_day.lesson_date AS lesson_date
	,start_time
	,end_time
	,lesson_name
	,user_name
	,stage_inf.stage_no
	,lesson_sub.level_no
    ,user_classwork.user_work_status AS user_work_status
FROM -- データ取得元のテーブルを指定する
	time_table_day
INNER JOIN
	classwork
ON -- 以下に指定した列を基に結合を行う
	time_table_day.id = classwork.time_table_day_key
AND -- 合致条件を追加指定する
	time_table_day.lesson_date = date
INNER JOIN
	user_classwork -- 受講情報テーブル
ON -- 以下に指定した列を基に結合を行う
	classwork.id = user_classwork.classwork_key
INNER JOIN
	user_inf
ON -- 以下に指定した列を基に結合を行う
	user_inf.id = user_classwork.user_key
INNER JOIN 
	lesson_inf
ON -- 以下に指定した列を基に結合を行う
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	timetable_inf
ON -- 以下に指定した列を基に結合を行う
	timetable_inf.id = time_table_day.timetable_key
INNER JOIN
	stage_inf
ON -- 以下に指定した列を基に結合を行う
	stage_inf.id = user_classwork.stage_key
INNER JOIN
	lesson_sub
ON -- 以下に指定した列を基に結合を行う
	lesson_sub.id = user_classwork.level_key
;	
END $$ -- ストアドプロシージャの処理を終える
delimiter ; -- 区切り文字を;に戻す

