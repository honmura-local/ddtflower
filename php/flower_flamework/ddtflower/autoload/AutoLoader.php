<?php
class ClassLoader {

	private $dirs = array();

	public function __construct() {
		spl_autoload_register(array($this, 'loader'));
	}

	public function registerDir($dir){
		$this->dirs[] = $dir;
	}

	public function loader($classname){

		foreach ($this->dirs as $dir) {

			$file = $dir . '/' .  $classname . '.php';
			if(is_readable($file)){
				require $file;
				return;
			}
		}
	}
}