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

	/* 関数名:dispContents
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.dispContents = function(){
		var dialogClass = this.dialog[0].instance;		//ダイアログのクラスインスタンスを取得する
		
		//ダイアログのタイトルをセットする
		this.dispContentsHeader(dialogClass);
		//授業データを取得するのに必要なデータをargumentObjから取得してcreateLittleContetnsのJSONにセットする
		this.setLessonDataToJSON(ADMIN_LESSON_LIST_DIALOG_JSON);
		//取得したデータが0のときダイアログを開いても閉じ,データがあるならそのままダイアログを開く
		if (this.getTableData(LESSON_TABLE)) {
			this.dispContentsMain(dialogClass);		//ダイアログ中部
		}
		this.dispContentsFooter(dialogClass);	//ダイアログ下部
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
	}

	/* 関数名:getTableData
	 * 概要　:サーバからテーブルのデータを取得し、中身が空かどうかのチェックを行う。
	 * 引数　:String tableName:テーブルのJSONのキー
	 * 返却値:boolean:テーブルのデータがあるかどうかを判定して返す
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.getTableData = function(tableName){
		//予約できる授業のデータ一覧をDBから取得してテーブルを作る準備をする
		this.create_tag.getJsonFile(URL_GET_JSON_ARRAY_PHP, this.create_tag.json[tableName], tableName);
		//予約データが取得できていたらtrue、そうでなければfalseを返す
		return this.create_tag.json[tableName][TABLE_DATA_KEY].length != 0? true: false;
	}

	
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
		//画面パーツ作成に必要なHTMLテンプレートを取得する
		this.create_tag.getDomFile(ADMIN_LESSON_LIST_DIALOG_HTML);
		//授業一覧のテーブルを作る
		this.createTable();
		//テーブルの値をクライアント側で編集して画面に表示する
		// commonFuncs.tableReplaceAndSetClass(LESSON_TABLE, LESSON_TABLE_REPLACE_FUNC, true, this.create_tag, LESSON_TABLE_RECORD);
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
		//授業一覧テーブルの外側の領域を作る
		this.create_tag.outputTag('tableArea', 'tableArea', CURRENT_DIALOG_SELECTOR);
		//授業のデータ一覧テーブルを作る
		this.create_tag.outputTagTable(LESSON_TABLE, LESSON_TABLE, '.tableArea');
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
	
	/* 関数名:setLessonDataToJSON
	 * 概要　:授業のデータをcerateTagのJSONにセットする
	 * 引数　:String jsonPath:jsonファイルのパス
	 * 返却値:なし
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.setLessonDataToJSON = function(jsonPath){
		//このダイアログ用のJSONファイルを取得する
		this.create_tag.getJsonFile(jsonPath);
		//ダイアログのdataオブジェクトを取得する
		var data = this.dialog[0].instance.getArgumentDataObject();
		//dbに接続する前に日付をクエリの置換連想配列に挿入する
		this.create_tag.json.lessonTable.lessonDate.value = data.lessonDate;
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
}

//継承の記述
memberReserveListDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
memberReserveListDialog.prototype.constructor = baseDialog;

