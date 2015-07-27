INSERT INTO 
	suggestion_box(
		suggest_title
		,suggest_content
		,send_datetime
		,suggest_type
	)
	VALUES (
		{{suggest_title}}
		,{{suggest_content}}
		,{{send_datetime}}
		,{{suggest_type}}
	)

# suggest_type のコードと日本語の対応
# 0:意見・要望
# 1:問い合わせ
# 2:クレーム