<?php
namespace database;

class Connector {
	
	/**
	 * コネクション接続情報を受け取り、PDOオブジェクトを返す
	 * @param ConnectionAbstract $connection 生成対象のコネクション情報クラス
	 * @throws DbConnectFailException
	 * @return PDO DB接続(PDOオブジェクト)
	 */
	static public function getConnection(ConnectionAbstract $connection) {
		$pdo = null;
		try {
			$pdo = new PDO(
					$this->buildConnectionStr($connection)
					,$connection->getUser()
					,$connection->getPassword()
					,array(PDO::ATTR_EMULATE_PREPARES => false
			));
		} catch (PDOException $e){
			$message = $this->buildConnectFailMessage($connection, $e);
			error_log($message);
			throw new DbConnectFailException($message, $e->getCode() ,$e);
		}
		return $pdo;
	} 
	
	/**
	 * @param ConnectionAbstract $connection
	 * @param PDOException $e
	 */
	protected function buildConnectFailMessage(ConnectionAbstract $connection, PDOException $e) {
		return $connection->getHost().'/'.$connection->getDatabase().
		'への接続に失敗しました。';
	}
	
	/**
	 * @param ConnectionAbstract $connection
	 * @return string
	 */
	protected function buildConnectionStr(ConnectionAbstract $connection) {
		return $connection->getRdb().':host='.
				$connection->getHost().';dbname='.
				$connection->getDatabase().';charset=utf8';
	}
}