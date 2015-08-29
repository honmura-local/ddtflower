/* ファイル名:adminLessonListDialog.js
 * 概要　　　:管理者ページ 授業一覧ダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonListDialog.js
 */

/* クラス名:adminLessonListDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonListDialog.js
 */
function adminLessonListDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする

	/* 関数名:getJson
	 * 概要　:必要なjsonデータをクリエイトタグのインスタンスに格納する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:テーブルのデータを共通関数クラスの関数で取得するようにしました
	 */
	this.getJson = function() {
		//管理者ページ 授業一覧ダイアログのjsonデータを取得する
		this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_LIST_DIALOG_HTML);
		//授業データを取得する
		commonFuncs.setLessonDataToJSON(this[DIALOG_CLASS], this[VAR_CREATE_TAG]);
	}

	/* 関数名:getDom
	 * 概要　:createTag用テンプレートHTMLを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.getDom = function(){
		//授業データ一覧ダイアログのテンプレートを取得する
		this[VAR_CREATE_TAG].getDomFile(TMP_CREATE_TABLE);
		this[VAR_CREATE_TAG].getDomFile(TMP＿TABLE_AREA);
		this[VAR_CREATE_TAG].getDomFile(TMP_LESSON_STATUS);
	};

	/* 関数名:customizeJson
	 * 概要　:constructionContentで取得したJSONの加工を行う。オーバーライドして定義されたし
			この中で使っている関数はjs/customizeTableData.js で定義されているものを使う
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 */
	this.customizeJson = function(){
		//テーブルのデータを連想配列に入れる
		var tableData = this[VAR_CREATE_TAG].json[LESSON_TABLE][TABLE_DATA_KEY];
		
		//時限ごとの人数を取り出す
		var timeTableStudents = commonFuncs.getTotalStudentsOfTimeTable(tableData);
		//jsonに加工した値を入れる(customizeAdminLessonTableは関数名、レコードの加工データをjsonに追加する。);
		commonFuncs.customizeTableData(tableData, this.customizeAdminLessonTable, timeTableStudents);
	};

	/* 関数名:dispContentsMain
	 * 概要　:画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		//授業一覧のテーブルを作る
		this.createTable();
		//レッスンのステータス領域を作る
		this[VAR_CREATE_TAG].outputTag(LESSON_STATUS, LESSON_STATUS, CURRENT_DIALOG_SELECTOR);
	}

	/* 関数名:createTable
	 * 概要　:授業一覧のテーブルを作る
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:テーブルの行数を取得するコードを関数化しました。
	 */
	this.createTable = function() {
		//データがなければテーブルは作らない
		if(commonFuncs.getTableJsonLength(this[VAR_CREATE_TAG], LESSON_TABLE) != 0) {
			//授業一覧テーブルの外側の領域を作る
			this[VAR_CREATE_TAG].outputTag(TABLE_OUTER, TABLE_OUTER, CURRENT_DIALOG_SELECTOR);
			//授業のデータ一覧テーブルを作る
			this[VAR_CREATE_TAG].outputTagTable(LESSON_TABLE, LESSON_TABLE, DOT+TABLE_OUTER);
		}
	}

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//新規に授業を作成するためのボタンを作る
		this.setDialogButtons(this.createNew);
		//ダイアログの位置を修正する
		this.setDialogPosition(POSITION_CENTER_TOP);
	}


	/* 関数名:setCallback
	 * 概要　:ダイアログのイベントコールバックを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setCallback(){
		//テーブルの行をクリックイベントに対し授業詳細ダイアログを開くコールバック関数を登録する
		this.setCallbackRowClick();
	}

	/* 関数名:callbackCreateNew
	 * 概要　:新規作成ボタンのコールバック関数
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.callbackCreateNew = function(){
		//ボタンが押されたときの状態の値を設定する。
		this[DIALOG_CLASS].setPushedButtonState(CREATE_NEW_LESSON);
		this.openDialog(URL_ADMIN_NEW_LESSON_DIALOG);	//授業新規作成ダイアログを開く
	}

	/* 関数名:setCallbackRowClick
	 * 概要　:テーブルの行をクリックした時のイベントのコールバック関数を設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.setCallbackRowClick = function() {
		//当クラスインスタンスをイベントコールバック内で使える用に変数に格納する
		var thisElem = this;	
		//ダイアログの内のテーブルの行をクリックしたときのコールバック関数をセットする
		$(this[DIALOG_CLASS].dom).on(CLICK, STR_TR, function(){
			//行番号を引数にコールバック関数を呼び出す
			thisElem.callbackRowClick($(this).parent().children().index(this));
		});
	};
	
	/* 関数名:callbackRowClick
	 * 概要　:テーブルの行をクリックした時のイベントのコールバック関数
	 * 引数　:int rowIndex:行番号
	 * 返却値:なし
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.callbackRowClick = function(rowIndex) {
		//ダイアログの状態を表すオブジェクトを取得する
		var returnStatusObj = this[DIALOG_CLASS].getReturnStatusObject();
		//取得したオブジェクトにクリックした行の番号をセットする
		returnStatusObj[CLICKED_ROW] = rowIndex;
		//ボタンが押されたときの状態の値を設定する。
		this[DIALOG_CLASS].setPushedButtonState(EDIT_LESSON);
		
		this.openDialog(URL_ADMIN_LESSON_DETAIL_DIALOG);	//授業詳細ダイアログを開く
	};
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		//当該ダイアログが生成されたときに渡されたインプット用データオブジェクトを取得する
		var argumentObj = commonFuncs.createCloneObject(this[DIALOG_CLASS].getArgumentObject());
		//returnObjに格納された押されたボタンの値を取得する
		var pushedButtonState = this[DIALOG_CLASS].getPushedButtonState();
		
		//授業が新規で作成されるなら
		if(pushedButtonState == CREATE_NEW_LESSON_VALUE){
			//新規作成用のデータを取得してまとめる
			$.extend(argumentObj, this.getNewLessonData(), {callback:newLessonEntry});
		//既存の授業を編集する場合は
		} else {
			//クリックした行番号を取得するため、returnObjを取得する
			var returnObj = this[DIALOG_CLASS].getReturnStatusObject();
			//既存の授業のデータを取得してまとめる
			$.extend(argumentObj, this.getEditLessonObject(returnObj[CLICKED_ROW]), {lessonData:this.getDetailLessonDialogArgData()});
		}
		
		return argumentObj;	//生成したオブジェクトを返す
	}

	/* 
	 * 関数名:customizeAdminLessonTable
	 * 概要  :管理者、授業一覧テーブルの値必要な値をクライアント側で設定してjsonに入れる
	 * 引数  :tableName:値を加工する対象となるテーブルのjsonデータ
	 		 counter:カウンタ変数。加工する行を識別するのに使う
	 		 timeTableStudents:時限ごとに予約している生徒の数
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.16
	 */
	this.customizeAdminLessonTable = function(tableData, counter, timeTableStudents) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		var recordData = tableData[counter];
		//レッスンテーマ名または店舗名が空であるならばその行を飛ばす
		if(recordData[COLUMN_NAME_LESSON_NAME] !=EMPTY_STRING && recordData[COLUMN_NAME_SCHOOL_NAME] != EMPTY_STRING) {
			// 開始日時と終了時刻を組み合わせた値を入れる
			var timeSchedule = buildHourFromTo(recordData);
			//状況を入れる
			var  lessonStatus = getClassworkStatus(recordData, timeTableStudents);
			//残席を記号にする
			var  rest = getRestMark(recordData, timeTableStudents);
			//取得したデータをjsonに入れていく
			tableData[counter][START_END_TIME]	= timeSchedule;	//時間割開始と終了時刻
			tableData[counter][LESSON_STATUS]	= lessonStatus;	//レッスンの開講状況ステータス
			tableData[counter][LESSON_REST]		= rest;			//レッスン残席記号
		}
	};

	/* 関数名:getDetailLessonDialogArgData
	 * 概要　:授業詳細ダイアログを開くためのarguObjectを取得する。
	 		授業詳細ダイアログで必要になるのはクリックされた行のデータ。
	 * 引数　:clickThis:テーブルに行をクリックしたときのイベントのthis
	 		:dialogInstance:ダイアログのインスタンス
	 * 返却値:return returnArgObject
	 * 作成日　:2015.08.22
	 * 作成者　:T.Yamamoto
	 */
	this.getDetailLessonDialogArgData = function(clickThis, dialogInstance) {
		//授業一覧のダイアログのデータを取得し、次のダイアログを渡すのに使う
		var argumentObj = dialogInstance.dialogClass.getArgumentObject();
		//クリックしたセルの行番号を取得する
		var rowNum = $(CURRENT_DIALOG_SELECTOR + SPACE + STR_TR).index(clickThis) - 1;
		//次のダイアログに渡すデータを変数に入れる
		var tableData = dialogInstance[VAR_CREATE_TAG].json[LESSON_TABLE][TABLE_DATA_KEY][rowNum];
		//セットするargObjectを作成して返す
		return $extend(true, {}, argumentObj, tableData);
	}
	
	/* 関数名:getCreateLessonDialogArgData
	 * 概要　:新規授業作成ダイアログを開くためのarguObjectを取得する
	 		新規授業作成ダイアログで必要になる値は授業一覧テーブルにある全ての値
	 * 引数　::dialogInstance:ダイアログのインスタンス	 		
	 * 返却値:Object:ダイアログの作成に必要なオブジェクト
	 * 作成日　:2015.08.22
	 * 作成者　:T.Yamamoto
	 */
	 this.getCreateLessonDialogArgData = function(dialogInstance) {
	 	//授業一覧のダイアログのデータを取得し、次のダイアログを渡すのに使う
		var argumentObj = dialogInstance.dialogClass.getArgumentObject();
		//次のダイアログに渡すデータを変数に入れる
		var tableData = dialogInstance[VAR_CREATE_TAG].json[LESSON_TABLE][TABLE_DATA_KEY];
		//ダイアログの作成に必要なオブジェクトを作成して返す
		return $extend(true, {}, argumentObj, tableData);
	}

	 /* 
	  * 関数名:getNewLessonData
	  * 概要  :管理者、授業詳細タブで新規に授業を授業を登録するときに必要となる、授業日と時限idを取得する
	  * 引数  :なし
	  * 返却値  :なし
	  * 作成者:T.Yamamoto
	  * 作成日:2015.08.23
	  */
	 this.getNewLessonData = function() {
	 	var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
	 	//時限データを入れる変数を作り、すでにある時限についてはこの変数を使うようにする
	 	var timeTableDayKey = "";
	 	//授業一覧のデータを長さを取得し、ループが終わる回数として使う
	 	var loopEndCount = data[TABLE_DATA_KEY].length;
	 	//受け取った授業一覧データから時限データを探す
	 	for(var loopStartCount = 0; loopStartCount < loopEndCount; loopStartCount++) {
	 		//新規授業作成データの時限データが見つかった時の処理
	 		if(newLesoonData[COL_TIMETABLE_KEY] == data[TABLE_DATA_KEY][loopStartCount][COL_TIMETABLE_KEY] && data[TABLE_DATA_KEY][loopStartCount][COL_TIME_TABLE_DAY_KEY] != "") {
	 			//時限データを取得し、ループを終える
	 			timeTableDayKey = data[TABLE_DATA_KEY][loopStartCount][COL_TIME_TABLE_DAY_KEY];
	 			//ループを終わらせる
	 			break;
	 		}
	 	}
	 	
	 	//新しく授業データを作るために授業日を連想配列に入れて返す
	 	return {
	 		lessonDate:data.lessonDate,				//受講日
	 		time_table_day_key:timeTableDayKey 	//授業時限キー
	 	};
	 }

	 /* 
	  * 関数名:newLessonEntry
	  * 概要  :管理者、授業詳細タブで新規に授業をDBに登録する処理。新規作成ボタンのコールバック関数となる
	  * 引数  :
	  * 返却値  :なし
	  * 作成者:T.Yamamoto
	  * 作成日:2015.08.03
	  * 修正日　:2015.08.09
	  * 修正者　:T.Masuda
	  * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
	  */
	 this.newLessonEntry = function(){
	 	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	 	
	 	//押されたボタンをチェックする
	 	switch(dialogClass.getPushedButtonState()){
	 	//はいボタンが押されていたら
	 	case YES:
		 		//新しく授業データを作るために授業日を連想配列に入れる
		 		var lessonData = getNewLessonData();
		 		//授業の設定内容を首都kする
		 		var lessonConfig = getInputData(CLASS_LESSON_DATA);
		 		//新しく授業データを挿入するために日付データを含めて送信する
		 		var sendReplaceQuery = $.extend(true, {}, lessonData, lessonConfig);
		 		
		 		//時限データが空のときは新規時限データを作成し、そのあとに授業データを作成する
		 		if(timeTableDayKey == EMPTY_STRING) {
		 			//時限データテーブルに対してinsert処理を行い、次の授業データを新しく作るための準備をする
		 			var errorCount = dialogClass.creator.setDBdata(dialogClass.creator.json.insertTimeTableDay, sendReplaceQuery, EMPTY_STRING);
		 			//失敗件数が0でないなら授業データを新しく作るクエリを発行する
		 			if (errorCount != 0) {
		 				//新規に授業のデータをDBに登録する
		 				dialogClass.creator.setDBdata(dialogClass.creator.json.newClassWork, sendReplaceQuery, '新規授業の作成に成功しました。');
		 			}
		 			//予約する時限があった時にそれを使って新規授業を作成する
		 		} else {
		 			//すでにある時限データを使って授業データを作る
		 			dialogClass.creator.setDBdata(dialogClass.creator.json.normalInsertClasswork, sendReplaceQuery, '新規授業の作成に成功しました。');
		 		}
		 	}
	 	}

}

//継承の記述
adminLessonListDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonListDialog.prototype.constructor = baseDialog;

