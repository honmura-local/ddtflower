<?php
namespace controller;

use session\SessionNotExistsException;

class LoginController extends USerControllerBase {

	const LOGIN_ID_KEY = 'loinID';
	const PASSWORD_KEY = 'password';

	static public function executeLogin() {
		try {
			$this->validate();
		}
		catch (ValidateFailException $e) {
			showView(array('errMessage', $e->getMessage()));
		}
		$loginID = $_POST[LOGIN_ID_KEY];
		$password = $_POST[PASSWORD_KEY];
		
		
	}
	
	protected function validate() {
		if(!array_key_exists(LOGIN_ID_KEY,$_GET)) {
			throw new ValidateFailException('ログインIDを指定してください');
		}
		if(!array_key_exists(LOGIN_ID_KEY,$_GET)) {
			throw new ValidateFailException('パスワードを指定してください');
		}
	}
	
	protected function showView($data=array()) {
		print(file_get_contents(''));
		exit;
	}
}