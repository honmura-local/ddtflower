DELIMITER $$
DROP PROCEDURE IF EXISTS p_update_approval_purchase $$
CREATE PROCEDURE p_update_approval_purchase (
	IN in_sell_number INT
    ,IN in_pay_cash INT
    ,IN in_use_point INT
    ,IN in_commodity_key INT
	,IN in_user_key INT
    ,OUT result INT
)
BEGIN

DECLARE old_count int;
DECLARE new_count int;
DECLARE latest_timestamp_user VARCHAR(25);
DECLARE updated_timestamp_user VARCHAR(25);

SELECT 
    COUNT(id)
FROM
    commodity_sell
INTO
    old_count;

START TRANSACTION;

INSERT INTO
	commodity_sell(
		sell_datetime
		,sell_number
		,pay_cash
		,use_point
        ,get_point
		,content
		,user_key
		,school_key
		,commodity_key
		,create_datetime
		,update_datetime
	)
	VALUES (
		 NOW()
		,in_sell_number
		,in_pay_cash
		,in_use_point
        ,0
		,""
		,in_user_key
		,1
		,in_commodity_key
		,NOW()
		,NOW()
	);

SELECT
    COUNT(id)
FROM
    commodity_sell
INTO
    new_count;

IF old_count < new_count THEN
    SELECT
        MAX(update_datetime)
    FROM
        user_inf
    INTO
        latest_timestamp_user;

    UPDATE
        user_inf
    SET
        use_point = use_point + in_use_point
        ,get_point = get_point - in_use_point
        ,update_datetime = NOW()
    WHERE
        id = in_user_key;

    SELECT
        MAX(update_datetime)
    FROM
        user_inf
    INTO
        updated_timestamp_user;

    IF latest_timestamp_user < updated_timestamp_user THEN
        SELECT 1 INTO result;
        COMMIT;
    ELSE
        SELECT 0 INTO result;
        ROLLBACK;
    END IF;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$
DELIMITER ;