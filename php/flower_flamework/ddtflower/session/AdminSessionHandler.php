<?php
namespace session;

class AdminSessionHandler implements \ISessionHandler {
	
	const ADMIN_SESSION_KEY = '__admin__session__';
	
	public function get() {
		return SessionAsJson::get(ADMIN_SESSION_KEY);
	}
	
	public function set($value) {
		SessionAsJson::set(ADMIN_SESSION_KEY, $value);
	} 
}