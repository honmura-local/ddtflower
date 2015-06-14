var classworkStatuses = {
		0:"予約可能"
		,1:"開催済み"
		,2:"中止"
		,3:"中止"
};

var userClassworkStatuses = {
	0:"予約"
	,1:"予約"
	,2:"受付"
	,3:"受講済み"
	,10:"キャンセル(本人)"
	,11:"キャンセル(管理者)"
	,12:"中止"
};

var restMarks = {
	0:"×"
	,1:"△"
	,4:"○"
	,7:"◎"
};

var noLongerBookable = "予約締切";

var fullHouse = "満席";

/*
* 授業のステータスを表す文字列を取得する
* @param mixed timeTableRows 授業情報を(1時間割分全部)格納した連想配列
* @return int timeTableStudents 時間割全体の予約人数
*/ 
function getTotalStudentsOfTimeTable(timeTableRows) {
	var students = 0;
	for (var key in timeTableRows) {
		students += timeTableRows[key].students;
	}
	return students;
}

/**
 * 授業が中止かどうか判定する
 * @param string 授業ステータス
 * @return bool 中止かどうか
 */ 
function isCanceled(classworkStatus) {
	var classworkCancelStatus = new Array(3,2)
	if($.inArray(classworkStatus, arr) >= 0) {
		return true;
	}
	return false;
}

/**
 * 授業が開催済かどうか判定する
 * @param string 授業ステータス
 * @return bool 開催済かどうか
 */ 
function hasDone(classworkStatus) {
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
function isExist(rowData, target) {
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
function getRestOfSheets(rowData, timeTableStudents) {
	isExist(rowData, "max_num");
	var maxNum = rowData["max_num"];	//最大人数(時間割)
	isExist(rowData, "max_students");
	var maxStudents = rowData["max_students"];	//最大人数(授業コマ)
	isExist(rowData, "students");
	var students = rowData["students"];	// 現予約人数
	
	var timeTableRest = max_num - students;	// 時間割としての残り
	var classworkRest = maxStudents - rowData['students'];	// 授業コマとしての残り
	
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
 function isFull(rowData, timeTableStudents) {
	if(getRestOFSheets(rowData, timeTableStudents <= 0)) {
		return true;
	}
	return false;
}

/**************************共通jsに移したら消しといて**************************
function toDateYYYY-MM-DD(dateStr) {
	var dateArr = dateStr.split("-");
	return new Date(dateArr[0]-0,dateArr[1]-1,dateArr[2]-0);
}

/**
 * Dateオブジェクトと加算日からn日後、n日前を求める関数
 * @param date 操作対象の日付
 * @param int addDays 加算日。マイナス指定でn日前も設定可能
 * @return 求まったdateオブジェクト
 */
function computeDate(date, addDays) {
    var baseSec = date.getTime();
    var addSec = addDays * 86400000; // 日数 * 1日のミリ秒数
    var targetSec = baseSec + addSec;
    date.setTime(targetSec);
    return date;
}
/**************************共通jsに移したら消しといて**************************/

function isBookable(rowData) {
	isExist(rowData, "lesson_date");
	var lessonDateStr = rowData["lesson_date"];	// レッスン日
	var lessonDate = toDateYYYY-MM-DD(lessonDateStr);
	isExist(rowData, "stop_order_date");
	var stopOrderDate = rowData["stop_order_date"];	// 締切日数
	isExist(rowData, "today");
	var todayStr = rowData["today"];	// 今日
	var today = toDateYYYY-MM-DD(todayStr);
	
	// レッスン日の締切日数前を過ぎてたら締切
	var limitDate = computeDate(lessonDate, -1 * stopOrderDate);
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
function getClassworkStatus(rowData, timeTableStudents) {
	// 授業コマステータス中止は問答無用で"中止"を表示
	isExist(rowData, "classwork_status");
	var classworkStatus = rowData["classwork_status"];
	if(isCanceled(classworkStatus)) {
		return classworkStatuses[classworkStatus];
	}
	
	// 予約ステータス取得 
	isExist(rowData, "user_work_status");
	var userClassworkStatus = rowData["user_work_status"];
	
	// 授業終了時の判断
	if(hasDone(classworkStatus)) {
		if(userClassworkStatus) {
			return userClassworkStatuses[userClassworkStatus];
		}
		return classworkStatuses[classworkStatus];
	}
	
	if(isFull(rowData)) {
		return fullHouse;
	}
	
	// 締め切られてないかの判断
	if(isBookable(rowData)) {
		if(userClassworkStatus) {
			return userClassworkStatuses[userClassworkStatus];
		}
		return classworkStatuses[classworkStatus];
	}
	
	return noLongerBookable;	// 締切リターン
}

/*
* 授業の残席を表す文字を取得する
* @param mixed rowdata 授業情報を格納した連想配列
* @param int timeTableStudents 時間割全体の予約人数
* @return string 残席文字
*/ 
function getRestMark(rowData, timeTableStudents) {
	var rest = getRestOfSheets(rowData, timeTableStudents);
	var restMark = "";
	for(var key in restMarks) {
		if(key > rest) {
			break;
		}
		restMark = restMarks[key];
    }
	return restMark;
}

function buildHourFromTo(rowData) {
	return rowData["start_time"] + "-" + rowData["end_time"];
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
function backThreeStringDelete(rowData, columnName) {
	// 第一引数の連想配列に対して、第二引数の値を返却結果変数に入れる
	var resultString = rowData[columnName];
	// 値の後ろから3文字削除した文字列を結果の変数に入れる
	resultString = resultString.substr(0, (resultString.length-3));
	// 結果の文字列を返す
	return resultString;
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
function buildHourFromToEx(rowData) {
	var start_time = backThreeStringDelete(rowData, 'start_time');
	var end_time = backThreeStringDelete(rowData, 'end_time');
	var result = start_time + '-' + end_time;
	return result;
}

/* 
 * 関数名:tableColumnValueInput
 * 概要  :データベースから取り出した値を関数を使ってセルの値を入れ直す
 * 引数  :tableName:セルの値を入れるテーブル名
 		:columnName:テーブルの列名(連想配列のキー名)
 		:array:配列名
 		:functionName:実行関数名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.06.13
 */
function tableColumnValueInput(tableName, columnNumber, array, functionName) {
	// カウンターを作る
	var counter = 1;
	// 結果の変数をあらかじめ作る
	var result;
	// テーブルのすべての行に対してループで値を入れる
	$.each(array, function() {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		var arrayValue = array[counter];
		// テーブルの値から取り出し、編集した結果を変数resultに入れる
		result = buildHourFromToEx(arrayValue);
		// 第一引数のテーブルの行番号と列番号を指定して、結果のテキストをセルに入れる
		$(tableName + ' tr:eq(' + counter + ') td').eq(columnNumber).text(result);
		// 関数に1を足す
		counter++;
	});
}

