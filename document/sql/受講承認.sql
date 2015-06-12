SELECT
	time_table_day.id AS time_table_key
	,time_table_day.lesson_date AS lesson_date
	,start_time
	,end_time
	,lesson_name
	,user_name
	,user_classwork.stage_no AS stage_no
	,user_classwork.level_no AS level_no
	,user_classwork_cost
	,user_inf.get_point AS get_point
FROM
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = '{{date}}'
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
	timetable_inf.id = time_table_day.timetable_key;