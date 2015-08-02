CREATE TABLE 
	user_blog (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_key INT NOT NULL,
		title VARCHAR(200) NOT NULL DEFAULT '',
		content TEXT,
		post_timestamp TIMESTAMP(8)
	)
	TYPE=innodb;

	--画像カラムその1,2,3追加しています。
	
	--記事取得
	SELECT --SELECT命令
		ub.id, --ID
		ub.image_1 AS image1, --画像その1
		ub.image_2 AS image2, --画像その2
		ub.image_3 AS image3, --画像その3
		ub.title, --記事タイトル
		ub.post_timestamp AS date, --投稿日
		uin.user_name AS userName, --ユーザ名
		ub.content AS text --本文
	FROM --データ取得テーブル指定
		user_blog AS ub, --ブログテーブル
		user_inf AS uin --ユーザ情報テーブル
	WHERE  --行取得条件指定
		ub.user_key='user_key' --指定したユーザID
	AND --かつ
		ub.user_key=uin.id --ユーザIDが同じ行同士を繋ぐ
	ORDER BY --ソート指定
		post_timestamp DESC --日付降順
	;
		
	
	--記事(交差エンティティ利用失敗につき使わず)
	SELECT
		ub.id,
		ub.title,
		ub.post_timestamp AS date,
		uin.user_name AS userName,
		ub.content AS text,
		ui.photo_title AS image
	FROM 
		user_blog AS ub,
		user_inf AS uin
	LEFT OUTER JOIN
		blog_article_image AS bai
	ON
		ub.id=bai.blog_article_id
	LEFT OUTER JOIN
		user_image AS ui
	ON
		ui.id=bai.image_id
	WHERE 
		ub.user_key='117'
	AND
		ub.user_key=uin.id
	ORDER BY 
		post_timestamp DESC;
	