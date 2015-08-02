CREATE TABLE 
	user_blog (
		id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user_key INT NOT NULL,
		title VARCHAR(200) NOT NULL DEFAULT '',
		content TEXT,
		post_timestamp TIMESTAMP(8)
	)
	TYPE=innodb;