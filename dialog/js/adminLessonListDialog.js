/* ファイル名:adminLessonListDialog.js
 * 概要　　　:管理者、授業一覧ｄダイアログ
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

	var dialogClass = this.dialog[0].instance;		//ダイアログのクラスインスタンスを取得する

	//新規にダイアログを作るためのボタンの配列
	this.button = [
		{	//はいボタン
			text:'新規作成',
			//クリック時のコールバック関数
			click:function(){
				//子のダイアログを開く
				this.dialogBuilder.openDialog(ADMIN_LESSON_CREATE_DIALOG);
			}
		}
	];

	/* 関数名:constructionContent
	 * 概要　:JSONやHTMLをcreateLittleContentsクラスインスタンスにロードする。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.constructionContent = function(){
		//主に分岐処理を行うためにtry catchブロックを用意する
		try{
			//授業データ一覧ダイアログのテンプレートを取得する
			this.create_tag.getDomFile(ADMIN_LESSON_DETAIL_DIALOG_HTML);
			//授業データを取得するのに必要なデータをargumentObjから取得してcreateLittleContetnsのJSONにセットする
			this.getJson();
			//取得したJSONを加工する
			this.customizeJson();
		//例外時処理
		}catch(e){
			//予約一覧のレコードが取得できなかったら
			if(e instanceof cannotGetAnyRecordException){
				//もう一度例外を投げ、dispContents内で処理する
				throw new cannotGetAnyRecordException();
			}
		}
	};

	/* 関数名:getJson
	 * 概要　:必要なjsonデータをクリエイトタグのインスタンスに格納する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 */
	this.getJson = function() {
		//授業一覧ダイアログのjsonデータを取得する
		this.create_tag.getJsonFile(ADMIN_LESSON_DETAIL_DIALOG_JSON);
		//授業一覧データをDBから取得する
		this.create_tag.getJsonFile(URL_GET_JSON_ARRAY_PHP, this.create_tag.json[LESSON_TABLE], LESSON_TABLE);
	}

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
		var tableData = this.create_tag.json[LESSON_TABLE][TABLE_DATA_KEY];
		//時限ごとの人数を取り出す
		var timeTableStudents = commonFuncs.getTotalStudentsOfTimeTable(tableData);
		//jsonに加工した値を入れる(customizeAdminLessonTableは関数名、レコードの加工データをjsonに追加する。);
		commonFuncs.customizeTableData(tableData, this.customizeAdminLessonTable, timeTableStudents);
	};

	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		try{
			//画面を表示する準備をする
			this.constructionContent();
		//レコードが取得できていなければ
		}catch (e){
			//ダイアログをアラートのダイアログに変える
			this.showAlertNoReserve();
		}
		
		//ダイアログのタイトルをセットする
		this.dispContentsHeader(dialogClass);
		this.dispContentsMain(dialogClass);		//ダイアログ中部
		this.dispContentsFooter(dialogClass);	//ダイアログ下部
	}


		//取得したデータが0のときダイアログを開いても閉じ,データがあるならそのままダイアログを開く
		if (this.getTableData(LESSON_TABLE)) {
			this.dispContentsMain(dialogClass);		//ダイアログ中部
		}
		this.dispContentsFooter(dialogClass);	//ダイアログ下部
	
	/* 関数名:dispContentsHeader
	 * 概要　:画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(dialogClass){
		//ダイアログのタイトルを変更する
		this.setDialogTitle(dialogClass);
	}
	
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
		this.create_tag.outputTag('lessonStatus', 'lessonStatus', CURRENT_DIALOG_SELECTOR);
	}

	/* 関数名:createTable
	 * 概要　:授業一覧のテーブルを作る
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 */
	this.createTable = function() {
				//データがなければテーブルは作らない
		if(this.create_tag.json.[LESSON_TABLE][TABLE_DATA_KEY].length != 0) {
			//授業一覧テーブルの外側の領域を作る
			this.create_tag.outputTag('tableArea', 'tableArea', CURRENT_DIALOG_SELECTOR);
			//授業のデータ一覧テーブルを作る
			this.create_tag.outputTagTable(LESSON_TABLE, LESSON_TABLE, '.tableArea');
		}
	}

	/* 関数名:dispContentsFooter
	 * 概要　:画面パーツ設定用関数のフッター部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsFooter = function(dialogClass){
		//予約授業一覧テーブルをクリックしたときに予約確認ダイアログを表示するイベントを登録する
		// this.create_tag.openAdminLessonDetailDialog();
		//新規に授業を作成するためのボタンを作る
		this.setDialogButtons(this.button);
		//ダイアログを閉じるときは破棄するように設定する
		dialogClass.setCallbackCloseOnAfterOpen(dialogClass.destroy);
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
	}
	

	/* 関数名:setDialogTitle
	 * 概要　:画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogTitle = function(dialogClass){
		//ダイアログ生成時に渡されたインプット用データを取得する
		var data = dialogClass.getArgumentDataObject();
		//タイトルを入れ替える
		this.setDialogTitle(data.dateJapanese);
	}

	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		//ダイアログのインスタンスを変数に入れて扱いやすくする
		var dialogClass = $(CURRENT_DIALOG_SELECTOR)[0].instance;
		var data = dialogClass.getArgumentObject();	//argumentObjを取得する
		
		//新規授業追加ダイアログに渡す変数を作る
		var sendObject = {
			//日本語名の日付を渡すデータを入れる(DBの形式をそろえるためスラッシュはハイフンに置き換える)
			lessonData:data.data.lessonDate.replace(/\//g,"-"),
			//テーブルのデータをセットする
			tableData:this.create_tag.json[LESSON_TABLE][TABLE_DATA_KEY]
		};
		//ダイアログのタイトルをセットして予約日を分かりやすくする
		dialogExOption[ADMIN_LESSON_CREATE].argumentObj.config[TITLE] = argObj.config[TITLE];

		//新たにオブジェクトを作り、親ダイアログから引き継いだargumentObjの内容をセットする
		var argumentObj = $.extend(true, {}, dialogExOption[ADMIN_LESSON_CREATE].argumentObj);

		//sendObjectとダイアログオプションのオブジェクトとcreateLittleContentsクラスインスタンスを統合する
		$.extend(true, argumentObj.data, sendObject, {creat_tag:this.create_tag});
		//openイベントを設定する
		$.extend(true, argumentObj.config, {open:commonFuncs.callOpenDialog});
		//このダイアログのdialogExクラスインスタンスを子へ渡すオブジェクトに追加する
		$.extend(true, argumentObj.data, {parentDialogEx:this.dialog[0].instance});
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
		if(recordData[COLUMN_NAME_LESSON_NAME] !="" && recordData[COLUMN_NAME_SCHOOL_NAME] != "") {
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

}

//継承の記述
adminLessonListDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonListDialog.prototype.constructor = baseDialog;

