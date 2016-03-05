-- ストアドプロシージャ登録

-- 授業予約
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `book_classwork` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `book_classwork`(
	-- 入力引数を指定する
	-- デフォルト受講料
    IN in_default_user_classwork_cost int(11)
    -- デフォルト花材費
	,IN in_default_flower_cost int(11)
	-- ユーザID
	,IN in_user_key int(11)
	-- 授業テーブルのID
	,IN in_classwork_key int(11)
	-- コースのステージ情報のID
	,IN in_stage_key int(11)
	-- 現在のステージNo
	,IN in_stage_no_present int(11)
	-- コースのレベル情報のID
	,IN in_level_key int(11)
	-- 現在のレベルNo
	,IN in_level_no_present int(11)
	-- 授業ID
	,IN in_id int(11)
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 以下、3個の変数を用意する
-- ユーザ側の受講情報の存在確認用
DECLARE user_classwork_is_exists int(11);
-- 最新のタイムスタンプ
DECLARE latest_timestamp VARCHAR(25);
-- UPDATE文による更新レコード数
DECLARE updated_count int(11);

-- user_classworkテーブル内のレコードの中で最新の更新日付を取得する
-- 出力対象の列を指定する
SELECT
	-- 最新の更新日付を取得する
	MAX(update_datetime) AS latest
-- データ取得元のテーブルを指定する
FROM
	-- 受講情報テーブル
	user_classwork
-- SELECTに指定した値を変数に入れる
INTO latest_timestamp;

-- 既にキャンセルしたレコードがあるかを判定する
-- 出力対象の列を指定する
SELECT
	-- レコード数を集計する
	COUNT(id) AS id
-- データ取得元のテーブルを指定する
FROM
	-- 受講情報テーブル
	user_classwork
-- 受講情報テーブル
WHERE
	-- 引数で指定したユーザID
	user_key = in_user_key
-- 合致条件を追加指定する
AND
	-- 引数の授業ID
	classwork_key = in_classwork_key
INTO
	-- 指定したレコードが存在するかどうかの判定結果を格納する(0 or 1)
	user_classwork_is_exists;
	
-- 更新失敗時のロールバックを行うため、トランザクション処理を開始する
START TRANSACTION;

-- 予約レコードがあればupdate無ければinsertを行うため分岐する
IF user_classwork_is_exists = 0 THEN
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO 
	-- 更新失敗時のロールバックを行うため、トランザクション処理を開始する
	user_classwork 
	(
		-- 受講状況
		user_work_status
		-- 受講料
		,user_classwork_cost
		-- 花材費
		,flower_cost
		-- ユーザID
		,user_key
		-- 授業ID
		,classwork_key
		-- ステージ情報ID
		,stage_key
		-- ステージ番号
		,stage_no
		-- レベル情報ID
		,level_key
		-- レベル番号
		,level_no
		-- 受付日付
		,order_datetime
		-- レコード作成日付
		,create_datetime
		-- 更新日付
		,update_datetime
	)
-- 指定した列に対する値を以下に設定する 
VALUES (
	-- 1(予約受付)
	1
	-- 引数のデフォルト受講料
	,in_default_user_classwork_cost
	-- 引数のデフォルト花材費
	,in_default_flower_cost
	-- 引数のユーザID
	,in_user_key
	-- 引数の授業ID
	,in_classwork_key
	-- 引数のステージ情報ID
	,in_stage_key
	-- 引数の現在のステージNo
	,in_stage_no_present
	-- 引数のレベル情報ID
	,in_level_key
	-- 引数の現在のレベルNo
	,in_level_no_present
	-- 現在時刻
	,NOW()
	-- 現在時刻
	,NOW()
	-- 現在時刻
	,NOW()
);

-- 既にレコードが存在する場合(キャンセルからの再予約)
ELSE
-- 以下のテーブルのレコードを更新する
UPDATE
	-- 受講情報テーブル
	user_classwork
-- 更新対象の列と値を指定する
SET
	-- 1(予約受付)
	user_work_status = 1
	-- 引数のデフォルト花材費
	,flower_cost = in_default_flower_cost
	-- 引数のデフォルト受講料
	,user_classwork_cost = in_default_user_classwork_cost
	-- 引数のステージ情報ID
	,stage_key = in_stage_key
	-- 引数の現在のステージNo
	,stage_no = in_stage_no_present
	-- 引数のレベル情報ID
	,level_key = in_level_key
	-- 引数の現在のレベルNo
	,level_no = in_level_no_present
	-- 現在時刻
    ,update_datetime = NOW()
    -- 現在時刻
    ,order_datetime = NOW()
-- 検索条件を指定する
WHERE
	-- 引数で指定した受講IDを持つレコード
	id = in_id;
-- 分岐終了
END IF;

-- 追加・更新を行ったレコード数を取得する
-- 出力対象の列を指定する
SELECT
	-- レコード数を集計する
	COUNT(*)
-- データ取得元のテーブルを指定する
FROM
	-- 受講情報テーブル
	user_classwork
-- 検索条件を指定する
WHERE
	update_datetime > latest_timestamp
-- UPDATE対象の存在をカウントする
INTO updated_count; 

-- UPDATE、INSERTを確定する
IF updated_count = 1 THEN
	COMMIT;
ELSE
	-- 不正なUPDATE、INSERTが成立しないようにロールバックする
	ROLLBACK;
-- 分岐を終了する
END IF;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 授業キャンセル
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `cancel_classwork` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `cancel_classwork`(
	-- 受講テーブルID
	IN in_id int(11)
	-- 授業テーブルのID
	,in_classwork_key int(11)
	-- キャンセル料
	,in_cancel_charge int(11)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 以下に変数を定義する
-- テーブル内の最新の更新日付取得用
DECLARE latest_timestamp VARCHAR(25);
-- 更新レコードカウント用
DECLARE updated_count int(11); 

-- 出力対象の列を指定する
SELECT 
	MAX(update_datetime) AS latest
-- データ取得元のテーブルを指定する
FROM
	-- 受講情報テーブル
	user_classwork
INTO latest_timestamp;

-- 以下に指定したテーブルのレコードを更新する
UPDATE
	-- 受講情報テーブル
	user_classwork
-- 更新対象の列と値を指定する
SET
	-- 受講キャンセル状態の値をセットする
	user_work_status = 10
	-- 現在時刻
    ,update_datetime = NOW()
-- 検索条件を指定する
WHERE
	id = in_id;

-- 出力対象の列を指定する
SELECT
	COUNT(*)
-- データ取得元のテーブルを指定する
FROM 
	-- 受講情報テーブル
	user_classwork
-- 検索条件を指定する
WHERE
	update_datetime > latest_timestamp
INTO updated_count; 

IF updated_count = 1 THEN
UPDATE 
	classwork
-- 更新対象の列と値を指定する
SET
	order_students = order_students-1
	-- 現在時刻
    ,update_datetime = NOW()
    ,cancel_charge = in_cancel_charge
-- 検索条件を指定する
WHERE
	-- 引数の授業テーブルID
	id = in_classwork_key;

COMMIT;

ELSE
ROLLBACK;
-- 分岐終了
END IF;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 管理者画面 授業詳細タブ 日ごと予約一覧
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getAdminLessonList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE `getAdminLessonList`(
	OUT result text,
	IN in_date VARCHAR(25)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
 
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	time_table_day
INNER JOIN
	classwork
-- 以下に指定した列を基に結合を行う
ON
	time_table_day.id = classwork.time_table_day_key
-- 合致条件を追加指定する
AND
	time_table_day.lesson_date = in_date
LEFT JOIN
	lesson_inf
-- 以下に指定した列を基に結合を行う
ON
	lesson_inf.id = classwork.lesson_key
LEFT JOIN
    school_inf 
-- 以下に指定した列を基に結合を行う
ON
    school_inf.id = lesson_inf.school_key
RIGHT JOIN
	timetable_inf
-- 以下に指定した列を基に結合を行う
ON
	timetable_inf.id = time_table_day.timetable_key;
	
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- ブログ
#ブログ記事取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getBlogArticle(out result text)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	ub.id
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.content AS text 
-- データ取得元のテーブルを指定する
FROM 
	user_blog AS ub
	,user_inf AS uin
-- 検索条件を指定する
WHERE
	ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#IDからブログ記事取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getBlogArticleWithId` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getBlogArticleWithId(out result text, in userKey int, articleId int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	* 
-- データ取得元のテーブルを指定する
FROM 
	user_blog 
-- 検索条件を指定する
WHERE 
	user_key = userKey
	 -- 合致条件を追加指定する
	AND id = articleId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#ブログ記事作成
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertNewBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertNewBlogArticle(in userKey int, blogTitle varchar(200), blogContent text, blogPublication tinyint, blogImage1 varchar(255), blogImage2 varchar(255), blogImage3 varchar(255))
-- 以降にストアドプロシージャの処理を記述する
BEGIN
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
	-- 現在時刻
	,NOW() 
	,blogPublication
	,blogImage1
	,blogImage2
	,blogImage3
	);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#ブログ記事更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateBlogArticle
	(
		IN blogId int
		,blogTitle varchar(200)
		,blogContent text
		,blogImage1 varchar(255)
		,blogImage2 varchar(255)
		,blogImage3 varchar(255)
		,blogPublication tinyint
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE 
	user_blog 
-- 更新対象の列と値を指定する
SET 
	title = blogTitle
	,content = blogContent 
	,image_1 = blogImage1
	,image_2 = blogImage2
	,image_3 = blogImage3
	,disclosure_range = blogPublication 
-- 検索条件を指定する
WHERE 
	id = blogId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#ブログ記事削除
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `deleteBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE deleteBlogArticle(in articleId int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- データ削除対象のテーブルを指定する
DELETE FROM 
	user_blog 
-- 検索条件を指定する
WHERE id = articleId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#マイブログ画面記事取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyBlogArticle` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyBlogArticle(out result text, in userKey int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM
	user_blog AS ub
	,user_inf AS uin 
-- 検索条件を指定する
WHERE 
	ub.user_key = userKey
	-- 合致条件を追加指定する
	AND ub.user_key=uin.id 
ORDER BY 
	post_timestamp DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#マイブログ画面記事一覧取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyBlogList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyBlogList(out result text, in userKey int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	ub.id,ub.title
	,Date(ub.post_timestamp) AS date
	,uin.user_name AS userName
	,ub.image_1 AS image1
	,ub.image_2 AS image2
	,ub.image_3 AS image3
	,ub.content AS text, 
	'' AS buttons 
-- データ取得元のテーブルを指定する
FROM 
	user_blog AS ub
	,user_inf AS uin 
-- 検索条件を指定する
WHERE 
	ub.user_key=userKey
	-- 合致条件を追加指定する
	AND ub.user_key=uin.id
ORDER BY 
	post_timestamp DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- ギャラリー
#ギャラリー記事取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getGalleryContents` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getGalleryContents(out result text)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
-- データ取得元のテーブルを指定する
FROM 
	user_image AS ui
	,user_inf AS uin 
-- 検索条件を指定する
WHERE 
	ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#マイギャラリー記事取得1
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyGalleryContents1` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyGalleryContents1(out result text)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	ui.id
	,ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
-- データ取得元のテーブルを指定する
FROM 
	user_image AS ui
	,user_inf AS uin 
ORDER BY 
	ui.update_timestamp 
DESC 
LIMIT 300;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#マイギャラリー記事取得2
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getMyGalleryContents2` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getMyGalleryContents2(out result text, in userKey int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	ui.id, ui.photo_title AS myPhotoImage
	,Date(ui.update_timestamp) AS date
	,ui.article_title AS myPhotoTitle
	,uin.user_name AS myPhotoUser
	,ui.photo_summary AS myPhotoComment 
-- データ取得元のテーブルを指定する
FROM 
	user_image AS ui
	,user_inf AS uin 
-- 検索条件を指定する
WHERE 
	ui.user_key=userKey
	-- 合致条件を追加指定する
	AND ui.user_key=uin.id 
ORDER BY 
	ui.update_timestamp DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#マイギャラリー記事作成
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertGalleryContent(in userKey int, photoTitle varchar(200))
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO user_image(user_key, photo_title, update_timestamp) -- 指定した列に対する値を以下に設定する 
VALUES (userKey, photoTitle, NOW());
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;


#マイギャラリー記事更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateGalleryContent(in photoSummary varchar(210), articleTitle varchar(100), articleId int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
 user_image -- 更新対象の列と値を指定する
SET photo_summary = photoSummary, article_title = articleTitle -- 検索条件を指定する
WHERE id = articleId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;


#マイギャラリー記事削除
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `deleteGalleryContent` $$
-- プロシージャの登録を行う
CREATE PROCEDURE deleteGalleryContent(in articleId int)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- データ削除対象のテーブルを指定する
DELETE FROM
	user_image 
-- 検索条件を指定する
WHERE 
	id IN (articleId);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 会員側トップ画面
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- user_inf
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_user_inf` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_user_inf(
	-- ユーザID
	IN in_user_key int(11)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 出力対象の列を指定する
SELECT 
	*
-- データ取得元のテーブルを指定する
FROM 
	user_inf
-- 検索条件を指定する
WHERE
	-- ユーザID
	id = in_user_key;

-- ストアドプロシージャの処理を終える
END $$

-- Message_inf
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_message_inf` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_message_inf(
	-- ユーザID
	IN in_user_key int(11)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 出力対象の列を指定する
SELECT 
	message_title
	,message_content
	,send_date
-- データ取得元のテーブルを指定する
FROM
	message_inf
-- 検索条件を指定する
WHERE
	id IN (
		-- 出力対象の列を指定する
		SELECT
			message_key
		-- データ取得元のテーブルを指定する
		FROM
			message_to
		-- 検索条件を指定する
		WHERE
			-- 引数のユーザID
			user_key = in_user_key
		-- 合致条件を追加指定する
AND
			check_datetime IS NULL
	)
ORDER BY send_date DESC;
-- ストアドプロシージャの処理を終える
END $$

-- 受講可能レッスン
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_booked_lessons` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_booked_lessons(
	-- ユーザID
	IN in_user_key int(11)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM (
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM
	-- 受講情報テーブル
	user_classwork
INNER JOIN
	classwork
-- 以下に指定した列を基に結合を行う
ON
	classwork.id = user_classwork.classwork_key
-- 合致条件を追加指定する
AND
	-- 引数のユーザID
	user_classwork.user_key = in_user_key
INNER JOIN
	lesson_inf
-- 以下に指定した列を基に結合を行う
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
-- 以下に指定した列を基に結合を行う
ON
	school_inf.id = lesson_inf.school_key
INNER JOIN
	time_table_day
-- 以下に指定した列を基に結合を行う
ON
	time_table_day.id = classwork.time_table_day_key
INNER JOIN
	timetable_inf
-- 以下に指定した列を基に結合を行う
ON
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	(
        -- 出力対象の列を指定する
		SELECT
            MAX(students) AS biggest_students
            ,lesson_key
		-- データ取得元のテーブルを指定する
		FROM
            lesson_point_rate
        GROUP BY
            lesson_key	
    ) AS lsp
	-- 以下に指定した列を基に結合を行う
	ON
    	lsp.lesson_key = lesson_inf.id
	-- 合致条件を追加指定する
	AND
		order_students > biggest_students
INNER JOIN
	lesson_point_rate
-- 以下に指定した列を基に結合を行う
ON
	lesson_point_rate.lesson_key = lesson_inf.id
-- 合致条件を追加指定する
AND(
	students <= order_students
OR
	biggest_students IS NOT NULL
)) AS student_class_rec
GROUP BY
    id;

-- ストアドプロシージャの処理を終える
END $$

-- キャンセル料(率)
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_lesson_cancel_rate` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_lesson_cancel_rate(
	IN in_lesson_key INT
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

CREATE TEMPORARY TABLE tmp_lesson_cancel_rate AS 
-- 出力対象の列を指定する
SELECT
	*
-- データ取得元のテーブルを指定する
FROM
	lesson_cancel_rate
-- 検索条件を指定する
WHERE
	lesson_key = in_lesson_key;

-- ストアドプロシージャの処理を終える
END $$

-- 受講可能レッスン
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `p_bookable_lessons` $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_bookable_lessons(
	-- ユーザID
	IN in_user_key int(11)	
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 出力対象の列を指定する
SELECT 
    lesson_name
    ,id AS lesson_key
-- データ取得元のテーブルを指定する
FROM
    lesson_inf
-- 検索条件を指定する
WHERE
    id in(
        -- 出力対象の列を指定する
		SELECT 
            lesson_key
        -- データ取得元のテーブルを指定する
		FROM
            user_lesson
        -- 検索条件を指定する
		WHERE
			-- 引数のユーザID
            user_key = in_user_key
        -- 合致条件を追加指定する
		AND
            rec_status = 0
    )
-- 合致条件を追加指定する
AND
	rec_status = 0;

-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 会員側日ごと授業一覧
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS p_user_classwork_a_day $$
-- プロシージャの登録を行う
CREATE PROCEDURE p_user_classwork_a_day(
	-- 授業の日付
	IN in_date INT
	-- ユーザID
	,IN in_user_key int(11)
)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	time_table_day
INNER JOIN
	classwork
-- 以下に指定した列を基に結合を行う
ON
	time_table_day.id = classwork.time_table_day_key
-- 合致条件を追加指定する
AND
	time_table_day.lesson_date = in_date
LEFT JOIN
	-- 受講情報テーブル
	user_classwork
-- 以下に指定した列を基に結合を行う
ON
	classwork.id = user_classwork.classwork_key
-- 合致条件を追加指定する
AND	
	-- 引数のユーザID
	user_classwork.user_key = in_user_key
INNER JOIN 
	lesson_inf
-- 以下に指定した列を基に結合を行う
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
-- 以下に指定した列を基に結合を行う
ON	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	timetable_inf
-- 以下に指定した列を基に結合を行う
ON
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	user_lesson
-- 以下に指定した列を基に結合を行う
ON
	-- 引数のユーザID
	user_lesson.user_key = in_user_key
-- 合致条件を追加指定する
AND
	user_lesson.lesson_key = lesson_inf.id
LEFT JOIN
	lesson_sub AS ul_lesson_sub
-- 以下に指定した列を基に結合を行う
ON
	ul_lesson_sub.id = user_lesson.level_key
LEFT JOIN
	stage_inf AS ul_stage_inf
-- 以下に指定した列を基に結合を行う
ON
	ul_stage_inf.id = user_lesson.stage_key
LEFT JOIN
	lesson_sub AS uc_lesson_sub
-- 以下に指定した列を基に結合を行う
ON
	uc_lesson_sub.id = user_classwork.level_key
LEFT JOIN
	stage_inf AS uc_stage_inf
-- 以下に指定した列を基に結合を行う
ON
	uc_stage_inf.id = user_classwork.stage_key;

-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

	
#パスワード変更
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateUserPassword` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateUserPassword
	(
	IN newPassword varchar(255)
	,userId int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
	user_inf 
-- 更新対象の列と値を指定する
SET 
	password = newPassword
	-- 現在時刻
	,update_datetime = NOW() 
-- 検索条件を指定する
WHERE 
	id = userId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- ユーザプロフィール取得
#プロフィール取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserProfile` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserProfile
	(
	OUT result text
	,IN userId int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	user_inf 
-- 検索条件を指定する
WHERE 
	id = userId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- ユーザプロフィール変更
#プロフィール更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
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
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
	user_inf 
-- 更新対象の列と値を指定する
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
-- 検索条件を指定する
WHERE 
	id = userId;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 会員一覧
#会員一覧
# ユーザ情報(自分)
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getSelfUserInfo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getSelfUserInfo
	(
	OUT result text
	,IN userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	*
-- データ取得元のテーブルを指定する
FROM
	user_inf
-- 検索条件を指定する
WHERE
	id = userKey
;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# ユーザ情報
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserInfoList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserInfoList
	(
	OUT result text
	,IN sortTarget varchar(30)
	,sortOrder tinyint
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN

IF sortOrder = 0 THEN
	-- 出力対象の列を指定する
	SELECT 
		*
	-- データ取得元のテーブルを指定する
	FROM
		user_inf
	ORDER BY 
		sortTarget ASC
	;
ELSE
	-- 出力対象の列を指定する
	SELECT 
		*
	-- データ取得元のテーブルを指定する
	FROM
		user_inf
	ORDER BY 
		sortTarget DESC
	;
END IF; -- 分岐終了

-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# テーマ指定用リスト作成
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getListForChooseThemes` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getListForChooseThemes
	(
	OUT result text
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT
    id AS lesson_key
    ,lesson_name
-- データ取得元のテーブルを指定する
FROM
    lesson_inf
-- 検索条件を指定する
WHERE
    rec_status = 0
-- 合致条件を追加指定する
AND
    school_key = 1
;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 会員トップ画面のお知らせ
#お知らせ取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getUserMessage` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getUserMessage
	(
	OUT result text
	,IN userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT
	message_title
	,message_content
	,send_date 
-- データ取得元のテーブルを指定する
FROM 
	message_inf 
-- 検索条件を指定する
WHERE 
	id IN 
	(
	-- 出力対象の列を指定する
	SELECT 
		message_key 
	-- データ取得元のテーブルを指定する
	FROM 
		message_to 
	-- 検索条件を指定する
	WHERE 
		user_key = userKey
		-- 合致条件を追加指定する 
		AND check_datetime IS NULL
	) 
	ORDER BY 
		send_date DESC
		,id DESC;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#お知らせ登録1
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertMessageInfo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertMessageInfo
	(
	IN messageTitle varchar(100)
	,messageContent text
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
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
		-- 現在時刻
		,NOW()
		-- 現在時刻
		,NOW()
	);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#お知らせ登録2
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `insertMessageTo` $$
-- プロシージャの登録を行う
CREATE PROCEDURE insertMessageTo
	(
		IN userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
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
		(-- 出力対象の列を指定する
		SELECT 
			id 
		-- データ取得元のテーブルを指定する
		FROM 
			message_inf 
		ORDER BY 
			create_datetime DESC 
		LIMIT 1
		)
		,userKey
		,NOW() -- 現在時刻
		,NOW() -- 現在時刻
	);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;
	
-- 受講承認
#受講承認
#受講承認対象の一覧取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getLecturePermit` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getLecturePermit
	(
		OUT result text
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	time_table_day 
INNER JOIN 
	classwork 
-- 以下に指定した列を基に結合を行う
ON 
	time_table_day.id = classwork.time_table_day_key 
-- 合致条件を追加指定する
AND 
	time_table_day.lesson_date = SUBSTRING(NOW(), 1, 10) 
INNER JOIN 
	user_classwork -- 受講情報テーブル 
-- 以下に指定した列を基に結合を行う
ON
	classwork.id = user_classwork.classwork_key 
INNER 
	JOIN user_inf 
-- 以下に指定した列を基に結合を行う
ON 
	user_inf.id = user_classwork.user_key 
INNER JOIN  
	lesson_inf 
-- 以下に指定した列を基に結合を行う
ON 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	timetable_inf 
-- 以下に指定した列を基に結合を行う
ON 
	timetable_inf.id = time_table_day.timetable_key 
-- 合致条件を追加指定する
AND
	user_classwork.user_work_status = 2
;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#ポイントレート算出
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getPointRate` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getPointRate
	(
		OUT result text
		,IN lessonKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT
    point_rate
    ,students
-- データ取得元のテーブルを指定する
FROM
    lesson_point_rate
-- 検索条件を指定する
WHERE
    lesson_point_rate.lesson_key = lessonKey
;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# 備品名リスト用クエリ
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getCommodityNameList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getCommodityNameList(out result text)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
SELECT 
	commodity_name
	,selling_price
	,id AS commodity_key 
-- データ取得元のテーブルを指定する
FROM 
	commodity_inf;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#受講承認更新
#受講情報の更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
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
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 以下に指定したテーブルのレコードを更新する
UPDATE
	-- 受講情報テーブル
	user_classwork
-- 更新対象の列と値を指定する
SET
	user_classwork_cost = userClassworkCost
	,use_point = getPoint
    ,get_point = classworkUsePoint
	,late_time = lateTime
	-- 現在時刻
	,update_datetime = NOW()
	-- 現在時刻
	,receipt_datetime = NOW()
	,user_work_status = 3
	,pay_price = payPrice
-- 検索条件を指定する
WHERE
	id = userClassworkKey;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ; 

#獲得ポイント更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitGetPoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitGetPoint
	(
		IN getPoint int
		,userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
	user_inf
	-- 更新対象の列と値を指定する
SET
	get_point = get_point + getPoint
	-- 現在時刻
	,update_datetime = NOW()
	-- 検索条件を指定する
WHERE
	id = userKey
	;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#使用ポイント更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitUsePoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitUsePoint
	(
		IN usePoint int
		,userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE	
		user_inf
-- 更新対象の列と値を指定する
SET
	 get_point = get_point - usePoint
	,use_point = use_point + usePoint
	-- 現在時刻
	,update_datetime = NOW()
-- 検索条件を指定する
WHERE
		id = userKey
	;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# ポイントの更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitPoints` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitPoints
	(
		IN getPoint int 
		,usePoint int 
		,userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
#備品購入情報を追加する
-- 指定したテーブルにレコードを追加する
-- 以下に列挙した列の値を指定してテーブルにレコードを追加する
INSERT INTO
	#獲得ポイントがあれば
	IF getPoint <> 0 THEN
		#ユーザの獲得ポイントを更新する
		CALL updateLecturePermitGetPoint(getPoint, userKey);
	-- 分岐終了
	END IF;

	#使用ポイントがあれば
	IF commodityUsePoint <> 0 THEN
		#ユーザの使用ポイントを更新する
		CALL updateLecturePermitUsePoint(usePoint, userKey);
	-- 分岐終了
	END IF;
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# 備品代情報の更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
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
-- 以降にストアドプロシージャの処理を記述する
BEGIN
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
		-- 現在時刻
		,NOW()
		-- 現在時刻
		,NOW()
	);

	#ポイントを反映する
	CALL updateLecturePermitPoints(getPoint, commodityUsePoint, userKey);	
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

-- 受講承認一覧

#受講承認一覧
#受講承認一覧のデータ取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getLecturePermitInfoList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getLecturePermitInfoList
	(
		OUT result text
		,IN fromDate date
		,toDate date
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	user_classwork -- 受講情報テーブル 
INNER JOIN 
	classwork 
-- 以下に指定した列を基に結合を行う
ON 
	classwork.id = user_classwork.classwork_key 
INNER JOIN 
	time_table_day 
-- 以下に指定した列を基に結合を行う
ON 
	time_table_day.id = classwork.time_table_day_key
	-- 合致条件を追加指定する 
	AND　time_table_day.lesson_date <= toDate
	-- 合致条件を追加指定する 
	AND time_table_day.lesson_date >= fromDate
INNER JOIN 
	user_inf
-- 以下に指定した列を基に結合を行う
ON 
	user_inf.id = user_classwork.user_key 
INNER JOIN
	lesson_inf
-- 以下に指定した列を基に結合を行う
ON 
	lesson_inf.id = classwork.lesson_key 
INNER JOIN 
	stage_inf
-- 以下に指定した列を基に結合を行う
ON 
	stage_inf.id = user_classwork.stage_key 
INNER JOIN 
	lesson_sub
-- 以下に指定した列を基に結合を行う
ON 
	lesson_sub.id = user_classwork.level_key 
ORDER BY 
	time_table_day.lesson_date DESC
) 
UNION ALL
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM 
	commodity_sell 
INNER JOIN 
	user_inf 
-- 以下に指定した列を基に結合を行う
ON 
	user_inf.id = commodity_sell.user_key 
	-- 合致条件を追加指定する 
	AND sell_datetime <= toDate
	-- 合致条件を追加指定する 
	AND sell_datetime >= fromDate
INNER JOIN 
	commodity_inf  
-- 以下に指定した列を基に結合を行う
ON 
	commodity_inf.id = commodity_sell.commodity_key 
ORDER BY 
	sell_datetime DESC
);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

#使用ポイントの更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitListPoint` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitListPoint
	(
		IN diffPoint int
		,userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
	user_inf 
-- 更新対象の列と値を指定する
SET 
	use_point = use_point + diffPoint
	,get_point = get_point - diffPoint
-- 検索条件を指定する
WHERE 
	id = userKey;	
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# 受講情報の場合の更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `updateLecturePermitListClasswork` $$
-- プロシージャの登録を行う
CREATE PROCEDURE updateLecturePermitListClasswork
	(
		IN userClassworkCost int
		,usePoint int
		,classworkId int
		,diffPoint int
		,userKey int
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
#授業データの更新
-- 以下に指定したテーブルのレコードを更新する
UPDATE
	-- 受講情報テーブル
	user_classwork
-- 更新対象の列と値を指定する
SET
	user_classwork_cost = userClassworkCost
	, use_point = usePoint
	-- 更新時間を更新する
    ,update_datetime = NOW()
-- 検索条件を指定する
WHERE
	id = classworkId
;
CALL updateLecturePermitListPoint(diffPoint, userKey);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

# 備品代の時の更新
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
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
-- 以降にストアドプロシージャの処理を記述する
BEGIN
UPDATE
	commodity_sell
-- 更新対象の列と値を指定する
SET
	pay_cash = userClassworkCost
	,commodity_key=commodityContent
	,use_point = usePoint
	-- 現在時刻
    ,update_datetime = NOW()
-- 検索条件を指定する
WHERE
	id = commoditySellKey
;
CALL updateLecturePermitListPoint(@result, diffPoint, userKey);
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;


-- 日ごと予約者一覧画面
#日ごと予約者一覧取得
-- コード記述のため区切り文字を一時的に変更する
DELIMITER $$
-- 当該プロシージャが既に登録されていた場合、登録し直すため一旦削除する
DROP PROCEDURE IF EXISTS `getEachDayLessonList` $$
-- プロシージャの登録を行う
CREATE PROCEDURE getEachDayLessonList
	(
		OUT result text
		,IN date date
	)
-- 以降にストアドプロシージャの処理を記述する
BEGIN
-- 出力対象の列を指定する
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
-- データ取得元のテーブルを指定する
FROM
	time_table_day
INNER JOIN
	classwork
-- 以下に指定した列を基に結合を行う
ON
	time_table_day.id = classwork.time_table_day_key
-- 合致条件を追加指定する
AND
	time_table_day.lesson_date = date
INNER JOIN
	-- 受講情報テーブル
	user_classwork
-- 以下に指定した列を基に結合を行う
ON
	classwork.id = user_classwork.classwork_key
INNER JOIN
	user_inf
-- 以下に指定した列を基に結合を行う
ON
	user_inf.id = user_classwork.user_key
INNER JOIN 
	lesson_inf
-- 以下に指定した列を基に結合を行う
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	timetable_inf
-- 以下に指定した列を基に結合を行う
ON
	timetable_inf.id = time_table_day.timetable_key
INNER JOIN
	stage_inf
-- 以下に指定した列を基に結合を行う
ON
	stage_inf.id = user_classwork.stage_key
INNER JOIN
	lesson_sub
-- 以下に指定した列を基に結合を行う
ON
	lesson_sub.id = user_classwork.level_key
;	
-- ストアドプロシージャの処理を終える
END $$
-- 区切り文字をセミコロンに戻す
delimiter ;

