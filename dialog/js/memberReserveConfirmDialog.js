/* ファイル名:memberReserveListDialog.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberReserveListDialog.js
 */

/* クラス名:memberReserveListDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/memberReserveListDialog.js
 */
function memberReserveListDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
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
		this.setLessonDataToJSON(RESERVE_LIST_JSON);

		//取得したデータが0のときダイアログを開いても閉じ,データがあるならそのままダイアログを開く
		if (!this.getTableData(LESSON_TABLE)) {
			//授業の予約データがないことをダイアログに表示する
			dialogClass.setAlertContents(ERROR_LESSONLIST);
			//ダイアログを閉じるときは破棄するように設定する
			dialogClass.setCallbackCloseOnAfterOpen(dialogClass.destroy);
			return;		//処理を終える
		}

		//画面パーツ作成に必要なHTMLテンプレートを取得する
		this.create_tag.getDomFile(RESERVE_LIST_HTML);

		this.dispContentsMain(dialogClass);		//ダイアログ中部
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
	this.dispContentsMain = function(dialogClass){
		var data = dialogClass.getArgumentDataObject();			//dataオブジェクトを取得する
		
		//ダイアログの中身の外枠を作る
		this.create_tag.outputTag('memberInfomation', 'memberInfomation', CURRENT_DIALOG_SELECTOR);
		//予約可能授業一覧テーブルの外側の領域を作る
		this.create_tag.outputTag(TABLE_OUTER, TABLE_OUTER, '.memberInfomation')
		
		//予約できる授業のデータ一覧テーブルを作る
		this.create_tag.outputTagTable(LESSON_TABLE, LESSON_TABLE, DOT + TABLE_OUTER);
		//テーブルの値をクライアント側で編集して画面に表示する
		commonFuncs.tableReplaceAndSetClass(LESSON_TABLE, LESSON_TABLE_REPLACE_FUNC, true, this.create_tag, LESSON_TABLE_RECORD);
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
		//レッスンのステータス領域を作る
		this.create_tag.outputTag('lessonStatus', 'lessonStatus', '.memberInfomation');

		//予約授業一覧テーブルをクリックしたときに予約確認ダイアログを表示するイベントを登録する
		this.create_tag.openMemberReservedConfirmDialog();
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
		//dbに接続する前に会員番号をクエリの置換連想配列に挿入する
		this.create_tag.json.lessonTable.user_key.value = data.userId;
	}
	
	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		//新たにオブジェクトを作り、親ダイアログから引き継いだargumentObjの内容をセットする
		var argumentObj = $.extend(true, {}, this.dialogExOptionSampleChild.argumentObj);
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
