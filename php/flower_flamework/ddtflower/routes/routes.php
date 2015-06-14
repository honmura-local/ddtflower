<?php
use controller;

class routes {
	const PARAM_ACTION = 'A';
	const PARAM_METHOD = 'M';
	const CONTROLLER_KEY = 'controller';
	const METHOD_KEY = 'methods';

	protected $routes = array(
			'login' => array(
					'controller' => 'loginContlorrer',
					'methods' => array(
							'executeLogin' => 'executeLogin',
					),
			),
	);
	
	public function route() {
		$request = $_GET;
		if($_SERVER["REQUEST_METHOD"] == "POST"){
			$request = $_POST;
		}
		
		if(!array_key_exists(self::PARAM_ACTION,$request) || !array_key_exists(self::PARAM_METHOD,$request)) {
			show404();
		}
		
		$action = $request[self::PARAM_ACTION];
		$method = $request[self::PsARAM_METHOD];
		
		$this->entry($action, $method);
	}
	
	protected function entry($action, $method) {
		if(!array_key_exists($action, $this->routes)) {
			$this->show404();
		}
		if(!array_key_exists($method, $this->routes[$action][self::METHOD_KEY])) {
			$this->show404();
		}
		
		$controllerName = $this->routes[$action][self::CONTROLLER_KEY];
		$methodName = $this->routes[$action][self::METHOD_KEY][$method];
		
		call_user_func('controller\'.$controllerName'.'::'.$methodName);
		exit;
	}
	
	protected function show404() {
		header("HTTP/1.1 404 Not Found");
		// @TODO langとか作って定数化すべし
		echo "お探しのページは存在しません。";
		exit;
	}
}