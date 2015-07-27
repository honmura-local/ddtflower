#-----------------------------------------------------
# リスト出力
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
FROM 
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = '{{日付}}'
INNER JOIN 
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key
INNER JOIN
    school_inf 
ON
    school_inf.id = lesson_inf.school_key
#-------------------------------------------

#-------------------------------------------
# 新規登録
INSERT INTO
	classwork(
		max_students
		,min_students
		,classwork_status
		,classroom
		,classwork_note
		,teacher_key
        ,school_key
        ,lesson_key
        ,time_table_day_key
		,create_datetime
		,update_datetime
	)
	VALUES(
		{{max_students}}
		,{{min_students}}
		,{{classwork_status}}
		,'{{classroom}}'
		,'{{classwork_note}}'
		,(select id from user_inf where authority = 10 limit 1)
        ,{{school_key}}
        ,{{lesson_key}}
        ,{{time_table_day_key}}
		,NOW()
		,NOW()
	)

#-------------------------------------------
# 更新
UPDATE
	classwork
SET
	max_students = {{max_students}}
	,min_students = {{min_students}}
	,classwork_status = '{{classwork_status}}'
	,classroom = '{{classroom}}'
	,classwork_note = '{{classwork_note}}'
	,update_datetime = NOW()
WHERE
	id = {{classwork_key}}