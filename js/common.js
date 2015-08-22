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

//授業状況
this.classworkStatuses = {
		0:"予約可能"
		,1:"開催済み"
		,2:"中止"
		,3:"中止"
		,4:"予約不可"
};

//授業情報補足
this.noLongerBookable = "予約締切";
this.fullHouse = "満席";

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

this.classworkCostColumns = [
	'user_classwork_cost'
	,'user_classwork_cost_aj'
	,'flower_cost'
	,'flower_cost_aj'
	,'extension_cost'
];

this.defaultClassworkCostColumns = [
	'default_user_classwork_cost'
	,'default_flower_cost'
];

	
	/** クラス名:theFunc
	 * 概要　:コピペ用関数
	 * 引数	:なし
	 * 作成日:2015.0813
	 * 作成者:T.Masuda
	 */
	this.theFunc = function(){
		
	}

//ここからテーブル加工記述

	/* 
	 * 関数名:getTotalStudentsOfTimeTable
	 * 概要  :時間割ごとの生徒の合計人数を求める
	 * 引数  :rowData:テーブルのデータ配列
	 * 返却値:時間ごとの合計人数が入った連想配列
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.23
	 */
	 this.getTotalStudentsOfTimeTable = function(rowData) {
		//カウンターを作る
		var counter = 0;
		//時限の値を変数に入れる
		var lessonTime = rowData[counter][COLUMN_NAME_START_TIME];
		//生徒の数を連想配列に入れる
		var students = {};
		//生徒の数を0で初期化する
		students[lessonTime] = 0;

		//取り出した行の数だけループする
		$.each(rowData, function() {
			// 時限が同じときは合計の変数に足す
			if(lessonTime === rowData[counter][COLUMN_NAME_START_TIME]) {
				// 合計の変数に値を足す
				students[lessonTime] += Number(rowData[counter][COLUMN_NAME_ORDER_STUDENTS]);
			// 違う時限になった時の処理
			} else {
				// 時限の値を変数に入れる
				lessonTime = rowData[counter][COLUMN_NAME_START_TIME];
				//生徒の数を0で初期化する
				students[lessonTime] = 0;
			}
			//カウンタ変数をインクリメントする
			counter++;
		});
		// 生徒の合計人数を返す
		return students;
	};

	/**
	 * 授業が中止かどうか判定する
	 * @param string 授業ステータス
	 * @return bool 中止かどうか
	 */ 
	this.isCanceled = function(classworkStatus) {
		// 授業が中止するかどうかを見るための配列を作る
		var classworkCancelStatus = new Array(3,2);
		// 授業ステータスがキャンセルならtrueを返す
		 if($.inArray(classworkStatus, classworkCancelStatus) >= 0) {
			// if(classworkCancelStatus.indexOf(classworkStatus == -1)) {
			return true;
		}
		return false;
	}

	/**
	 * 授業が開催済かどうか判定する
	 * @param string 授業ステータス
	 * @return bool 開催済かどうか
	 */ 
	this.hasDone = function(classworkStatus) {
		// 授業が開催済みであればtrueを返す
		if(classworkStatus == 1) {
			return true;
		}
		return false;
	}

	/**
	 * 連想配列に引数のキーがあるかどうか確認する
	 * なかったら例外を吐く
	 * @param mixed rowdata 授業情報を格納した連想配列
	 * @param string target ターゲットのkey
	 */ 
	this.isExist = function(rowData, target) {
		// 連想配列にtargetのkeyがなければ例外を投げる
		if(!target in rowData) {
			throw new Error("can't select status. no " + target);
		}
	}

	/**
	 * 授業コマの残席を算出する
	 * @param mixed rowdata 授業情報を(1時間割分全部)格納した連想配列
	 * @param int timeTableStudents 時間割全体の予約人数
	 * @return int 残席数
	 */ 
	this.getRestOfSheets = function(rowData, timeTableStudents) {
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
		var classworkRest = maxStudents - students;	// 授業コマとしての残り
		// 時間割としてのが授業コマとしての数以下であるなら時間割基準の人数を返す
		if(timeTableRest <= classworkRest) {
			return timeTableRest;
		}
		return classworkRest;
	}

	/**
	 * 満席かどうか判定する
	 * @param mixed rowdata 授業情報を格納した連想配列
	 * @return bool 満席かどうか
	 */ 
	 this.isFull = function(rowData, timeTableStudents) {
	 	// 残席が0以下であればtrueを返す
		if(this.getRestOfSheets(rowData, timeTableStudents) <= 0) {
			return true;
		}
		return false;
	}

	/**
	 * Dateオブジェクトと加算日からn日後、n日前を求める関数
	 * @param date 操作対象の日付
	 * @param int addDays 加算日。マイナス指定でn日前も設定可能
	 * @return 求まったdateオブジェクト
	 */
	this.computeDate = function(date, addDays) {
	    var baseSec = date.getTime();
	    var addSec = addDays * 86400000; // 日数 * 1日のミリ秒数
	    var targetSec = baseSec + addSec;
	    date.setTime(targetSec);
	    return date;
	}

	this.isBookable = function(rowData) {
		this.isExist(rowData, COLUMN_NAME_LESSON_DATE);
		var lessonDateStr = rowData[COLUMN_NAME_LESSON_DATE];	// レッスン日
		var lessonDate = new Date(lessonDateStr);
		this.isExist(rowData, COLUMN_NAME_STOP_ORDER_DATE);
		var stopOrderDate = rowData[COLUMN_NAME_STOP_ORDER_DATE];	// 締切日数
		this.isExist(rowData, COLUMN_NAME_TODAY);
		var todayStr = rowData[COLUMN_NAME_TODAY];	// 今日
		var today = new Date(todayStr);
		
		// レッスン日の締切日数前を過ぎてたら締切
		var limitDate = this.computeDate(lessonDate, -1 * stopOrderDate);
		if(today.getTime() >= limitDate.getTime()) {
			return false;
		}
		return true;
	}

	/*
	* 授業のステータスを表す文字列を取得する
	* @param mixed rowdata 授業情報を格納した連想配列
	* @param int timeTableStudents 時間割全体の予約人数
	* @return string ステータス文字列
	*/ 
	this.getClassworkStatus = function(rowData, timeTableStudents) {
		if (rowData[COLUMN_NAME_MAX_NUM] == 0) {
			return this.classworkStatuses[2];
		}
		// 授業コマステータス中止は問答無用で"中止"を表示
		this.isExist(rowData, COLUMN_NAME_CLASSWORK_STATUS);
		// 授業の状態を変数に入れる
		var classworkStatus = rowData[COLUMN_NAME_CLASSWORK_STATUS];
		// 授業が中止であるなら中止であることの結果を返す
		if(this.isCanceled(classworkStatus)) {
			return this.classworkStatuses[classworkStatus];
		}
		
		// 予約ステータス取得 
		this.isExist(rowData, COLUMN_NAME_USER_WORK_STATUS);
		var userClassworkStatus = rowData[COLUMN_NAME_USER_WORK_STATUS];
		
		// 授業終了時の判断
		if(this.hasDone(classworkStatus)) {
			if(userClassworkStatus) {
				return this.userClassworkStatuses[userClassworkStatus];
			}
			return thid.classworkStatuses[classworkStatus];
		}
		
		if(this.isFull(rowData, timeTableStudents)) {
			return fullHouse;
		}
		
		// 締め切られてないかの判断
		if(this.isBookable(rowData)) {
			if(userClassworkStatus) {
				return this.userClassworkStatuses[userClassworkStatus];
			}
			return this.classworkStatuses[classworkStatus];
		}
		
		return this.noLongerBookable;	// 締切リターン
	}

	/*
	* 授業の残席を表す文字を取得する
	* @param mixed rowdata 授業情報を格納した連想配列
	* @param int timeTableStudents 時間割全体の予約人数
	* @return string 残席文字
	*/ 
	this.getRestMark = function(rowData, timeTableStudents) {
		var rest = this.getRestOfSheets(rowData, timeTableStudents);
		var restMark = "";
		if (lessonStatus == '予約締切' || 
			rowData[COLUMN_NAME_MAX_NUM] == 0 ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == 1 ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == 2 ||
			rowData[COLUMN_NAME_CLASSWORK_STATUS] == 3) {
			restMark = this.restMarks[0];
		} else {
			for(var key in restMarks) {
				if(key > rest) {
					break;
				}
				restMark = this.restMarks[key];
			}
		}
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

	/*
	 * 1行中の各料金の合計を得る
	 * @param rowData mixed 対象の列
	 * @return int 料金合計
	 */
	this.sumCost = function(rowData) {
		this.isExist(rowData, COLUMN_USER_CLASSWORK_COST);
		// 予約済でないならデフォルトの値を使う
		if(rowData[COLUMN_USER_CLASSWORK_COST] === "") {
			return this.getDefaultCost(rowData);
		}
		
		var result = 0;
		for (var i = 0; i < this.classworkCostColumns.length; i ++) {
			this.isExist(rowData, this.classworkCostColumns[i]);
			result += Number(rowData[classworkCostColumns[i]]);
			
		}
		return result;
	};

	/*
	 * 1行中の各デフォルト料金の合計を得る
	 * @param rowData mixed 対象の列
	 * @return int デフォルト料金合計
	 */
	this.getDefaultCost = function(rowData) {
		var result = 0;
		for (var i = 0; i < this.defaultClassworkCostColumns.length; i ++) {
			this.isExist(rowData, this.defaultClassworkCostColumns[i]);
			result += Number(rowData[defaultClassworkCostColumns[i]]);
		}
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
	 */
	this.buildHourFromTo = function(rowData) {
		// 時間割の始まりの時間を求める
		var start_time = this.backThreeStringDelete(rowData, COLUMN_NAME_START_TIME);
		// 時間割の終わりの時間を求める
		var end_time = this.backThreeStringDelete(rowData, COLUMN_NAME_END_TIME);
		// 時間割の結果を求める
		var resultTimeschedule = start_time + '-' + end_time;
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
		result += ' ';
		//時間の後ろ3文字を消す(12:00:00の「:00」を削除する)
		result += this.buildHourFromTo(rowData);
		//結果を返す
		return result;
	};

	/* 
	 * 関数名:callReservedLessonValue
	 * 概要  :会員側予約テーブルについてデータベースから取り出した値を入れる関数をコールする
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.callReservedLessonValue = function(tableName, loopData, counter, rowNumber, timeTableStudents) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		// 開始日時と終了時刻を組み合わせた値を入れる
		timeSchedule = this.buildHourFromTo(recordData);
		var cost;			//料金
		var rest;			//残席
		// var lessonStatus;	//状況
		//ユーザが予約不可の授業のとき、行の値を網掛けにして予約不可であることを示す。
		if(!recordData[COLUMN_DEFAULT_USER_CLASSWORK_COST]) {
			//料金を空白にする
			cost = "";
			//残席を罰にする
			rest = this.restMarks[0];
			//状況を予約不可にする
			lessonStatus = this.classworkStatuses[4];
		//ユーザが予約可能な授業の時、料金、残席、状況を適切な形にする
		} else {
			//料金を入れる
			cost = this.sumCost(recordData);
			//状況を入れる
			lessonStatus = this.getClassworkStatus(recordData, timeTableStudents);
			//残席を記号にする
			rest = this.getRestMark(recordData, timeTableStudents);
		}
		//残席がバツのときにはクリックできないことを分かりやすくするために行の背景をグレーにする
		if(rest == this.restMarks[0]) {
			//行の色をグレーっぽくする
			$(tableName + ' tr:eq(' + rowNumber + ')').css('background', '#EDEDED');
		}
		// 開始日時と終了時間を合わせてテーブルの最初のカラムに値を入れる
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(0).text(timeSchedule);
		// 料金の表示を正規の表示にする
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(3).text(cost);
		// 残席の表示を正規の表示にする
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(4).text(rest);
		// 残席の表示を正規の表示にする
		$(tableName + ' tr:eq(' + rowNumber + ') td').eq(5).text(lessonStatus);
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
	 * 関数名:callAdminReservedLessonValue
	 * 概要  :会員側予約テーブルについてデータベースから取り出した値を入れる関数をコールする
	 * 引数  :tableName:値を置換する対象となるテーブルのcssクラス名
	 		 loopData:ループ対象となるテーブルの行全体の連想配列
	 		 counter:カウンタ変数
	 		 rowNumber:行番号
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.07.07
	 */
	this.callAdminReservedLessonValue = function(tableName, loopData, counter, rowNumber, timeTableStudents) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		recordData = loopData[counter];
		//レッスンテーマ名または店舗名が空であるならばその行を表示しなくする
		if(recordData[COLUMN_NAME_LESSON_NAME] =="" || recordData[COLUMN_NAME_SCHOOL_NAME] == "") {
			//授業情報があいまいなものは表示しないクラスを取得する
			$(tableName + ' tr:eq(' + rowNumber + ')').addClass('displayNone');
		//しっかりとした授業情報があれば表示する
		} else {
			// 開始日時と終了時刻を組み合わせた値を入れる
			timeSchedule = this.buildHourFromTo(recordData);
			//状況を入れる
			lessonStatus = this.getClassworkStatus(recordData, timeTableStudents);
			//残席を記号にする
			rest = this.getRestMark(recordData, timeTableStudents);
			// 開始日時と終了時間を合わせてテーブルの最初のカラムに値を入れる
			$(tableName + ' tr:eq(' + rowNumber + ') td').eq(0).text(timeSchedule);
			// 残席の表示を正規の表示にする
			$(tableName + ' tr:eq(' + rowNumber + ') td').eq(3).text(rest);
			// 残席の表示を正規の表示にする
			$(tableName + ' tr:eq(' + rowNumber + ') td').eq(4).text(lessonStatus);
		}
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
		if(recordData.lesson_name == "") {
			//クラスappendSelectboxをつけてアペンド対象であることを分かりやすくする
			$(tableName + ' tr:eq(' + rowNumber + ') td').eq(2).addClass('appendSelectbox');
		}
	};

	/* 
	 * 関数名:dbDataTableReplaceExecute
	 * 概要  :dbから取り出したテーブルについてクライアント側で置換させる
	 * 引数  :
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.13
	 */
	this.dbDataTableReplaceExecute = function(tableName, rowData, func, timeTableStudents) {
		// カウンターを作る
		var counter = 0;
		// テーブルの行番号
		var rowNumber = 1;
		// テーブルのすべての行に対してループで値を入れる
		$.each(rowData, function() {
			// テーブルの値を変える関数をコールする
			eval(func)(tableName, rowData, counter, rowNumber, timeTableStudents);
			// 行番号をインクリメントする
			rowNumber++;
			// カウンタ変数をインクリメントする
			counter++;
		});
	}

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

	/* 
	 * 関数名:customizeReserveLessonListTable
	 * 概要  :会員トップページ、予約授業一覧テーブルのjsonに対して加工を行い、
	 		加工後のデータをjsonにセットする
	 * 引数  :tableName:値を加工する対象となるテーブルのjsonデータ
	 		 counter:カウンタ変数。加工する行を識別するのに使う
	 		 timeTableStudents:時限ごと受講生徒数
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.15
	 */
	this.customizeReserveLessonTable = function(tableData, counter, timeTableStudents) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		var recordData = loopData[counter];
		// 開始日時と終了時刻を組み合わせた値を入れる
		var timeSchedule = this.buildHourFromTo(recordData);
		var cost,			//料金
			rest,			//残席
		 	lessonStatus;	//状況
		//ユーザが予約不可の授業のとき、行の値を網掛けにして予約不可であることを示す。
		if(!recordData[COLUMN_DEFAULT_USER_CLASSWORK_COST]) {
			//料金を空白にする
			cost = "";
			//残席を罰にする
			rest = this.restMarks[0];
			//状況を予約不可にする
			lessonStatus = this.classworkStatuses[4];
		//ユーザが予約可能な授業の時、料金、残席、状況を適切な形にする
		} else {
			//料金を入れる
			cost = this.sumCost(recordData);
			//残席を記号にする
			rest = this.getRestMark(recordData, timeTableStudents);
			//状況を入れる
			lessonStatus = this.getClassworkStatus(recordData, timeTableStudents);
		}
		//取得したデータをjsonに入れていく
		tableData[counter][COLUMN_START_END_TIME]	= timeSchedule;		//時間割開始と終了時刻
		tableData[counter][SUM_COST]				= cost;				//受講料
		tableData[counter][COLUMN_LESSON_REST]		= rest;				//残席
		tableData[counter][COLUMN_LESSON_STATUS]	= lessonStatus;		//予約ステータス
	};

	/* 
	 * 関数名:customizeMemberLessonTable
	 * 概要  :予約中テーブルと予約済みテーブルのjsonに置換後の値を入れる
	 * 引数  :tableName:値を加工する対象となるテーブルのjsonデータ
	 		 counter:カウンタ変数。加工する行を識別するのに使う
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.15
	 */
	this.customizeMemberLessonTable = function(tableData, counter) {
		//加工を行う行のデータを変数に入れる
		var recordData = tableData[counter];
		//年月日と開始日時と終了時刻を組み合わせた値を入れる
		var lesson_date_time = allDateTime(recordData);
		//料金を求めるために0で初期化する
		var cost = sumCost(recordData);
		//ポイントを求める
		var point = getPoint(recordData, cost);
		//取得したデータをjsonに入れていく
		tableData[counter][LESSON_DATE_TIME]	= lesson_date_time;		//時間割開始と終了時刻
		tableData[counter][SUM_COST]			= cost;					//レッスン合計受講料
		tableData[counter][LESSON_POINT]		= point;				//授業加算ポイント
	};
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
			success:function(sc){			//通信成功時
				console.log("got script");	//成功判定を変数に入れる
			},
			error:function(a,b,c){			//通信失敗時
				//失敗のログを出す
				console.log(GET_SCRIPT_FAIL_MESSAGE_FRONT + scriptUrl + PARENTHESES_REAR);
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
	this.tableReplaceAndSetClass = function(tableName, tableReplaceFunc, replaceBool, create_tag, recordClassName) {
		//予約可能授業一覧を置換する
		this.dbDataTableValueReplace(tableName, tableReplaceFunc, replaceBool, create_tag);
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
	this.dbDataTableValueReplace = function(tableName, replaceFuncName, lessonList, creator) {
		//テーブルを置換が終えるまで画面に表示しなくする
		$(DOT + tableName).hide();
		//時間差で表現するためにsetTimeOutを使う
	//	setTimeout(function(){
			//置換を行うテーブルのデータを取得する
			var tableData = creator.json[tableName][TABLE_DATA_KEY];
			//第三引数がtrueなら授業受講者人数を求めた上で関数を実行する
			if(lessonList) {
				//時間割1限分の生徒の合計人数が入った連想配列を作る
				var timeStudentsCount = getTotalStudentsOfTimeTable(tableData);
				//テーブルの値を置換する
				dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, timeStudentsCount);
			} else {
				//テーブルの値を置換する
				dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, '');
			}
	//	},1);
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
	this.dbDataTableReplaceExecute = function(tableName, rowData, func, timeTableStudents) {
		// カウンターを作る
		var counter = 0;
		// テーブルの行番号
		var rowNumber = 1;
		// テーブルのすべての行に対してループで値を入れる
		$.each(rowData, function() {
			// テーブルの値を変える関数をコールする
			eval(func)(tableName, rowData, counter, rowNumber, timeTableStudents);
			// 行番号をインクリメントする
			rowNumber++;
			// カウンタ変数をインクリメントする
			counter++;
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
	 * 関数名:function makeFailedAlertString(list, jpNameMap)
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
				 var errorList = replaceJpName(lists[key], jpNameMap);
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
	 */
	this.setLessonDataToJSON = function(dialog, create_tag){
		//ダイアログのdataオブジェクトを取得する
		var data = dialog.getArgumentDataObject();
		//dbに接続する前に日付をクエリの置換連想配列に挿入する
		create_tag.json.lessonTable.lessonDate.value = data.lessonDate;
		//dbに接続する前に会員番号をクエリの置換連想配列に挿入する
		create_tag.json.lessonTable.user_key.value = data.userId;
	}
	
	
	/* 関数名:getTableJsonLength
	 * 概要　:createTag(createLittleContents)クラスインスタンスのテーブル用JSONの行数を取得する
	 * 引数　:createLittleContents create_tag:createLittleContentsクラスインスタンス
	 * 		:String tableName:テーブルのJSONのキー
	 * 返却値:int:テーブルの行数を返す
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.getTableJsonLength(create_tag, tableName){
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
	this.createCloneObject(object){
		//オブジェクトのクローンを作成して返す
		return $.extend(true, {}, object);
	}
	
	/* 
	 * 関数名:getInputData
	 * 概要  :テキストボックスとセレクトボックスとテキストエリアのデータを取得し、
	        :クラス名をkey、入っている値をvalueの連想配列にして返す
	 * 引数  :string selector:値を走査したい親のセレクター名
	 * 返却値  :Object:入力データの結果連想配列
	 * 作成者:T.Yamamoto
	 * 作成日:2015.06.27
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:共通で使えるためcommon.jsに移動しました。また、セレクタをクラスに限定しないようにしました
	 */
	this.getInputData = function(selector) {
		var $form = $(selector);	//処理対象の親要素を取得する
		//結果の変数を初期化する
		var retMap = {};
		//inputタグ、セレクトタグ、テキストエリアタグの数だけループする
		$(SEL_INPUT_DATA , $form).each(function() {
			//入力データのname属性を取得する
			var name = $(this).attr(NAME);
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
				retMap[name] = valueData;
			}
		});
		//結果を返す
		return retMap;
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
			,dataType:"json"	//JSON形式でデータをもらう
			,type:"POST"		//POSTメソッドでHTTP通信する
			,success:function(result){		//通信成功時
				//メール送信が行われていれば
				if(result == EMPTY_STRING || parseInt(result.sendCount) > 0){
					//送信完了と共に入力ダイアログを消す
					alert(message);	//送信完了のメッセージを出す
					retBoo = true;	//成功判定にする
				//メール送信が失敗していれば
				} else {
					//送信失敗のメッセージを出す
					alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	
				}
			}
			//通信失敗時
			,error:function(xhr, status, error){
				//送信失敗のメッセージを出す
				alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	
			}
		});
		
		return retBoo;	//判定を返す
	}
	
	
	
	
//ここまでクラス定義領域
}