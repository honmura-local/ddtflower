DELIMITER $$
DROP PROCEDURE IF EXISTS p_update_capacity_classwork $$
CREATE PROCEDURE p_update_capacity_classwork (
    IN in_id INT
    ,IN in_min_sutudents INT
    ,IN in_max_students INT
    ,OUT result INT
)
BEGIN

DECLARE updated_old DATETIME;
DECLARE updated DATETIME;

SELECT 
    MAX(update_datetime)
FROM
    classwork
INTO
    updated_old;

START TRANSACTION;

UPDATE
    classwork
SET
    min_students = in_min_sutudents
	,max_students = in_max_students
	,update_datetime = NOW()
WHERE
    id = in_id;

SELECT 
    MAX(update_datetime)
FROM
    classwork
INTO
    updated;

IF updated > updated_old THEN
    SELECT 1 INTO result;
    COMMIT;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$

DROP PROCEDURE IF EXISTS p_update_capacity_time_table_day $$
CREATE PROCEDURE p_update_capacity_time_table_day (
    IN in_id INT
    ,IN in_min_sutudents INT
    ,IN in_max_students INT
    ,OUT result INT
)
BEGIN

DECLARE updated_old DATETIME;
DECLARE updated DATETIME;

SELECT 
    MAX(update_datetime)
FROM
    time_table_day
INTO
    updated_old;

START TRANSACTION;

UPDATE
    time_table_day
SET
    min_num = in_min_sutudents
	,max_num = in_max_students
	,update_datetime = NOW()
WHERE
    id = in_id;

SELECT 
    MAX(update_datetime)
FROM
    time_table_day
INTO
    updated;

IF updated > updated_old THEN
    SELECT 1 INTO result;
    COMMIT;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$

DELIMITER ;
        