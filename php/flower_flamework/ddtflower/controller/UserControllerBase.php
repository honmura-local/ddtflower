<?php
namespace controller;

use session\SessionNotExistsException;
use session\SessinHandlerFactory;

Abstract Class USerControllerBase extends ControllerAbstract {
	
	static protected function getSession() {
		return SessinHandlerFactory::createUserHandler();
	}
	
	static protected function getSessionThenRedirect() {
		try {
			return self::getSession();
		} catch(SessionNotExistsException $e) {
			error_log($e->getTraceAsString());
			noSessionRedirect();
		}
	}
	
	static protected function noSessionRedirect() {
		header('Location: '.BASE_URL.'index.php?A=login&M=executeLogin');
		exit;
	}
}