<?php
require_once "ModelMail.php";
require_once "mailSendFailException.php";

$from = $_POST['from'];
$subject = $_POST['subject'];
$content = $_POST['content'];
$type = $_POST['type'];

try {
	$sendResult = ModelMail::sendSuggestion($type['value'], $from['value'], $subject['value'], $content['value']);
} catch(SendFailException $e) {
	// ajax的に500返して異常を伝える。
	error_log(e.getMessage());
	header('HTTP/1.1 500 Internal Server Error');
	echo e.getMessage();
	exit;
}
$jsonResult = json_encode(array(
		'sendCount'			=> $sendResult[0],
		'failCount'			=> $sendResult[1],
		'noAddressCount'	=> $sendResult[2],
));

header('Content-type: application/json');
echo $jsonResult;
exit;
