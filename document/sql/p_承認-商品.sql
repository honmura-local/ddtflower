DELIMITER $$
DROP PROCEDURE IF EXISTS p_update_approval_purchase $$
CREATE PROCEDURE p_update_approval_purchase (
    IN in_id INT
    ,IN in_sell_number INT
    ,IN in_pay_cash INT
    ,IN in_use_point INT
    ,IN in_commodity_key INT
    ,IN in_purchase_status INT
    ,OUT result INT
)
BEGIN

DECLARE latest_timestamp int;
DECLARE updated_timestamp int;
DECLARE latest_timestamp_user VARCHAR(25);
DECLARE updated_timestamp_user VARCHAR(25);

SELECT 
    MAX(update_datetime)
FROM
    commodity_sell
INTO
    latest_timestamp;

START TRANSACTION;

IF in_commodity_key < 0 THEN
    UPDATE
        commodity_sell
    SET
        sell_number = in_sell_number
        ,pay_cash = in_pay_cash
        ,use_point = in_use_point
        ,commodity_key = NULL
        ,purchase_status = in_purchase_status
        ,update_datetime = NOW()
    WHERE
        id = in_id;
ELSE
    SET
        sell_number = in_sell_number
        ,pay_cash = in_pay_cash
        ,use_point = in_use_point
        ,commodity_key = in_commodity_key
        ,purchase_status = in_purchase_status
        ,update_datetime = NOW()
    WHERE
        id = in_id;
END IF;

SELECT 
    MAX(update_datetime)
FROM
    commodity_sell
INTO
    updated_timestamp;

IF latest_timestamp < updated_timestamp THEN
    IF in_purchase_status > 0 THEN
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
        SELECT 1 INTO result;
        COMMIT;
    END IF;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$

DROP PROCEDURE IF EXISTS p_insert_approval_purchase $$
CREATE PROCEDURE p_insert_approval_purchase (
    IN in_sell_number INT
    ,IN in_pay_cash INT
    ,IN in_use_point INT
    ,IN in_commodity_key INT
    ,IN in_user_key INT
    ,IN in_purchase_status INT
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

IF in_commodity_key < 0 THEN
    INSERT INTO
        commodity_sell (
            commodity_key
            ,school_key
            ,user_key
            ,purchase_status
            ,content
            ,sell_datetime
            ,sell_number
            ,pay_cash
            ,use_point
            ,create_datetime
            ,update_datetime
        )
    VALUES (
        NULL
        ,1
        ,in_user_key
        ,in_purchase_status
        ,''
        ,NOW()
        ,in_sell_number
        ,in_pay_cash
        ,in_use_point
        ,NOW()
        ,NOW()
    );
ELSE
    INSERT INTO
        commodity_sell (
            commodity_key
            ,school_key
            ,user_key
            ,purchase_status
            ,content
            ,sell_datetime
            ,sell_number
            ,pay_cash
            ,use_point
            ,create_datetime
            ,update_datetime
        )
    VALUES (
        in_commodity_key
        ,1
        ,in_user_key
        ,in_purchase_status
        ,''
        ,NOW()
        ,in_sell_number
        ,in_pay_cash
        ,in_use_point
        ,NOW()
        ,NOW()
    );
END IF;

SELECT
    COUNT(id)
FROM
    commodity_sell
INTO
    new_count;

IF old_count < new_count THEN
    IF in_purchase_status > 0 THEN
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
        SELECT 1 INTO result;
        COMMIT;
    END IF;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$

DROP PROCEDURE IF EXISTS p_delete_approval_purchase $$
CREATE PROCEDURE p_delete_approval_purchase (
    IN in_id INT
	,OUT result INT
)
BEGIN
	
DECLARE old_count int;
DECLARE new_count int;

SELECT 
    COUNT(id)
FROM
    commodity_sell
INTO
    old_count;

START TRANSACTION;

DELETE
FROM
    commodity_sell
WHERE
    id = in_id;

SELECT
    COUNT(id)
FROM
    commodity_sell
INTO
    new_count;

IF old_count > new_count THEN
    SELECT 1 INTO result;
    COMMIT;
ELSE
    SELECT 0 INTO result;
    ROLLBACK;
END IF;

END$$

DELIMITER ;