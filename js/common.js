/** ファイル名:common.js
 * 概要　　　:汎用関数クラス定義のファイル
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:js/common.js
 */

/** クラス名:common
 * 概要　:汎用関数クラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */
function common(){

//以下、授業一覧テーブル作成用のデータ
//授業状況
this.classworkStatuses = {
		0:"予約可能"
		,1:"開催済み"
		,2:"中止"
		,3:"中止"
		,4:"予約不可"
		,5:"予約締切"
		,6:"満席"
};

//授業情報補足

//ユーザ授業状況
this.userClassworkStatuses = {
		0:"予約済み"
		,1:"予約済み"
		,2:"受付"
		,3:"受講済み"
		,10:"キャンセル(本人)"
		,11:"キャンセル(管理者)"
		,12:"中止"
};

//授業残席
this.restMarks = {
	0:"✕"
	,1:"△"
	,4:"◯"
	,7:"◎"
};

//費用関連の列名
this.classworkCostColumns = [
	'user_classwork_cost'
	,'user_classwork_cost_aj'
	,'flower_cost'
	,'flower_cost_aj'
	,'extension_cost'
];

//デフォルト料金関連の列名
this.defaultClassworkCostColumns = [
	'default_user_classwork_cost'
	,'default_flower_cost'
];

//以上、授業一覧テーブル作成用のデータ

	/* 
	 * 関数名:getTotalStudentsOfTimeTable
	 * 概要  :時間割ごとの生徒の合計人数を求める
	 * 引数  :rowData:テーブルのデータ配列
	 * 返却値:時間ごとの合計人数が入った連想配列
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.23
	 * 変更者:T.Masuda
	 * 変更日:2015.10.11
	 * 内容　:カウンター変数を削りました。$.eachのコールバック関数の引数を代わりに使うようにしました。
	 */
	 this.getTotalStudentsOfTimeTable = function(rowData) {
		//時限の値を変数に入れる
		var lessonTime = rowData[0][COLUMN_NAME_START_TIME];
		//生徒の数を連想配列に入れる
		var students = {};
		//生徒の数を0で初期化する
		students[lessonTime] = 0;

		//取り出した行の数だけループする
		$.each(rowData, function(i) {
			// 時限が同じときは合計の変数に足す
			if(lessonTime === rowData[i][COLUMN_NAME_START_TIME]) {
				// 合計の変数に値を足す
				students[lessonTime] += Number(rowData[i][COLUMN_NAME_ORDER_STUDENTS]);
			// 違う時限になった時の処理
			} else {
				// 時限の値を変数に入れる
				lessonTime = rowData[i][COLUMN_NAME_START_TIME];
				//生徒の数を0で初期化する
				students[lessonTime] = 0;
			}
		});
		
		// 生徒の合計人数を返す
		return students;
	};

	/**
	 * 授業が中止かどうか判定する
	 * @param string 授業ステータス
	 * @return bool 中止かどうか
	 */ 
	/* 
	 * 関数名:isCanceled
	 * 概要  :授業が中止かどうか判定する
	 * 引数  :String classworkStatus 授業ステータスの文字列
	 * 返却値:boolean 中止か否かの判定
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 */
	this.isCanceled = function(classworkStatus) {
		var retBoo = false;	//返却用変数を用意する
		
		// 授業が中止するかどうかを見るための配列を作る
		var classworkCancelStatus = new Array(3,2);
		// 授業ステータスがキャンセルならtrueを返す
		 if($.inArray(classworkStatus, classworkCancelStatus) >= 0) {
			 retBoo = true;	//trueを返すようにする
		}
		 
		return retBoo;	//判定を返す
	}

	/**
	 * 授業が開催済かどうか判定する
	 * @param string 授業ステータス
	 * @return bool 開催済かどうか
	 */ 
	/* 
	 * 関数名:hasDone
	 * 概要  :授業が開催済かどうか判定する
	 * 引数  :String classworkStatus 授業ステータスの文字列
	 * 返却値:boolean 中止か否かの判定
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnの書き方を変えました
	 */
	this.hasDone = function(classworkStatus) {
		var retBoo = false;	//返却用変数を用意する
		
		// 授業が開催済みであればtrueを返す
		if(classworkStatus == 1) {
			 retBoo = true;		//trueを返すようにする
		}
		
		return retBoo;	//判定を返す
	}

	/**
	 * 連想配列に引数のキーがあるかどうか確認する
	 * なかったら例外を吐く
	 * @param mixed rowdata 授業情報を格納した連想配列
	 * @param string target ターゲットのkey
	 */ 
	/* 
	 * 関数名:isExist
	 * 概要  :連想配列に引数のキーがあるかどうか確認する。なかったら例外を吐く
	 * 引数  :Object rowData:行データの連想配列(用途自体は行データに限定しない)
	 * 　　  :String target:確認対象のキー
	 * 返却値:なし
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:コメントを追記しました
	 */
	this.isExist = function(rowData, target) {
		// 連想配列にtargetのkeyがなければ
		if(!target in rowData) {
			//例外を投げる
			throw new Error("can't select status. no " + target);
		}
	}

	/**
	 * 授業コマの残席を算出する
	 * @param mixed rowdata 授業情報を(1時間割分全部)格納した連想配列
	 * @param int timeTableStudents 時間割全体の予約人数
	 * @return int 残席数
	 */ 
	/* 
	 * 関数名:getRestOfSheets
	 * 概要  :授業コマの残席を算出する
	 * 引数  :Object rowData:行データの連想配列
	 * 　　  :Object timeTableStudents:時間帯あたりの予約人数をまとめたオブジェクト
	 * 返却値:なし
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnを1つにまとめました
	 */
	this.getRestOfSheets = function(rowData, timeTableStudents) {
		var retCount = 0;	//返却値用変数を用意する
		
		// 指定の時間割の数を取り出す
		var targetTimeSchedule = rowData[COLUMN_NAME_START_TIME];
		// max_num列がなければ例外処理をする
		this.isExist(rowData, COLUMN_NAME_MAX_NUM);
		// 最大人数を変数に入れる
		var maxNum = rowData[COLUMN_NAME_MAX_NUM];	//最大人数(時間割)
		// max_students列がなければ例外処理をする
		this.isExist(rowData, COLUMN_NAME_MAX_STUDENTS);
		// 授業コマの最大人数
		var maxStudents = rowData[COLUMN_NAME_MAX_STUDENTS];	//最大人数(授業コマ)
		// students列がなければ例外処理をする
		this.isExist(rowData, COLUMN_NAME_ORDER_STUDENTS);
		// 現在の予約人数を変数に入れる
		var students = rowData[COLUMN_NAME_ORDER_STUDENTS];	// 現予約人数
		// 時間割としての残りの人数
		var timeTableRest = maxNum - timeTableStudents[targetTimeSchedule];	// 時間割としての残り
		retCount = maxStudents - students;	// 授業コマとしての残り

		// 時間割としてのが授業コマとしての数以下であるなら
		if(timeTableRest <= retCount) {
			retCount = timeTableRest;	//時間割基準の人数を返すようにする
		}
		
		return retCount;	//算出した結果を返す
	}

	/**
	 * 満席かどうか判定する
	 * @param mixed rowdata 授業情報を格納した連想配列
	 * @return bool 満席かどうか
	 */ 
	/* 
	 * 関数名:isFull
	 * 概要  :満席かどうか判定する
	 * 引数  :Object rowData:行データの連想配列
	 * 　　  :Object timeTableStudents:時間帯あたりの予約人数をまとめたオブジェクト
	 * 返却値:boolean:判定結果
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnを1つにまとめました
	 */
	 this.isFull = function(rowData, timeTableStudents) {
		 var retBoo = false;	//返却値用変数を用意する
		 
	 	// 残席が0以下であればtrueを返す
		if(this.getRestOfSheets(rowData, timeTableStudents) <= 0) {
			retBoo = true;	//trueを返すようにする
		}
		
		return retBoo;	//結果を返す
	}

	/**
	 * Dateオブジェクトと加算日からn日後、n日前を求める関数
	 * @param date 操作対象の日付
	 * @param int addDays 加算日。マイナス指定でn日前も設定可能
	 * @return 求まったdateオブジェクト
	 */
	/* 
	 * 関数名:computeDate
	 * 概要  :満席かどうか判定する
	 * 引数  :Date date:操作対象の日付
	 * 　　  :int addDays:加算日。マイナス指定でn日前も設定可能
	 * 返却値:date:求まったdateオブジェクト
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:コメントを追記しました。
	 */
	this.computeDate = function(date, addDays) {
	    var baseSec = date.getTime();		//クライアントの現在時刻を取得する
	    var addSec = addDays * 86400000; 	//日数 * 1日のミリ秒数	で加算するミリ秒数を算出する
	    var targetSec = baseSec + addSec;	//現在時刻と加算するミリ秒を加算する
	    date.setTime(targetSec);			//捜査対象の日付に算出した値をセットする
	    
	    return date;						//日付を返す
	}

	/**
	 * 授業が予約可能かを判定する
	 * @param rowData 授業データのオブジェクト
	 * @return 予約可能かどうかの判定
	 */
	/* 
	 * 関数名:isBookable
	 * 概要  :授業が予約可能かを判定する
	 * 引数  :Object rowData:授業データのオブジェクト
	 * 返却値:boolean:予約可能かどうかの判定
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnを1つにまとめました。コメントを追記しました
	 */
	this.isBookable = function(rowData) {
		var retBoo = true;	//返却値用の変数を用意、trueで初期化する
		
		this.isExist(rowData, COLUMN_NAME_LESSON_DATE);			//授業データ内に日付データがあるかチェックする
		var lessonDateStr = rowData[COLUMN_NAME_LESSON_DATE];	//授業日付を取得する
		var lessonDate = new Date(lessonDateStr);				//授業日付で新たにオブジェクトを作る
		this.isExist(rowData, COLUMN_NAME_STOP_ORDER_DATE);		//授業データ内に締切日数があるかチェックする
		var stopOrderDate = rowData[COLUMN_NAME_STOP_ORDER_DATE];	// 締切日数を取得する
		this.isExist(rowData, COLUMN_NAME_TODAY);					//授業データ内に今日日付データがあるかをチェックする
		var todayStr = rowData[COLUMN_NAME_TODAY];					//今日日付データを取得する
		var today = new Date(todayStr);								//今日日付データのオブジェクトを作る
		//予約締切の日付を算出する
		var limitDate = this.computeDate(lessonDate, -1 * stopOrderDate);
		// レッスン日の締切日数前を過ぎてたら締切となる
		if(today.getTime() >= limitDate.getTime()) {
			retBoo = false;	//falseを返すようにする
		}
		
		return retBoo;	//判定結果を返す
	}

	/**
	* 授業のステータスを表す文字列を取得する
	* @param mixed rowdata 授業情報を格納した連想配列
	* @param int timeTableStudents 時間割全体の予約人数
	* @return string ステータス文字列
	*/ 
	/* 
	 * 関数名:getClassworkStatus
	 * 概要  :授業のステータスを表す文字列を取得する
	 * 引数  :Object rowData:行データの連想配列
	 * 　　  :Object timeTableStudents:時間帯あたりの予約人数をまとめたオブジェクト
	 * 返却値:String:授業のステータスの文字列
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnを1つにまとめました。コメントを追記しました
	 */
	this.getClassworkStatus = function(rowData, timeTableStudents) {
		var retStr = EMPTY_STRING;	//返却用の変数を用意する
	
		//最大予約人数が0なら
		if (rowData[COLUMN_NAME_MAX_NUM] == 0) {
			retStr = this.classworkStatuses[RECEIPT];	//中止
		//最大予約人数が1以上なら
		} else {
			//行データから授業ステータスの列の存在を確認する
			this.isExist(rowData, COLUMN_NAME_CLASSWORK_STATUS);
			// 授業ステータスの値をを変数に入れる
			var classworkStatus = rowData[COLUMN_NAME_CLASSWORK_STATUS];
			// 授業が中止であるなら
			if(this.isCanceled(classworkStatus)) {
				//中止
				retStr = this.classworkStatuses[classworkStatus];
			//中止以外であれば更なる判定に入る
			} else {
				//行データから予約ステータスの列の存在を確認する 
				this.isExist(rowData, COLUMN_NAME_USER_WORK_STATUS);
				//予約ステータスの値を取得する
				var userClassworkStatus = rowData[COLUMN_NAME_USER_WORK_STATUS];
				
				// 授業終了時の判断。開催済みであれば
				if(this.hasDone(classworkStatus)) {
					if(userClassworkStatus) {	//予約ステータスが0でなければ
						//予約ステータスに応じた文字列を返すようにする
						retStr = this.userClassworkStatuses[userClassworkStatus];
					} else {	//予約ステータスが0なら
						//授業ステータスに応じた文字列を返すようにする
						retStr = this.classworkStatuses[classworkStatus];
					}
				//満席であれば
				} else if(this.isFull(rowData, timeTableStudents)) {
					//満席のステータスの文字列を返すようにする
					retStr = this.classworkStatuses[6];
				//予約可能であれば
				} else if(this.isBookable(rowData)) {
					if(userClassworkStatus) {	//予約ステータスが0でなければ
						//予約ステータスに応じた文字列を返すようにする
						retStr = this.userClassworkStatuses[userClassworkStatus];
					} else {	//予約ステータスが0なら
						//授業ステータスに応じた文字列を返すようにする
						retStr = this.classworkStatuses[classworkStatus];
					}
				//どれにも当てはまらなければ締切判定
				} else {
					//締切リターン締切の文字列を返すようにする
					retStr = this.classworkStatuses[5];
				}
			}
		}
		
		return retStr;	//文字列を返す
	}

	/* 
	 * 関数名:getRestMark
	 * 概要  :授業データから授業の予約状況を解析して適切な予約可否状態のマークを返す(◎、✕等)
	 * 引数  :Object rowData:授業データ
	 * 引数  :int timeTableStudents:時間帯全体の受講者数
	 * 引数  :String lessonStatus:予約可否状態の文字列(「予約締切」等)
	 * 返却値:String 予約可否状態のマーク
	 * 作成者:T.Masuda
	 * 作成日:2015.10.11
	 */
	this.getRestMark = function(rowData, timeTableStudents, lessonStatus) {
		//授業の時間帯全体の残席数を取得する
		var rest = this.getRestOfSheets(rowData, timeTableStudents);
		var restMark = "";	//返却用の値保持用の変数を用意する
		//単に予約不可の授業であった場合
		if (lessonStatus == RESERVE_AFTER_DEADLINE || 
			rowData[COLUMN_NAME_MAX_NUM] == 0 ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == HAS_RESERVED_1 ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == RECEIPT ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == HAS_LECTURES) {
			
			//✕マークを返すようにする
			restMark = this.restMarks[MARK_CROSS];
		//残席数をチェックしてマークを算出する必要がある場合
		} else {
			//マーク一覧のオブジェクトを走査する
			for(var key in this.restMarks) {
				//キー(数値)が残席数より大きければ
				if(key > rest) {
					break;	//走査を打ち切る
				}
				
				//マークを入れ替える
				restMark = this.restMarks[key];
			}
		}
		
		//マークを返す
		return restMark;
	};

	/* 
	 * 関数名:getPoint
	 * 概要  :ポイントを取得するための関数
	 * 引数  :targetKey:対象のテーブル(型は連想配列)
	 		 :sumCost 料金の合計
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.14
	 */
	this.getPoint = function (targetTable, sumCost) {
		// 列にあるポイントレートを変数に入れる
		var pointRate = targetTable[COLUMN_NAME_POINT_RATE];
		// 料金とレートをかけて100で割り、結果を求める
		var resultPoint = sumCost * pointRate / 100;
		// 四捨五入する
		resultPoint = Math.round(resultPoint);
		// 求めたポイントを返す
		return resultPoint;
	};

	/**
	 * 1行中の各料金の合計を得る
	 * @param rowData mixed 対象の列
	 * @return int 料金合計
	 */
	/* 
	 * 関数名:sumCost
	 * 概要  :1行中の各料金の合計を得る
	 * 引数  :Object rowData:行データ
	 * 返却値  :int 算出した金額
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:コメントを追記しました
	 */
	this.sumCost = function(rowData) {
		//行データに費用の列があるかチェックする
		this.isExist(rowData, COLUMN_USER_CLASSWORK_COST);
		// 予約済でないならデフォルトの値を使う
		if(rowData[COLUMN_USER_CLASSWORK_COST] === EMPTY_STRING) {
		//デフォルトの費用を返す
			return this.getDefaultCost(rowData);
		}
		
		var result = 0;	//算出結果をまとめる変数を宣言、初期化する
		
		//行データから費用関連の列を走査する
		for (var i = 0; i < this.classworkCostColumns.length; i ++) {
			this.isExist(rowData, this.classworkCostColumns[i]);	//各費用の列の存在をチェックする
			//費用を足していく
			result += Number(rowData[this.classworkCostColumns[i]]);
		}
		
		return result;	//算出した費用を返す
	};

	/**
	 * 1行中の各デフォルト料金の合計を得る
	 * @param rowData mixed 対象の列
	 * @return int デフォルト料金合計
	 */
	/* 
	 * 関数名:getDefaultCost
	 * 概要  :1行中の各料金の合計を得る
	 * 引数  :Object rowData:行データ
	 * 返却値  :int 算出した金額
	 * 作成者:A.Honmura
	 * 作成日:2015.06.
	 * 変更者:T.Masuda
	 * 変更日:2015.10.12
	 * 内容　:returnを1つにまとめました。コメントを追記しました
	 */
	this.getDefaultCost = function(rowData) {
		
		var result = 0;	//算出結果の金額用の変数を宣言、初期化する
		
		//行データ中の各デフォルト料金の列を走査する
		for (var i = 0; i < this.defaultClassworkCostColumns.length; i ++) {
			//列の存在をチェックする
			this.isExist(rowData, this.defaultClassworkCostColumns[i]);
			//金額を足していく
			result += Number(rowData[this.defaultClassworkCostColumns[i]]);
		}
		
		//算出した結果の金額を返す
		return result;
	}

	/* 
	 * 関数名:backThreeStringDelete
	 * 概要  :第一引数の配列から第二引数のキーの値について、その値の後ろから3文字を削除する
	 * 引数  :rowData:連想配列名。テーブルから取り出した値
	 		:columnName:テーブルの列名(連想配列のキー名)
	 * 返却値  :resultString: 後ろから3文字を削除した結果の文字列
	 * 用途例:11:00:00 となっているところの後ろの「:00」を削除する
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.backThreeStringDelete = function(rowData, columnName) {
		// 第一引数の連想配列に対して、第二引数の値を返却結果変数に入れる
		var resultString = rowData[columnName];
		// 値の後ろから3文字削除した文字列を結果の変数に入れる
		resultString = resultString.substr(0, (resultString.length-3));
		// 結果の文字列を返す
		return resultString;
	}

	/* 
	 * 関数名:deleteStringBack
	 * 概要  :オブジェクトのキーの値の文字列の後方の文字を消す
	 * 引数  :Object target:処理対象のオブジェクト
	 		:String key :処理対象のオブジェクトのキー
	 		:int number:消す文字数
	 * 返却値  :String :加工した文字列を返す
	 * 作成者:T.Masuda
	 * 作成日:2015.10.11
	 */
	this.deleteStringBack = function(target, key, number) {
		//オブジェクトから文字列を取り出す
		var retStr = target[key];
		//後方の文字を消す
		retStr = retStr.substr(0, (retStr.length - number));
		//加工した文字列を返す
		return retStr;
	}
	
	/* 
	 * 関数名:frontTwoStringDelete
	 * 概要  :第一引数の配列から第二引数のキーの値について、その値の前から2文字を削除する
	 * 引数  :rowData:連想配列名。テーブルから取り出した値
	 		:columnName:テーブルの列名(連想配列のキー名)
	 * 返却値  :resultString: 後ろから3文字を削除した結果の文字列
	 * 用途例:2015:0613となっているところの前の「20」を削除する
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.frontTwoStringDelete = function(rowData, columnName) {
		// 第一引数の連想配列に対して、第二引数の値を返却結果変数に入れる
		var resultString = rowData[columnName];
		// 値の前から2文字削除した文字列を結果の変数に入れる
		resultString = resultString.substr(2, (resultString.length));
		// 結果の文字列を返す
		return resultString;
	}

	/* 
	 * 関数名:buildHourFromTo
	 * 概要  :時間割を求める
	 * 引数  :rowData:連想配列名。テーブルから取り出した値
	 * 返却値  :resultTimeschedule : 時間割の結果
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 * 修正者:T.Masuda
	 * 修正日:2015.1011
	 * 内容　:文字列加工の関数を変えました
	 */
	this.buildHourFromTo = function(rowData) {
		// 時間割の始まりの時間を求める
		var start_time = this.deleteStringBack(rowData, COLUMN_NAME_START_TIME, 3);
		// 時間割の終わりの時間を求める
		var end_time = this.deleteStringBack(rowData, COLUMN_NAME_END_TIME, 3);
		// 時間割の結果を求める
		var resultTimeschedule = start_time + CHAR_HYPHEN + end_time;
		
		//算出した結果を返す
		return resultTimeschedule;
	};

	/* 
	 * 関数名:allDateTime
	 * 概要  :年月日と開始時間、終了時間を返す
	 * 引数  :rowData:連想配列名。テーブルから取り出した値
	 		:columnName:テーブルの列名(連想配列のキー名)
	 * 返却値  :resultString: 後ろから3文字を削除した結果の文字列
	 * 用途例:11:00:00 となっているところの後ろの「:00」を削除する
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.allDateTime = function(rowData) {
		// 結果となる変数を用意する
		var result;
		//日付の前2文字を削除する(2015-01-01を15-01-01と表記したいため)
		result = this.frontTwoStringDelete(rowData, COLUMN_NAME_LESSON_DATE);
		//空白スペースを入れて見やすくする
		result += SPACE;
		//時間の後ろ3文字を消す(12:00:00の「:00」を削除する)
		result += this.buildHourFromTo(rowData);
		//結果を返す
		return result;
	};


	/* 
	 * 関数名:callEachDayReservedValue
	 * 概要  :管理者日ごと予約者一覧テーブルの値を置換する
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.22
	 */
	this.callEachDayReservedValue = function(tableName, loopData, counter, rowNumber) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		// 時間割の始まりの時間を求める
		start_time = this.backThreeStringDelete(recordData, COLUMN_NAME_START_TIME);
		// 時間割の終わりの時間を求める
		end_time = this.backThreeStringDelete(recordData, COLUMN_NAME_END_TIME);
		//ユーザステータスの番号を取得する
		userStatusNumber = this.recordData[COLUMN_NAME_USER_WORK_STATUS]
		//ユーザのステータスを取得する
		userStatus = this.userClassworkStatuses[userStatusNumber];
		// No.を入力する
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(0).text(rowNumber);
		// 開始時間を表示する
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(2).text(start_time);
		// 終了時間を表示する
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(3).text(end_time);
		//ユーザステータスを表示する
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(6).text(userStatus);
	};


	/* 
	 * 関数名:callLecturePermitValue
	 * 概要  :受講承認テーブルに値入れるための関数
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.15
	 */
	this.callLecturePermitValue = function(tableName, loopData, counter, rowNumber) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		// 開始日時と終了時刻を組み合わせた値を入れる
		allDay = this.allDateTime(recordData);
		//連番を入れる
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(1).text(rowNumber);
		// 開始日時と終了時間を合わせてテーブルの最初のカラムに値を入れる
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(2).text(allDay);
	};

	/* 
	 * 関数名:callPermitLessonListValue
	 * 概要  :受講承認一覧テーブルに表示されている値を変換する
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.20
	 */
	this.callPermitLessonListValue = function(tableName, loopData, counter, rowNumber) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		//連番を入れる
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(0).text(rowNumber);
		//テーマの値が空白のとき、その列に後にセレクトボックスをアペンドするために対してクラスをつける。
		if(!commonFuncs.checkEmpty(recordData.lesson_name)) {
			//クラスappendSelectboxをつけてアペンド対象であることを分かりやすくする
			$(tableName + ' tr:eq(' + rowNumber + ') td').eq(2).addClass('appendSelectbox');
			$(tableName + ' tr:eq(' + rowNumber + ') input:hidden').val(recordData.id);
		}
	};

	/* 
	 * 関数名:customizeTableData
	 * 概要  :dbから取り出したテーブルについて加工した値をjsonに追加する
	 * 引数  :tabledata:DBから取得したテーブルのjson
	 		:customizeFunc:カスタマイズするテーブルの関数名
	 		:timeTableStudents:時限ごとの受講生徒数
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.15
	 */
	this.customizeTableData = function(tableData, customizeFunc, timeTableStudents) {
		//カウンターを作る
		var counter = 0;
		//テーブルのレコード数を取得し、ループの終わり値として設定する
		var recordLength = tableData.length;
		//テーブルの全ての行についてループする
		for(counter; counter < recordLength; counter++) {
			//テーブルのjsonについて値を加工する
			customizeFunc(tableData, counter, timeTableStudents);
		}
	}


//ここまでテーブル加工記述

	/*
	 * 関数名:checkEmpty
	 * 引数  :var target:空白チェックを行う対象
	 * 戻り値:boolean:判定結果を返す
	 * 概要  :引数に指定された変数やオブジェクトが空でないかをチェックする
	 * 作成日:2015.08.13
	 * 作成者:T.M
	 */
	this.checkEmpty = function(target){
		//判定対象の中身がundefined、null、空文字のいずれかであればfalseを返す。
		return target === void(0) || target == null || target == EMPTY_STRING ? false: true;
	}

	/*
	 * 関数名:getScriptFile
	 * 引数  :String scriptUrl:JSファイルのパス
	 * 戻り値:boolean:JSファイル取得の成否を返す
	 * 概要  :JSファイルを取得してそのまま展開する
	 * 作成日:2015.08.14
	 * 作成者:T.M
	 */
	this.getScriptFile = function(scriptUrl){
		$.ajax({							//Ajax通信でJSファイルを読み込む
			//以下、errorまでAjax通信の設定
			url:scriptUrl,					//ファイルパス
			dataTYpe:"script",				//JSファイルを取得する設定
			async:false,					//同期通信
			cache : false, 					//キャッシュを無効にする
			success:function(sc){			//通信成功時
				//console.log("got script");	//成功判定のログを出す
			},
			error:function(xhr,status,error){			//通信失敗時
				//失敗のログを出す
				console.log(GET_SCRIPT_FAIL_MESSAGE_FRONT + scriptUrl + PARENTHESES_REAR);
				//各エラー内容をログに出す
				console.log(xhr);		//通信結果のデータ
				console.log(status);	//通信状態
				console.log(error);		//エラー内容
			}
		});
	}

	/* 関数名:callOpenDialog
	 * 概要　:ダイアログが開いたときのコールバック関数openDialogをコールする。
	 * 		:ダイアログのcloseイベントのコールバック関数には基本的にこれをセットする
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.callOpenDialog = function(){
		//openDialog関数を実行する
		this.dialogBuilder.dispContents();
	}
	
	/* 関数名:moveNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を移動させる
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.moveNoticeWindows = function(){
		$.when(
		//0ミリ秒後にキャンペーンお知らせ表示ボタンをスライド表示する。
			showRightOutOfDisplayButton('.topicShowCampaign', 0, 3000)
			).then(function(){
				$.when(
					//400ミリ秒後にギャラリーお知らせ表示ボタンをスライド表示する。
					showRightOutOfDisplayButton('.topicShowGallery', 300, 3000)
					).then(function(){
						//900ミリ秒後にブログお知らせ表示ボタンをスライド表示する。
						showRightOutOfDisplayButton('.topicShowBlog', 600, 3000);
				});
		});
	}
	/* 関数名:toggleNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を開閉するイベントを登録する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.toggleNoticeWindows = function(){
		//3つのウィンドウとそれを表示・非表示にするボタンのイベントを登録する。順番にコールして順を整える。
		fadeToggleSet('div.topicShowCampaign', '.topicCampaign', '.topic', 500);
		fadeToggleSet('div.topicShowGallery', '.topicGallery', '.topic', 500);		
		fadeToggleSet('div.topicShowBlog', '.topicBlog', '.topic', 500);
	}
	
	/* 関数名:tableReplaceAndSetClass
	 * 概要　:テーブルを置換し、さらに行に対してクラス属性を付ける
	 * 引数　:string:tableName:テーブル名
	 		string :tableReplaceFunc:テーブル置換関数名
			bool:replaceBool:置換するときにレッスン合計人数がどうかの判定
			string:recordClassName:行につけるクラス属性名
	 * 返却値:なし
	 * 作成日　:2015.08.08
	 * 作成者　:T.Yamamoto
	 * 作成日　:2015.08.14
	 * 作成者　:T.Masuda
	 * 作成者　:dialogExからcommon.jsに移動しました
	 */
	this.tableReplaceAndSetClass = function(tableName, tableReplaceFunc, replaceBool, create_tag, recordClassName, showMaxRow) {
		//予約可能授業一覧を置換する
		this.dbDataTableValueReplace(tableName, tableReplaceFunc, replaceBool, create_tag, showMaxRow);
		//予約一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
		this.setTableRecordClass(tableName, recordClassName);
	}

	/* 
	 * 関数名:dbDataTableValueReplace
	 * 概要　:データベースから取り出したテーブルについて、値を置換する
	 * 引数　:string:tableName:値を置換する対象のテーブル名
	 		:string:replaceFuncName:置換を行う関数名
	 		:boolean:lessonList:置換するテーブルが授業を一覧で表示する(会員、管理者両方にあてはまる)テーブルであるなら受講人数を使うかどうかの判定
	 		:creatTagInstance:creator:クリエイトタグのインスタンス名
	 * 返却値:なし
	 * 作成日　:2015.07.31
	 * 作成者　:T.Yamamoto
	 * 作成日　:2015.08.15
	 * 作成者　:T.Masuda
	 * 内容　	　:dialogExに対応しました
	 */
	this.dbDataTableValueReplace = function(tableName, replaceFuncName, lessonList, creator, showMaxRow) {
		//置換を行うテーブルのデータを取得する
		var tableData = creator.json[tableName][TABLE_DATA_KEY];
		//第三引数がtrueなら授業受講者人数を求めた上で関数を実行する
		if(lessonList) {
			//時間割1限分の生徒の合計人数が入った連想配列を作る
			var timeStudentsCount = getTotalStudentsOfTimeTable(tableData);
			//テーブルの値を置換する
			dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, timeStudentsCount, showMaxRow);
		} else {
			//テーブルの値を置換する
			dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, '', showMaxRow);
		}
	}

	
	/* 
	 * 関数名:showElem
	 * 概要　:隠れている要素を表示する
	 * 引数　:string selector:要素のセレクタ
	 * 返却値:なし
	 * 作成日　:2015.07.31
	 * 作成者　:T.Yamamoto
	 */
	this.showElem = function(selector){
		//テーブルを画面に表示する
		$(selector).show();
	}

	/* 
	 * 関数名:dbDataTableReplaceExecute
	 * 概要  :dbから取り出したテーブルについてクライアント側で置換させる
	 * 引数  :
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.dbDataTableReplaceExecute = function(tableName, rowData, func, timeTableStudents, showMaxRow) {
		// カウンターを作る
		var counter = 0;
		// テーブルの行番号
		var rowNumber = 1;
		// データの数
		var rowDataNum = rowData.length;
		//最大表示行数が入力されていなければ初期化する
		showMaxRow = this.checkEmpty(showMaxRow) ? showMaxRow : DEFAULT_SHOW_MAX_ROW;
		
		//ナンバリングがあれば
		if($('.numbering .select:visible').length){
			//途中からスタートする
			counter = (showMaxRow) * (parseInt($('.numbering .select:visible').text()) - 1);
		}
		
		// テーブルのすべての行に対してループで値を入れる
		$.each(rowData, function() {
			// テーブルの値を変える関数をコールする
			eval(func)(tableName, rowData, counter, rowNumber, timeTableStudents);
			// 行番号をインクリメントする
			rowNumber++;
			// カウンタ変数をインクリメントする
			counter++;
			
			//最後のデータまで走査したら
			if(counter >= rowDataNum){
				return false;	//ループ終了となる
			}
		});
	}

	/* 
	 * 関数名:setTableRecordClass
	 * 概要  :テーブルの最初の行を除くtrタグに対してクラス属性を付ける
	 		これによってアコーディオン機能を実装するための行がどの行なのかを
	 		識別できるようになる
	 * 引数  :tableClassName: 行にクラス属性を付けたいテーブル名
	 		:tableRecordClasssName: 行に新しくつけるクラス名
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.16
	 */
	this.setTableRecordClass = function(tableClassName, tableRecordClasssName) {
		//第一引数のテーブルの1行目を除くtrタグに対して第2引数の名前のクラス属性を付け、行に対する対象を当てやすくする
		$(DOT + tableClassName + TAG_TR).eq(0).siblings().addClass(tableRecordClasssName);
	}	
	
	/*
	 * 関数名:isSupportPushState
	 * 引数  :なし
	 * 戻り値:boolean
	 * 概要  :ブラウザがpushStateに対応しているかをbooleanで返す。
	 * 作成日:2015.03.10
	 * 作成者:T.M
	 * 作成日:2015.08.16
	 * 作成者:T.M
	 * 内容	:controlPage.jsからcommonクラスに移動しました
	 */
	this.isSupportPushState = function(){
		// 返却値を格納する変数retBooを宣言し、falseで初期化する。
		var retBoo = false;
		//ブラウザがpushStateに対応していれば
		if(window.history && window.history.pushState){
			//trueを返す様にする。
			retBoo = true;
		}
		
		//判定結果を返す
		return retBoo;
	}
	
	/* 
	 * 関数名:numberCheck
	 * 概要  :指定した要素のテキストボックスの値が0以下でないかをチェックする。
	 * 引数  :String selector:チェックするクラス。
	 * 返却値  :null || Array:チェックがOKならnullを返し、そうでなければname属性の配列を返す。
	 * 作成者:T.Masuda
	 * 作成日:2015.04.18
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	this.numberCheck = function(selector){
		//返却する配列を宣言、初期化する。
		var returns = [];
		
		//指定されたクラスの要素を走査する。
		$(selector).each(function(){
			//現在さす要素の値が0以下であれば
			if(parseInt($(this).val()) <= 0 ){
				//配列にこの要素のname属性を格納する。
				returns.push($(this).attr('name'));
			}
		});
		
		//チェックに引っかかった要素があれば配列を返し、なければnullを返す。
		return returns.length > 0? returns: null;
	}

	/* 
	 * 関数名:checkEmptyInput
	 * 概要  :入力フォームの空チェックを行う。
	 * 引数  :Array names:チェックするフォームのname属性をまとめた配列。
	 * 返却値:null || Array
	 * 作成者:T.M
	 * 作成日:2015.04.01
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	this.checkEmptyInput = function(names){
		//namesの要素数を取得する。
		var nameslength = names.length;
		//返す配列を作成する。
		var retArray = [];
		//namesを走査する。
		for(var i = 0; i < nameslength; i++){
			//入力フォームのタイプを取得する。
			var type = $('input[name="' + names[i] + '"]:not(:hidden)').attr('type');
			if(type !== void(0)){	//要素が存在していればチェックを行う
				//typeがチェックするものであれば
				if(type == 'radio' || type == 'checkbox'){
					//チェックが入っているものがないなら
					if($('input[name="' + names[i] + '"]:checked').length <= 0){
						//配列にname属性の値を入れる。
						retArray.push(names[i]);
					}
					//テキストボックス等なら
				} else {
					//何も入力されていなければ
					if($('input[name="' + names[i] + '"]').val() == ''){
						//配列にname属性の値を入れる。
						retArray.push(names[i]);
					}
				}
			}
		}
		
		//結果を返す。未入力のname属性の配列か、未入力なしのnullを返す。
		return retArray.length > 0 ? retArray: null;
	}
	
	/* 
	 * 関数名:replaceJpName
	 * 概要  :配列の英語名を日本語する。
	 * 引数  :Array names:英語名の配列。
	 * 　　　 :Object jpNames:キーが英語名、値が日本語名の連想配列。
	 * 返却値:Array
	 * 作成者:T.M
	 * 作成日:2015.04.01
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	this.replaceJpName = function(names, jpNames){
		var retArray = [];				//返す配列を宣言する。
		var nameslength = names.length;	//namesの要素数を取得する。
		
		//namesを走査する。
		for(var i = 0; i < nameslength; i++){
			var key = names[i];
			//返す配列に日本語名を順次格納していく。
			retArray[i] = jpNames[key];
		}
		
		//作成した配列を返す。
		return retArray;
	}

	/* 
	 * 関数名:function checkAllAlphabet
	 * 概要  :全角文字の入力チェックを行う。
	 * 引数  :String selector:対象となる要素のセレクタ。
	 * 返却値:Array
	 * 作成者:T.M
	 * 作成日:2015.04.09
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	 this.checkAllAlphabet = function(selector){
		var retArray = [];	//返却値を格納する配列を宣言、空の配列で初期化する。
		 //全角入力チェックを行う。
		 $(selector).each(function(){
			 var onlyAlphabet = checkAlphabet($(this).val());	//アルファベットオンリーでないかのチェックをする。
			 //有効でない文字があったら
			 if(onlyAlphabet == false){
				 retArray.push($(this).attr(STR_NAME));	//name属性を配列に入れる。
			 }
		 });
		 
		 //作成した配列、またはnullを返す。
		return retArray.length > 0? retArray: null;
	}


	/* 
	 * 関数名:makeFailedAlertString(list, jpNameMap)
	 * 概要  :入力失敗の警告メッセージを作る。
	 * 引数  :map lists:エラーがあった欄のリストの連想配列。
	 * 　　  :map jpNameMap:英語名のキーと日本語名の値の連想配列。
	 * 　　  :map messages:エラーメッセージの序文の連想配列。
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.04.18
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	this.makeFailedAlertString = function(lists, jpNameMap, messages){
		var errorString = EMPTY_STRING;	//エラーメッセージのテキストを格納する変数を宣言、初期化する。
		
		//listsのキーを走査する
		for(key in lists){
			//チェックが通った項目でなければ
			if(lists[key] != null){
				 //エラーのリストを日本語に訳す。
				 var errorList = this.replaceJpName(lists[key], jpNameMap);
				 //エラーのリストを1つの文字列にする。
				 var errorListString = errorList.join(ESCAPE_KAIGYOU);
				 //警告を追加する。
				 errorString += messages[key] + errorListString + ESCAPE_KAIGYOU + ESCAPE_KAIGYOU;
			}
		}
		
		//エラーメッセージを返す。
		return errorString;
	}

	/* 
	 * 関数名:nullCheckInObject
	 * 概要  :オブジェクトのルートのキーにnullがないかをチェックする
	 * 引数  :Object obj:nullチェック対象のオブジェクト
	 * 返却値  :int:nullがあった数を返す
	 * 作成者:T.M
	 * 作成日:2015.08.16
	 */
	this.nullCheckInObject = function(obj){
		var retInt = 0;	//nullの数を格納する変数を宣言、0で初期化する
		//対象のオブジェクトの各キーをチェックする
		for(key in obj){
			//走査対象のキーにnullが入っていたら
			if(obj[key] == null){
				retInt++;	//nullの数をカウントアップする
			}
		}

		return retInt;	//検出したnullの数を返す
	}
	
	/*
	 * 関数名:createFormData
	 * 引数  :Element form
	 * 戻り値:FormData:フォームデータのオブジェクトを返す
	 * 概要  :フォームの投稿データを作る。
	 * 作成日:2015.03.09
	 * 作成者:T.Masuda
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。また、FormDataとして返すようにしました
	 */
	this.createFormData = function(form){
		//返却するデータを格納する変数を宣言する。
		var formDataReturn = new FormData();
		
		//フォーム内の入力要素を走査する。無効化されている要素は走査対象から外す。
		$(FORM_VALIE_INPUTS, form)
			.not(ATTR_DISABLED).each(function(){
			var val = this.value;	//入力フォームから値を取得する
			//name属性の値を取得する。
			var name = $(this).attr(STR_NAME);
			//type属性の値を取得する。
			var type = $(this).attr(TYPE);
			
			//nameが空でなければ
			if(name != EMPTY_STRING && name !== void(0)){
				//チェックボックスか、ラジオボタンなら
				if(type == CHECKBOX || type==RADIO){
					if($(this).index(SELECTOR_NAME_FRONT + name + SELECTOR_ATTR_REAR_AND_CHECKED) == 0){
						val = [];	//配列を生成してvalに代入する。ここから値を作り直していく
						//name属性で括られたチェックボックスを走査していく。
						$(SELECTOR_INPUT_NAME_FRONT + name + SELECTOR_ATTR_REAR_AND_CHECKED).each(function(){
							//配列にチェックボックスの値をgetAttributeNodeメソッドを使い格納していく。
							val.push(this.getAttribute(VALUE));
						});
						//formDataを連想配列として扱い、keyとvalueを追加していく。
						formDataReturn.append(name, val);
					}
				//それ以外であれば
				} else {
					//formDataを連想配列として扱い、keyとvalueを追加していく。
					formDataReturn.append(name, val);
				}
			}
		});

		//フォームデータを返す。
		return formDataReturn;
	}

	/*
	 * 関数名:createFormObject(form)
	 * 引数  :Element form:フォームの要素
	 * 戻り値:Object:フォームデータのオブジェクトを返す
	 * 概要  :フォームからオブジェクトを作る。
	 * 作成日:2015.08.22
	 * 作成者:T.Masuda
	 */
	this.createFormObject = function(form){
		//返却するデータを格納する変数を宣言する。
		var formDataReturn = {};

		//フォーム内の入力要素を走査する。無効化されている要素は走査対象から外す。
		$('input:text, input[type="email"], textarea, input:radio:checked, input:checkbox:checked, input:hidden,input[type="number"], input[type="search"], input[type="tel"], input[type="password"]', form)
			.not('[disabled]').each(function(){
			var val = this.value;	//入力フォームから値を取得する
			//name属性の値を取得する。
			var name = $(this).attr('name');
			//type属性の値を取得する。
			var type = $(this).attr('type');
			
			//nameが空でなければ
			if(name != "" && name !== void(0)){
				//チェックボックスか、ラジオボタンなら
				if(type == CHECKBOX || type == RADIO){
					if($(this).index('[name="' + name + '"]:checked') == 0){
						val = [];	//配列を生成してvalに代入する。ここから値を作り直していく
						//name属性で括られたチェックボックスを走査していく。
						$('input[name="' + name + '"]:checked').each(function(){
							//配列にチェックボックスの値をgetAttributeNodeメソッドを使い格納していく。
							val.push(this.getAttribute(VALUE));
						});
						
						//ラジオボタンなら
						if (type == RADIO) {
							//formDataにラジオボタンの値を追加する
							formDataReturn[name] = val[0];
						//チェックボックスなら
						} else {
							//formDataにチェックボックスの値を追加する
							formDataReturn[name] = val;
						}
					}
				//それ以外であれば
				} else {
					//formDataを連想配列として扱い、keyとvalueを追加していく。
					formDataReturn[name] = val;
				}
			}
		});
		
		//フォームデータを返す。
		return formDataReturn;
	}
	
	/* 
	 * 関数名:disableInputs(dialog)
	 * 概要  :対象のダイアログの入力要素を一時無効にする。
	 * 引数  :Element || String area:この要素の子要素を無効にする
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.11
	 * 変更者:T.Masuda
	 * 変更日:2015.08.16
	 * 内容	:createDialog.jsからcommonクラスに移動しました。
	 */
	this.disableInputs = function(area){
		// dialogのinputタグ、buttonタグにdisabled属性を追加して一時無効化する。
		$(FORM_ELEMS, area).attr(DISABLED, DISABLED);
	}

	/* 関数名:setLessonDataToJSON
	 * 概要　:授業のデータをcerateTagのJSONにセットする
	 * 引数　:dialogEx dialog:ダイアログのクラスインスタンス
	 * 		:createLittleContents create_tag:createLittleContentsクラスインスタンス
	 * 返却値:なし
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:共通で使えるためcommon.jsに移動しました
	 * 修正日　:2015.0912
	 * 修正者　:T.Masuda
	 * 内容	　:ユーザIDの取得はdataの中にユーザIDがある場合のみにしました
	 */
	this.setLessonDataToJSON = function(dialog, create_tag){
		//ダイアログのdataオブジェクトを取得する
		var data = dialog.getArgumentDataObject();
		//dbに接続する前に日付をクエリの置換連想配列に挿入する
		create_tag.json.lessonTable.lessonDate.value = data.lessonDate;
		//ユーザIDがdataの中に入っていれば(=予約ダイアログの場合)
		if('userId' in data){
			//dbに接続する前に会員番号をクエリの置換連想配列に挿入する
			create_tag.json.lessonTable.user_key.value = data.userId;
		}
	}
	
	
	/* 関数名:getTableJsonLength
	 * 概要　:createTag(createLittleContents)クラスインスタンスのテーブル用JSONの行数を取得する
	 * 引数　:createLittleContents create_tag:createLittleContentsクラスインスタンス
	 * 		:String tableName:テーブルのJSONのキー
	 * 返却値:int:テーブルの行数を返す
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.getTableJsonLength = function(create_tag, tableName){
		//指定したキーのテーブルの行数を返す
		return create_tag.json[tableName][TABLE_DATA_KEY].length;
	}
	
	/* 関数名:createCloneObject
	 * 概要　:オブジェクトのクローンを作成する
	 * 引数　:Object object:クローン作成元のオブジェクト
	 * 返却値:object:引数のオブジェクトのクローンを返す
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.createCloneObject = function(object){
		//オブジェクトのクローンを作成して返す
		return $.extend(true, {}, object);
	}
	
	/* 
	 * 関数名:getInputData
	 * 概要  :テキストボックスとセレクトボックスとテキストエリアのデータを取得し、
	        :クラス名をkey、入っている値をvalueの連想配列にして返す
	 * 引数  :String selector:値を走査したい親のセレクター名
	 * 　　  :Object additionalAttr:追加で取得するHTMLタグのAttributeと返却値のオブジェクトに追加するエントリのキーの設定
	 * 返却値  :Object:入力データの結果連想配列
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.27
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:共通で使えるためcommon.jsに移動しました。また、セレクタをクラスに限定しないようにしました
	 * 修正日　:2015.1226
	 * 修正者　:T.Masuda
	 * 内容	　:value以外のattributeも取得できるように変更しました。
	 */
	this.getInputData = function(selector, additionalAttr) {
		var $form = $(selector);	//処理対象の親要素を取得する
		//結果の変数を初期化する
		var retMap = {};
		//inputタグ、セレクトタグ、テキストエリアタグの数だけループする
		$(SEL_INPUT_DATA , $form).each(function() {
			//入力データのname属性を取得する
			var name = $(this).attr(STR_NAME);
			//additionalAttrで指定したattributeの値をmapに追加する
			retMap = commonFuncs.addMapKeyValue(this, name, retMap, additionalAttr);
			
			//入力データの値を取得する
			var value = $(this).val();
			//ラジオボタンやチェックボックスの判定に使うため、type属性を取得する
			var typeAttr = $(this).attr(TYPE);
			//ラジオボタンに対応する
			if (typeAttr == RADIO) {
				//ラジオボタンの値がチェックされているものだけ送信する
				if($(this).prop(CHECKED)) {
					//ラジオボタンにチェックがついているものの値を送信する連想配列に入れる
					retMap[name] = value;
				}
			} else {
				//入力データを結果の変数に、key名をクラス名にして保存する
				retMap[name] = value;
			}
		});
		
		//結果を返す
		return retMap;
	}
	
	/* 関数名:addMapKeyValue
	 * 概要　:オブジェクトのクローンを作成する
	 * 引数　:Element inputElem:値を取得する元の要素
	 * 　　　:Object map:エントリを追加する対象のオブジェクト
	 * 　　　:Object additionalAttr:要素からの値取得方法設定のオブジェクト
	 * 返却値:object:引数のオブジェクトのクローンを返す
	 * 作成日　:2015.1223
	 * 作成者　:T.Masuda
	 */
	this.addMapKeyValue = function (inputElem, name, map, additionalAttr) {

		//name属性の値と同じキーがadditionalAttrに含まれていれば
		if (additionalAttr) {
			//設定のノードを取り出す
			var additionalAttrNode = additionalAttr[name];
			
			//該当するキーのオブジェクトの中身を走査する
			for (key in additionalAttrNode) {
				//設定名になるキー名を取得する
				var keyName = additionalAttrNode[key];
				
				//attr関数で取得するattributeを指定してオブジェクトにエントリを追加する
				map[keyName] = $(inputElem).attr(key);
			}
		}
		
		//mapを返す
		return map;
	}
	
	/* 関数名:sendMail
	 * 概要　:メールを送信する
	 * 引数　:Object sendObject:送信するデータのオブジェクト
	 * 		:String sendUrl:メール送信処理を行うプログラムのURL
	 * 		:String message:送信成功時のメッセージ
	 * 返却値:boolean:メール送信の成否を返す
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.sendMail = function(sendObject, sendUrl, message) {
		var retBoo = false;	//メール送信の成否の判定を返すための変数を用意する
		
		$.ajax({				//PHPにメール用データを渡すAjax通信
			url:sendUrl			//PHPのURLを設定する
			,data:sendObject	//送信データのオブジェクト
			,async:false		//同期通信
			,dataType:"json"	//JSON形式でデータをもらう
			,type:"POST"		//POSTメソッドでHTTP通信する
			,success:function(result){		//通信成功時
				//メール送信が行われていれば
				if(result == EMPTY_STRING || parseInt(result.sendCount) > 0 || parseInt(result.message) > 0){
					//送信完了と共にメッセージを出す。入力されていなかったら何もしない
					commonFuncs.checkEmpty(message) ? alert(message):console.log(EMPTY_STRING);	
					retBoo = true;	//成功判定にする
				//メール送信が失敗していれば
				} else if(commonFuncs.checkEmpty(message)){
					//送信失敗のメッセージを出す
					alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);
				}
			}
			//通信失敗時
			,error:function(xhr, status, error){
				//送信失敗のメッセージを出す。当該関数の引数にメッセージがセットされているときのみ出す。
				commonFuncs.checkEmpty(message) ? alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE):console.log(EMPTY_STRING);	
			}
		});
		
		return retBoo;	//判定を返す
	}
	
	/* 
	 * 関数名:textPushArray
	 * 概要  :配列に対して文字列を追加する
	 * 引数  :String parent:追加する文字列がある親のセレクタ
	 *		Array array:文字列を追加する配列の名前
	 *		String pushText 追加する文字が入っているセレクタ
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.08
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:共通で使えるためcommon.jsに移動しました。
	 */
	this.textPushArray = function(parent, array, pushText) {
		//配列に引数で指定した値を追加していく
		array.push($(parent).children(pushText).text());
	}

	/* 
	 * 関数名:setObjectValue()
	 * 概要  :連想配列から値を読み込んで、テキストボックスのvalue属性に値を入れる。
	 * 引数  :object object:テキストボックスに値を挿入するための値が入った連想配列名
	 * 		:String formParent:フォーム要素の親の要素
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.02
	 * 作成者:T.Masuda
	 * 作成日:2015.08.23
	 * 内容	:commonクラスに移動しました。また、大幅改修しました
	 */
	this.setObjectValue = function(object, formParent) {	
		//対象となるオブジェクトを走査する
		for (key in object) {
			//name属性が一致するフォーム要素に、対応する値を追加する
			$(FORM_ELEMS, formParent).filter('[name="' + key + '"]').val(object[key]);
		}
	}
	
	/* 
	 * 関数名:getDefaultArgumentObject
	 * 概要  :dialogExと同様のデフォルトのargumentObjを返す
	 * 引数  :なし
	 * 返却値 :デフォルトのargumentObjを返す
	 * 作成者:T.Masuda
	 * 作成日:2015.08.29
	 */
	this.getDefaultArgumentObject = function(){
		//dialogExと同様のデフォルトのargumentObjを返す
		return {
			//ダイアログの設定データオブジェクト
			config:{
				width: STR_AUTO,				//幅を自動調整する
				autoOpen : true,				//作成時の自動オープンを無効にする
				modal : true,					//モーダル表示
				resizable : false,				//ドラッグでのリサイズ可否
				position :POSITION_CENTER_TOP,	//表示位置の指定。
				closeOnEscape : false,			//escキーを押して閉じるか
				appendTo : $(CURRENT_WINDOW),	//表示中のウィンドウ内に追加する
				create:function(){				//ダイアログ作成時のイベント
				},
				open://基本的にopen時はdispContentsが実行されるようにする
					function(){
					//dispContentsをコールしてダイアログの内容を作る
					commonFuncs.setCallbackToEventObject(this, 'dialogBuilder', 'dispContents');
				},
				close:function(){	//ダイアログが閉じるときのイベント
					//ダイアログを完全に破棄する
					commonFuncs.setCallbackToEventObject(this, 'instance', 'destroy');
				}
			},
			//インプット用データオブジェクト
			data:{
			}
		};
	}
	
	/* 
	 * 関数名:getDefaultReturnObject
	 * 概要  :dialogExと同様のデフォルトのreturnObjを返す
	 * 引数  :なし
	 * 返却値 :Object:デフォルトのreturnObjを返す
	 * 作成者:T.Masuda
	 * 作成日:2015.08.29
	 */
	this.getDefaultReturnObject = function(){
		//dialogExと同様のデフォルトのreturnObjを返す
		return {
				//ダイアログのステータスオブジェクト
				statusObj:{
					buttonState:UNSELECTED	//押されたボタンの値。1→未選択 0→いいえ 1→はい 
				},
				//アウトプット用データのオブジェクト
				data:{
				}
		};
	}
	
	/* 
	 * 関数名:setCallbackToEventObject
	 * 概要  :オブジェクト定義時にコールバック関数を登録する
	 * 引数  :Element elem:関数を実行する要素、または関数を実行する要素を持つDOM
	 * 		:String targetKey:関数を実行する要素(変数)名
	 * 		:String callback:コールする関数名
	 * 返却値 :Function:コールする関数を返す
	 * 作成者:T.Masuda
	 * 作成日:2015.08.29
	 */
	 this.setCallbackToEventObject = function(elem, targetKey, callback){
		 //コールバック関数を実行する
		 this.checkEmpty(elem[targetKey])? elem[targetKey][callback]():elem[callback]();
	 }

	 /* 
	  * 関数名:enterKeyButtonClick
	  * 概要  :エンターが押された時に第二引数のボタンをクリックしたイベントを発生させる
	 		ログインダイアログのテキストボックスでエンターキーを押してログイン処理を開始するときや
	 		ユーザ一覧の検索でテキストボックスからエンターキーで検索処理を開始するときなどに使う
	  * 引数  :enterTarget:エンターキーを押したときに対象となるセレクター名
	  *       buttonText:クリックイベントを起こすボタンに表示されているテキスト
	  * 返却値  :なし
	  * 作成者:T.Yamamoto
	  * 作成日:2015.07.10
	 * 変更者:T.Masuda
	 * 変更日:2015.08.29
	 * 内容	:commonクラスに移動しました。
	  */
	 this.enterKeyButtonClick = function(enterTarget, buttonSelector) {
	 	//第一引数の要素にフォーカスしているときにエンターボタンを押すとクリックイベントを発生する
	 	$(enterTarget).keypress(function (e) {
	 		//エンターボタンが押された時の処理
	 		if (e.which == 13) {
	 			//ボタンを自動でクリックし、クリックイベントを起こす
	 			$(buttonSelector).click();
	 		}
	 	});
	 }

	 /*
	  * 関数名:callLoadingScreen
	  * 引数  :なし
	  * 戻り値:なし
	  * 概要  :ローディング画面を表示する。
	  * 作成日:2015.03.02
	  * 作成者:T.Masuda
	 * 変更者:T.Masuda
	 * 変更日:2015.08.29
	 * 内容	:commonクラスに移動しました。
	  */
	 this.callLoadingScreen = function(){
	 		//ローディング画面を出す。
	 		$('.loading').css('display','block');
	 }

	 /*
	  * 関数名:hideLoadingScreen
	  * 引数  :なし
	  * 戻り値:なし
	  * 概要  :ローディング画面を隠す。
	  * 作成日:2015.03.05
	  * 作成者:T.Masuda
	 * 変更者:T.Masuda
	 * 変更日:2015.08.29
	 * 内容	:commonクラスに移動しました。
	  */
	 this.hideLoadingScreen = function(){
	 	//ローディング画面を隠す。
	 	$('.loading').css('display','none');
	 }

	/* 
	 * 関数名:setJsonDataFromArgumentObj
	 * 概要  :受け取ったデータをダイアログのjsonにsetする
	 * 引数  :createTag create_tag:createTagクラスまたは継承クラスのインスタンス
	 * 		:dialogEx dialogClass:dialogExクラスのインスタンス
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.16
	 * 変更者:T.Masuda
	 * 変更日:2015.08.29
	 * 内容	:commonクラスに移動しました。また、createTagを引数に取る様にしました
	 */
	this.setJsonDataFromArgumentObj = function(create_tag, dialogClass){
		//ダイアログを作るクラスで受け取った値を扱いやすくするため変数に入れる
		var argumentObj = dialogClass.getArgumentDataObject();
		//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
		create_tag.json.lessonConfirmContent.lessonConfirm.lessonInfo.timeSchedule[STR_TEXT] 			= buildHourFromTo(argumentObj);			//受講時間
		create_tag.json.lessonConfirmContent.lessonConfirm.lessonInfo.store[STR_TEXT] 					= argumentObj[COLUMN_NAME_SCHOOL_NAME];	//店舗名
		create_tag.json.lessonConfirmContent.lessonConfirm.lessonInfo.course[STR_TEXT]					= argumentObj[COLUMN_NAME_LESSON_NAME];	//授業テーマ
		create_tag.json.lessonConfirmContent.lessonConfirm.lessonInfo.price[STR_TEXT] 					= sumCost(argumentObj);					//受講料
		create_tag.json.lessonConfirmContent.attention.cancelRateValue[COLUMN_LESSON_LEY][VALUE] 	= argumentObj[COLUMN_LESSON_LEY];			//受講授業id(キャンセル)
		create_tag.json.lessonConfirmContent.attention.addPointValue[COLUMN_LESSON_LEY][VALUE] 		= argumentObj[COLUMN_LESSON_LEY];			//受講授業id(加算ポイント)
		//キャンセル料
		create_tag.json.lessonConfirmContent.cancelCharge 
		= create_tag.json.lessonConfirmContent.attention.cancelRateValue[COLUMN_LESSON_LEY][VALUE] * create_tag.json.lessonConfirmContent.lessonConfirm.lessonInfo.price[STR_TEXT] / 100;
	}	 

	/*
	 * 関数名:lessonListDialogSendObject
	 * 引数  :string: calendarDate:日付文字列
	 * 戻り値:object:授業の日付と日付の日本語表示の文字列
	 * 概要  :日付の文字列を受け取り、値としての日付と日本語文字列としての日付をオブジェクトに格納して返す。
	 * 作成日:2015.08.06
	 * 作成者:T.Yamamoto
	 * 修正日:2015.08.15
	 * 修正者:T.Masuda
	 * 内容	:オブジェクトを作って返すだけにしました。$.extendsで統合してください。
	 */
	this.lessonListDialogSendObject = function(calendarDate){
		//ダイアログのタイトルの日付を日本語名にして取得する
		var dialogTitle = changeJapaneseDate(calendarDate);
		//ダイアログの日付データと日本語形式にした日付をを連想配列として返す
		return {lessonDate: calendarDate, dateJapanese:dialogTitle};
	}

	/*
	 * 関数名:allCheckbox
	 * 引数  :var checkboxTarget, var allCheckTarget
	 * 戻り値:なし
	 * 概要  :クリックするとすべてのチェックボックスにチェックを入れる。
	 * 作成日:2015.02.28
	 * 作成者:T.Yamamoto
	 * 変更日:2015.09.20
	 * 変更者:T.Masuda
	 * 内容  :common.jsに移動しました。
	 */
	this.allCheckbox = function(checkboxTarget, allCheckTarget) {
		// 第一引数の要素がクリックされたときの処理
		$(STR_BODY).on(CLICK, checkboxTarget, function() {
			// 第一引数のチェックボックスにチェックが入った時の処理
			if($(checkboxTarget + ':checked').val() == 'on') {
				// 第二引数のチェックボックスにチェックする
				$(allCheckTarget).prop('checked', true);
			// 第一引数のチェックボックスのチェックが外れた時の処理
			} else if ($(checkboxTarget + ':checked').val() == undefined) {
				// 第二引数のチェックボックスのチェックを外す
				$(allCheckTarget).prop('checked', false);
			};
		});
	}
	
	/*
	 * 関数名:showCurrentWindow
	 * 引数  :なし
	 * 戻り値:なし
	 * 概要  :カレントのウィンドウだけ表示する
	 * 作成日:2015.09.22
	 * 作成者:T.Masuda
	 */
	this.showCurrentWindow = function(){
		$('.window').hide();		//全てのウィンドウを消す
		$('.window:last').show();	//カレントのウィンドウのみ表示する
	}

	/* 
	 * 関数名:setValueDBdata
	 * 概要  :連想配列から値を読み込んで、テキストボックスのvalue属性に値を入れる。
	 		会員ページのプロフィール変更で、ユーザの情報をテキストボックスに入れるのに用いる。
	 		テキストボックスのname属性値がDBの列名と対応している。
	 * 引数  :object setArray:テキストボックスに値を挿入するための値が入った連想配列名
	 		setDomParent:取得したvalueをセットするためのdomの親要素セレクター名
	 		targetArrayType:第一引数の連想配列がテーブルから取り出した値なのか、DBのtextキーに入れた値なのかを区別するための引数
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.02
	 * 作成者:T.Masuda
	 * 作成日:2015.09.22
	 * 内容　:common.jsへ移動しました。
	 */
	this.setValueDBdata = function(setArray, setDomParent, targetArrayType) {
		//ループで連想配列を全てループする
		for (var key in setArray) {
			//第二引数の値がkeyTableであるなら、テーブルから取り出した値を対象とするのでその値を変数に入れる
			if (targetArrayType == 'keyTable') {
				//テーブルから取り出した値をキーにして値を取得する
				var resultValue = setArray[key]
			//テーブルの置換済みの値からデータを読み込む場合の処理
			} else if (targetArrayType == 'keyValue') {
				//テーブルの置換済みの値を読み込む
				var resultValue = setArray[key].value;
			//テーブルから取り出した値でないときはtextがキーとなって値を取り出しているのでその値を取得する
			} else {
				//値を挿入する結果のvalueを変数に入れる
				var resultValue = setArray[key]['text'];
			}
			//対象の要素がテキストエリアのときにtextで値を入れる
			if ($(setDomParent + ' [name="' + key + '"]').prop("tagName") == 'TEXTAREA') {
				//name属性がkeyのものに対して属性をDBから読み出した値にする
				$(setDomParent + ' [name=' + key + ']').text(resultValue);
			//値をセットする対象のdomがラジオボタンのときに対象の値に対してチェックを入れる処理をする
			} else if($(setDomParent + ' [name=' + key + ']').attr('type') == 'radio') {
				//値が当てはまるチェックボックスに対してチェックを入れる
				$(setDomParent + ' [name=' + key + '][value="' + resultValue + '"]').prop('checked', true);
			//値をセットする対象のdomがテキストボックスであるならばループ中の値をテキストボックスのデフォルト値に設定する
			} else {
				//name属性がkeyのものに対してvalue属性をDBから読み出した値にする
				$(setDomParent + ' [name=' + key + ']').val(resultValue);
			}
		}
	}

	/* 関数名:sendMemberMail
	 * 概要　:会員ページ 会員メール/目安箱メールを送信する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.07xx
	 * 作成者　:A.Honmura
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:現行のdialogExクラス用に作り直しました。
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:common.jsに移動しました。
	 */
	this.sendMemberMail = function() {
		//はいボタンが押されていたら
		if(this.instance.getPushedButtonState() == YES){
			var data = commonFuncs.getInputData(SEL_SUGGESTION_AREA);		//domからデータを取得する
			var resultwork = null;								//
			var sendUrl = PATH_SEND_MEMBERMAIL_PHP ;	//通常会員メールの送信先PHP
			var sendObject = {									//送信するデータのオブジェクト
					from:parseInt(this.instance.getArgumentDataObject().user_key)	//送信元
					,subject:data.suggest_title		//タイトル
					,content:data.suggest_content	//本文
			}
			
			//メールのタイプの数値で送信先PHP、送信データの構成を変える
			switch(parseInt(data.suggestionRadio)){
			//目安箱メールの場合
			case SUGGESTION_MAIL:
					//目安箱メールならタイプの値を追加する
					$.extend(true, sendObject, {type:data.suggest_type, school:data.school_key});
					//目安箱メール送信用PHPにメールを処理させる
					sendUrl = PATH_SEND_SUGGESTION_PHP;
					break;
			default:break;
			}
			
			$.ajax({					//PHPにメール用データを渡すAjax通信
				url:sendUrl			//PHPのURLを設定する
				,data:sendObject	//送信データのオブジェクト
				,dataType:"json"	//JSON形式でデータをもらう
				,type:"POST"		//POSTメソッドでHTTP通信する
				,success:function(result){		//通信成功時
					resultwork = result;		//通信結果から情報を取り出す
					//送信完了と共に入力ダイアログを消す
					alert(MESSAGE_SEND_SUCCESS_SIMPLE_NOTICE);	//送信完了のメッセージを出す
					//目安箱メールを送信していたら
					//if(parseInt(sendObject.suggestionRadio) == SUGGESTION_MAIL){
						//目安箱テーブルに新たにデータを挿入する
						//new baseDialog().sendQuery(PATH_SAVE_JSON_DATA_PHP, sendObject);
					//}
				}
				//通信失敗時
				,error:function(xhr, status, error){
					//送信完了と共に入力ダイアログを消す
					alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	//送信失敗のメッセージを出す
				}
			});
		}
		
		//確認ダイアログを消す
		this.instance.destroy();
	}
	
	/* 
	 * 関数名:getRestAndReserveData
	 * 概要  :予約可否を踏まえた表示の料金、残席状況、予約可否状況、連結した時限のデータを取得する
	 * 引数  :Array tableData:行データ
	 * 返却値  :Object :残席状況、予約可否状況の配列をまとめたオブジェクト
	 * 作成者:T.Masuda
	 * 作成日:2015.10.04
	 */
	this.getRestAndReserveData = function(tableData, timeTableStudents) {
		var cost;			//料金
		var rest;			//残席
		var lessonStatus;	//予約可否状態
		
		//算出データを受け取る配列を用意する
		var data = [new Array(), new Array(), new Array(), new Array()];

		//各時限ごとの生徒の合計人数が入った連想配列を取得する
		var timeTableStudents = commonFuncs.getTotalStudentsOfTimeTable(tableData);
		
		//各レコードを走査する
		for(var i = 0; i < tableData.length; i++){

			//予約不可状態であれば
			//※管理者画面の予約一覧テーブル用データにはuser_classwork_costはないため、この場合は判定をスキップさせる
			if(commonFuncs.checkEmpty() && !tableData[i][COLUMN_DEFAULT_USER_CLASSWORK_COST]) {
				//料金を空白にする
				cost = EMPTY_STRING;
				//残席を罰にする
				rest = restMarks[0];
				//状況を予約不可にする
				lessonStatus = classworkStatuses[4];
			//ユーザが予約可能な授業の時、料金、残席、状況を適切な形にする
			} else {
				//料金を入れる
				cost = this.sumCost(tableData[i]);
				//状況を入れる
				lessonStatus = commonFuncs.getClassworkStatus(tableData[i], timeTableStudents[tableData[i].start_time]);
				//残席を記号にする
				rest = commonFuncs.getRestMark(tableData[i], timeTableStudents[tableData[i].start_time], lessonStatus);
			}

			//割り出した各データを配列にまとめていく
			//時限
			data[0].push(commonFuncs.buildHourFromTo(tableData[i]));		//時限データを追加する
			data[1].push(cost);			//金額
			data[2].push(rest);			//残席
			data[3].push(lessonStatus);	//予約可否状況
		}

		//作成したデータをオブジェクトにまとめて返す
		return {start_and_end_time : data[0], cost : data[1], rest : data[2], lessonStatus : data[3] };
	};	
	
	/*
	 * 関数名:createTab(selector)
	 * 引数  :String selector
	 * 戻り値:なし
	 * 概要  :タブのコンテンツを作成する。
	 * 作成日:2015.03.17
	 * 作成者:T.Masuda
	 */
	this.createTab = function (selector){
		//タブのコンテンツを作成する。
		$(selector).easytabs({
			updateHash:false	//タブのインデックスをクリックしてもURLのハッシュが変わらないようにする。
		});
	}
	
	/* クッキーを連想配列で取得する関数。http://so-zou.jp/web-app/tech/programming/javascript/cookie/#no5より。 */
	this.GetCookies = function()
	{
	    var result = new Array();

	    var allcookies = document.cookie;
	    if( allcookies != '' )
	    {
	        var cookies = allcookies.split( '; ' );

	        for( var i = 0; i < cookies.length; i++ )
	        {
	            var cookie = cookies[ i ].split( '=' );

	            // クッキーの名前をキーとして 配列に追加する
	            result[ cookie[ 0 ] ] = decodeURIComponent( cookie[ 1 ] );
	        }
	    }
	    //結果を返す。
	    return result;
	}

	//クッキーの削除。http://javascript.eweb-design.com/1404_dc.htmlより。
	this.deleteCookie = function(cookieName) {
	  cName = cookieName + "="; // 削除するクッキー名
	  dTime = new Date();
	  dTime.setYear(dTime.getYear() - 1);
		  document.cookie = cName + ";expires=" + dTime.toGMTString();
	}

	/* 
	 * 関数名:showAdminWindow
	 * 概要  :管理者画面を表示する(現状では会員画面を閉じて管理者画面を表示する時に使う)
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.10.04
	 */
	this.showAdminWindow = function(){
		//管理者画面のウィンドウがあれば
		if(!$('.window[name="admin"]').length){
			//通常サイトのウィンドウから管理者画面のウィンドウを呼び出す
			$('.window[name="usuall"]')[0].instance.callPage('window/admin/page/adminTop.html')
		}
		
		commonFuncs.showCurrentWindow();					//管理者画面を出す
	}
	
	/* 
	 * 関数名:getTodayDate
	 * 概要  :今日の日付を取得する
	 * 引数  :なし
	 * 返却値  :String : 今日の日付の文字列
	 * 作成者:T.Masuda
	 * 作成日:2015.10.31
	 */
	this.getTodayDate = function(){
		//今日の日付を取得する
		var date = new Date();
		//今日の日付を返す
		return 	date.getFullYear() + CHAR_HYPHEN + (date.getMonth() + 1) + CHAR_HYPHEN + date.getDate();
	}
	
	/* 
	 * 関数名:isInvalidDate
	 * 概要  :日付が不正かどうかをチェックする
	 * 引数  :Date date : 任意の日付オブジェクト
	 * 返却値  :Boolean : 判定結果 
	 * 作成者:T.Masuda
	 * 作成日:2015.11.01
	 */
	this.isInvalidDate = function(date){
		//日付が不正かを判定して返す
		return date.toString() === "Invalid Date";
	}
	
	/* 
	 * 関数名:callMemberLessonValue
	 * 概要  :予約中テーブルと予約済みテーブルでセルに値を入れる関数を実行するための関数
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.18
	 * 変更者:T.Masuda
	 * 変更日:2015.11.03
	 * 内容　:commonクラスに移動しました。
	 */
	this.callMemberLessonValue = function(tableName, loopData, counter, rowNumber) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		// 開始日時と終了時刻を組み合わせた値を入れる
		allDay = this.allDateTime(recordData);
		// 料金を求める
		var cost = 0;
		if(recordData[COLUMN_DEFAULT_USER_CLASSWORK_COST] === "") {
			cost = "";
		} else {
			cost = this.sumCost(recordData);
		}
		// ポイントを求める
		var point = 0;
		if(cost) {
			point = this.getPoint(recordData, cost);
		}
		// 開始日時と終了時間を合わせてテーブルの最初のカラムに値を入れる
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(0).text(allDay);
		// 料金の表示を正規の表示にする
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(3).text(cost);
		// ポイントの表示を正規の表示にする
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(4).text(point);
	};
	
	/* 
	 * 関数名:callMemberLessonValue
	 * 概要  :ファイルの拡張子が画像ファイルか、空でないかをチェックする
	 * 引数  :String filePath:値を置換する対象となるテーブルのcssクラス名
	 		 String invalidMessage:ループ対象となるテーブルの行全体の連想配列
	 * 返却値  :Boolean : 判定結果
	 * 作成者:T.Masuda
	 * 作成日:2015.11.03
	 */
	this.checkImageFile = function(filePath, invalidMessage){
		
		var retBoo = true;	//返却値を格納する変数を用意、trueで初期化する
		
		//何も選択されていない場合
		if (!commonFuncs.checkEmpty(filePath)) {
			retBoo = false;	//NG判定となる
		//拡張子チェックを行う。画像の拡張子でなければはじく。
		} else if(!checkIdentifier(filePath)){
			//有効なファイルを選んでもらうように警告を出す。
			alert(invalidMessage);
			retBoo = false;	//NG判定となる
		}
		
		return retBoo;	//判定結果を返す
	}
	
	/* 
	 * 関数名:addCheckbox
	 * 概要  :チェックボックスを追加する
	 * 引数  :selector : チェックボックスをappendするセレクター名
	 		 attrName : チェックボックスのクラス名とname属性名(共通)
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.02
	 * 変更者:T.Masuda
	 * 変更日:2015.11.03
	 * 内容　:commonクラスに移動しました。
	 */
	this.addCheckbox = function(selector, attrName) {
		$('.' + selector).html('<input class="' + attrName + '" type="checkbox" name="' + attrName + '">');
	}
	
	/* 
	 * 関数名:extendMyBlogList
	 * 概要  :マイブログ一覧作成後にチェックボックス列を追加する
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.11.03
	 */
	this.extendMyBlogList = function() {
		//テーブルの1列目をチェックボックスにする
		commonFuncs.addCheckbox('checkWrap', 'check');
		//チェックボックスにチェックが入ったらすべてのチェックボックスに影響を与えるイベントを登録する
		commonFuncs.allCheckbox('.check:eq(0)', '.check');
	}

	/* 
	 * 関数名:setBlogImages
	 * 概要  :マイブログ編集画面読み込み時に記事に設定されている画像を読み込む
	 * 引数  :createTag create_tag : 編集画面のcreateTag
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.11.07
	 */
	this.setBlogImages = function(create_tag){
		//JSONから画像パスを取得する
		var images = [create_tag.json.myBlogContent.image_1.text, create_tag.json.myBlogContent.image_2.text, create_tag.json.myBlogContent.image_3.text];
		var imagesLength = images.length;	//画像数を取得する
		
		//順番に画像パスを画像アップローダーのサムネイル部分にセットしていく
		for (var i = 0; i < imagesLength; i++) {
			
			//画像アップローダーを順次取得する
			var uploader = $('.blogEditImagesSection').eq(i);
			//画像パス用隠しフォームに画像パスをセットする
			$('.blogEditImagesSectionImagePath', uploader).val(images[i]);
			//画像パスが空でなければ
			if(this.checkEmpty(images[i])){
				//サムネイルをセットする
				$('.blogEditImagesSectionImage', uploader).attr('src', IMAGE_PATH + images[i]);
			}
		}
	}
	
	/* 
	 * 関数名:getStartIndex
	 * 概要  :ページングの表示開始行のインデックスを取得する
	 * 引数  :int maxRowNum : 最大表示行数
	 * 　　  :String || Element numberingParent : ナンバリングの親要素 
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.11.08
	 */
	this.getStartIndex = function(maxRowNum, numberingParent){
		
		//ナンバリングの親要素が指定されていれば親からナンバリングのタグを取得する
		var $numbering = this.checkEmpty(numberingParent) ? $('.numbering li', $(numberingParent)) : $('.numbering li');
		//レコードの表示開始番号を算出する。ナンバリングが存在しない状態なら0を返す
		return $numbering.length ? parseInt($numbering.filter('.select').text() - 1) * maxRowNum : 0;
	} 

	/* 
	 * 関数名:createBasicComfirmDialogObject
	 * 概要  :確認ダイアログ用のオブジェクトを作成する
	 * 引数  :Function callback : close時のコールバック関数
	 * 　　  :String title : ダイアログのタイトル 
	 * 　　  :String message : ダイアログのメッセージ 
	 * 返却値  :Object : 作成した確認ダイアログ用のオブジェクト
	 * 作成者:T.Masuda
	 * 作成日:2015.11.08
	 */
	this.createBasicComfirmDialogObject = function(callback, title, message){
		
		//デフォルトのダイアログインプット用オブジェクトを取得する
		var retObj = this.getDefaultArgumentObject();
		//close時のコールバック関数をセットする
		retObj.config.close = callback;
		//ダイアログのタイトルをセットする
		retObj.config.title = title;
		//ダイアログのメッセージをセットする
		retObj.data.message = message;
		
		return retObj;	//作成したオブジェクトを返す
	}
	
	/* 
	 * 関数名:setShowSelectedBlogArticleEvent
	 * 概要  :トップ画面のお知らせウィンドウ(ブログ)の項目をクリックしたらブログページの該当する記事を表示するイベントコールバックを登録する
	 * 引数  :なし
	 * 返却値  :なし
	 * 作成者:T.Masuda
	 * 作成日:2015.11.23
	 */
	this.setShowSelectedBlogArticleEvent = function(){

		//お知らせウィンドウ(ブログ)の項目をクリックしたら
		$('.topicBlog .topicContent').on('click', function(event){
			
			//本来のイベントコールバックをキャンセルし、独自に画面遷移を行う
			event.stopPropagation();
			//選択した項目の番号を取得する
			var index = $('.topicBlog .topicContent').index(this);
			//URLを取得する
			var url = $(this).attr('href');

			//ブログページを読み込んだら
			$.when($(CURRENT_WINDOW)[0].instance.callPage(url))
			//通信終了後
			.done(function(){
				//最新記事一覧から該当する項目を取得する
				var selectedArticle = $('.currentArticleListContent').eq(index);
				//項目内のリンクをクリックする
				$('a', selectedArticle).click();
			});
		});
	}

	/* 関数名:calcCancelCharge
	 * 概要　:キャンセル料を算出する
	 * 引数　:String date : 受講日 
	 * 　　　:int cost :受講料 
	 * 　　　:Array cancelRate :キャンセル料のレートの配列 
	 * 返却値:int : キャンセル料
	 * 作成日　:2015.1212
	 * 作成者　:T.Masuda
	 */
	this.calcCancelCharge = function(date, cost, cancelRate) {
		var cancelCharge = 0;			//受講料
		var today = new Date();			//本日の日付を取得する
		var lessonDay = new Date(date);	//受講日を取得する
		
		//受講日までの日数を計算する
		var dateDiff = this.getDateDiff(today, lessonDay) + 1;
		
		//キャンセル料が発生するなら
		if(dateDiff < cancelRate.length) {
			//キャンセル料を算出する
			cancelCharge = Math.floor(cost * cancelRate[dateDiff] / 100);
		}
		
		console.log(cancelCharge);
		return cancelCharge;	//キャンセル料を返す
	}
	
	this.getDateDiff = function(date1, date2) {
		// getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
		var msDiff = date2.getTime() - date1.getTime();
	 
		// 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
		var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));
		
		return daysDiff;
	}
	
	/* 関数名:getAddAttrObject
	 * 概要　:getInputDataで利用する取得attribute追加の設定のオブジェクトを作る
	 * 引数　:String name : 追加取得対象のフォームパーツのname属性値 
	 * 　　　:String attrName : attribute名 
	 * 　　　:String customName :追加取得するattributeのオブジェクト内でのkey名 
	 * 　　　:Object map :追加する場合に設定するオブジェクト 
	 * 返却値:Object : 設定を格納したオブジェクト
	 * 作成日　:2015.1226
	 * 作成者　:T.Masuda
	 */
	this.getAddAttrObject = function(name, attrName, customName, map) {
		//エントリを追加するオブジェクトを設定する
		var retObj = map ? map : {};
		
		//該当するキーがあれば
		if (name in retObj) {
			//キーに追加を行う
			retObj[name][attrName] = customName;
		//新規に追加する
		} else {
			//最下層のオブジェクトを作る
			var addObj = {};
			//最下層のエントリを作る
			addObj[attrName] = customName;
			//返却用オブジェクトに追加を行う
			retObj[name] = addObj;
		}
		
		//オブジェクトを返す
		return retObj;
	}	

	/* 関数名:checkBeforeEnterAdminPage
	 * 概要　:管理者権限であるかをチェックして、該当しなければ画面を閉じてトップページに戻る
	 * 引数　:String authority : 権限の値 
	 * 　　　:Element currentWindow :ウィンドウのDOM  
	 * 返却値:boolean : 権限のチェック結果
	 * 作成日　:2015.1230
	 * 作成者　:T.Masuda
	 */
	this.checkBeforeEnterAdminPage = function (authority, currentWindow) {
		//判定結果を格納する変数を用意する
		retResult = true;

		//管理者権限でなければ
		if (authority != ADMIN_AUTHORITY) {
			
			retResult = false;	//管理者権限ではなかったという判定をセットする
			
			//警告を出す
			alert(ALERT_NOT_ADMIN_USER_ACCESS);
			 
			//強制ログアウトを行う
			currentWindow.instance.destroy();	//先頭のウィンドウを消す
			commonFuncs.showCurrentWindow();	//最前部のウィンドウのみ表示する
			//トップページへ遷移する
			$(CURRENT_WINDOW)[0].instance.callPage(SHARP + TOPPAGE_NAME);
			//ウィンドウの重なりを調整する
			$(CURRENT_WINDOW)[0].instance.setWindowZIndex();
			//通常画面ウィンドウを表示する
			$(CURRENT_WINDOW)[0].instance.showCurrentWindow();
		}
		
		return retResult;	//判定結果を返す
	}

	/* 
	 * 関数名:getLastValue
	 * 概要  :対象となる文字列を区切り文字で区切り、最後に来る部分を返す
	 * 引数  :String value : 対象となる文字列
	 * 　　  :String delimiter : 区切り文字
	 * 作成者:T.Masuda
	 * 作成日:2015.0110
	 */
	this.getLastValue = function(value, delimiter) {
		//対象となる文字を区切る
		var valueArray = value.split(delimiter);
		//区切った数を調べる
		var valueLength = valueArray.length;
		//区切った文字の最後の部分を返す
		return valueArray[valueLength - 1];
	}
	/* 関数名:getCurrentDirectory
	 * 概要　:カレントのディレクトリを取得する
	 * 引数　:なし
	 * 返却値:String : カレントディレクトリ
	 * 作成日　:2015.0104
	 * 作成者　:T.Masuda
	 */
	this.getCurrentDirectory = function () {
		//現在のフルパスを取得する
		var currentLocation = location.href;
		//フルパスを配列にする
		var pathArray = currentLocation.split(SLASH);
		
		//パスにファイル名が含まれていたら
		if (currentLocation.match(/\./) ) {
			pathArray.pop();	//ファイル名部分の要素を削除する
		}

		//パスの配列を文字に変換してカレントディレクトリのパスを作る
		var dirPath = pathArray.join(SLASH);
		
		return dirPath;	//カレントディレクトリのパスを返す
	}
	
//ここまでクラス定義領域
}

//どこでも当暮らすインスタンスを使えるように、共通関数クラスインスタンスをこの場(当JSファイル読み込みの最後)で生成する
commonFuncs = new common();

/*
 * 関数名:sendArticleData
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :記事を投稿する
 * 作成日 :2015.11.07
 * 作成者 :T.M
 */
function sendArticleData(){
	
	//ダイアログのクラスインスタンスを取得する。
	var dialogClass = $(this)[0].instance;				//ダイアログのクラスインスタンスを取得する

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();		//インプット用データを取得する
		
		//フォームデータを取得する
		var sendObject = commonFuncs.createFormObject('.blogEdit');
		//ユーザIDをオブジェクトにセットする
		sendObject.user_key = data.create_tag.getUserId();
		//記事IDをオブジェクトにセットする
		sendObject.id = articleNumber;
		
		//新規作成であれば
		if(articleNumber == 0){
			//INSERT用クエリをセットする
			sendObject.db_setQuery = data.create_tag.json.insertMyBlog.db_setQuery;
		//編集であれば
		} else {
			//UPDATE用クエリをセットする
			sendObject.db_setQuery = data.create_tag.json.updateMyBlog.db_setQuery;
		}
		
		//データを送信する
		var result = this.dialogBuilder.sendQuery(URL_SAVE_JSON_DATA_PHP, sendObject);
		//データの保存に成功していれば
		if(parseInt(result.message)){
			alert(SEND_TO_SERVER_MESSAGE);					//メッセージを出す
			//マイブログページに戻る
			$(CURRENT_WINDOW)[0].instance.callPage('window/member/page/memberMyBlog.html');
		//失敗であれば
		} else {
			//その旨を伝える
			alert('記事の保存に失敗しました。時間をおいてお試しください。');
		}
	}

	//ダイアログを破棄する
	dialogClass.destroy();
}	
