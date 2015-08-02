<?php
require_once "ModelMail.php";

$from = $_POST['from'];
$subject = $_POST['subject'];
$content = $_POST['content'];

$ADMIN_ID = '1';
$sendResult = ModelMail::send_mail(array($ADMIN_ID), $subject['value'], $content['value'], $from['value']);
$jsonResult = json_encode(array(
		'sendCount'			=> $sendResult[0],
		'failCount'			=> $sendResult[1],
		'noAddressCount'	=> $sendResult[2],
));

header('Content-type: application/json');
echo $jsonResult;
exit;