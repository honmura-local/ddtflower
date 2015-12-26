REATE TABLE 
	user_blog (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_key INT NOT NULL,
		title VARCHAR(200) NOT NULL DEFAULT '',
		content TEXT,
		post_timestamp TIMESTAMP(8)
	)
	TYPE=innodb;

/* 画像列追加 */
ALTER TABLE 
	`user_blog` 
ADD 
	`image_1` VARCHAR(255) NOT NULL COMMENT '投稿画像その1' , 
ADD 
	`image_2` VARCHAR(255) NOT NULL COMMENT '投稿画像その2' , 
ADD 
	`image_3` VARCHAR(255) NOT NULL COMMENT '投稿画像その3' 
;

/* 公開設定追加 */
ALTER TABLE `user_blog` ADD `disclosure_range` TINYINT NOT NULL DEFAULT '0' COMMENT '公開範囲。0:全体 1:非公開' AFTER `post_timestamp`;

