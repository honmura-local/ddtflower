
/* 
 * ファイル名:memberPage.js
 * 概要  :会員トップページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberPage.js
 */

/** クラス名:memberPage
 * 概要　:会員トップページ汎用関数クラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0920
 * 作成者:T.Yamamoto
 */
function memberPage(){
	//テーブルクリックからの予約キャンセル処理

	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.15
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function(clickRowData, create_tag) {
		//新たにオブジェクトを作り、親ダイアログから引き継いだargumentObjの内容をセットする
		var argumentObj = $.extend(true, {}, commonFuncs.getDefaultArgumentObject());
		//子ダイアログに渡すオブジェクトを生成する
		$.extend(true, argumentObj.data,							//元データ
				clickRowData.data,										//クリックした行データ
				{callback:this.registerReserved},					//子ダイアログclose時のコールバック関数
				{create_tag:create_tag}
		);
		argumentObj.config.title = changeJapaneseDate(clickRowData.data[COLUMN_NAME_LESSON_DATE]);
		return argumentObj;	//生成したオブジェクトを返す
	}
	

	/* 関数名:openCancelDialog
	 * 概要　:テーブルの行をクリックした時のイベントのコールバック関数(内容はオーバーライドして定義されたし)
	 * 引数　:Element clicked:クリックされた行の要素
	 * 返却値:なし
	 * 作成日　:2015.09.12
	 * 作成者　:T.Yamamoto
	 */
	this.openCancelDialog = function(clicked, memberNumber, create_tag) {
		//クリックした行の番号とデータを取得する。様々なところで使い回せるため、メンバに保存する
		var recordData = this.getClickTableRecordData(clicked, RESERVED_LESSON_TABLE, RESERVED_LESSON_TABLE_RECORD, create_tag);
		//キャンセルダイアログに値を渡すためのデータを作る
		var argumentObj = this.setArgumentObj(recordData, create_tag);
		//予約キャンセルダイアログのURLをセットする
		dialogUrl = HTML_MEMBER_RESERVE_CANCEL_DIALOG;
		//openイベントはsetArgumentObjでセットしておく
		var newDialog = new dialogEx(dialogUrl, argumentObj);
		//openイベントのコールバック関数をセットする
		newDialog.run();	//ダイアログを開く
		newDialog.setCallbackCloseOnAfterOpen(this.cancelExecute);
	}

	/*
	 * 関数名:getClickTableRecordData
	 * 概要　:クリックされたテーブルの行にある連想配列のデータを取得する。
	 		使い方としてクリックイベントの中で使う
	 * 引数　:string:クリック対象セレクタ
	 		string:tableName:データ取得対象のテーブルクラス名
	 		string:clickRecordClassName:クリックされたレコードのクラス名
	 		create_tag:creator:クリエイトタグインスタンス名
	 * 返却値:object:returnObject:取得したデータの結果
	 * 作成日　:2015.09.12
	 * 作成者　:T.Yamamoto
	 */
	this.getClickTableRecordData = function(clickTarget, tableName, clickRecordClassName, create_tag) {
		//クリックされた行番号を取得する。見出しの行は除外する
		var rowNum = $(DOT + tableName + TAG_CHILD_TR).filter(SEL_NO_TABLE_FIRST_ROW).index(clickTarget);
		//次イアログに渡すデータを変数に入れる
		var recordObject = create_tag.json[tableName][TABLE_DATA_KEY][rowNum];
		//取得したデータを返却する
		return returnObject = {
			data:recordObject		//クリックされた行のデータ
		}
	}

	/* 関数名:cancelUpdateJson
	 * 概要　:サーバへクエリを投げる前に、送信するJSONデータを加工する
	 * 引数　:baseDialog dialogBuilder:ダイアログ専用クラスインスタンス
	 * 返却値:Object:DB更新用データをまとめたオブジェクトを返す
	 * 作成日　:2015.09.12
	 * 作成者　:T.Yamamoto
	 */
	this.cancelUpdateJson = function(dialogClass, create_tag){
		//インプット用データオブジェクトを取り出す
		var retObj = commonFuncs.createCloneObject(dialogClass.getArgumentDataObject());
		//クエリをセットする
		retObj[KEY_DB_SETQUERY] = create_tag.json.cancelReservedData.db_setQuery;
		//ダイアログ専用クラスインスタンスがdialogExクラスインスタンスを通じてデータを取り出す
		return retObj;
	};
	
	/* 関数名:registerReserved
	 * 概要　:DBにデータを送信して授業の予約を行う
	 * 引数　:dialogClass:ダイアログのインスタンス
	 		create_tag:クリエイトタグのインスタンス
	 		dialogBuilder:baseDialogのインスタンス
	 * 返却値:なし
	 * 作成日　:2015.0823
	 * 作成者　:T.Masuda
	 */
	this.registerReserved = function(dialogClass, create_tag, dialogBuilder){
		//予約確認、またはキャンセルダイアログを破棄する
		dialogClass.destroy();
		//押されたボタンで処理を分岐させる
		switch(dialogClass.getPushedButtonState()){
			//はいボタンが押されたパターン
			case YES:
				//DB更新用JSONをまとめる
				var sendObject = this.cancelUpdateJson(dialogClass, create_tag);
				//クエリを発行してキャンセル処理を行う
				dialogBuilder.sendQuery(URL_SAVE_JSON_DATA_PHP, sendObject);
				//予約中授業一覧テーブルを更新する
				create_tag.tableReload(RESERVED_LESSON_TABLE);
				//キャンセルに応じた通知のアラートを出す
				alert(LESSON_CANCEL_TEXT);
				break;	//switchを抜ける
			default:break;	//switchを抜ける
		}
	}

	/* 関数名:cancelExecute
	 * 概要　:予約キャンセル処理を実行する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0912
	 * 作成者　:T.Yamamoto
	 */
	this.cancelExecute = function() {
		//キャンセル処理を実装する
		memberPageFuncs.registerReserved(this.instance, this.instance.argumentObj.data.create_tag, this.dialogBuilder);
	}

	/* 
	 * 関数名:cancelDialogOpenFromReservedTable
	 * 概要  :予約キャンセルダイアログを予約済み授業から開くための関数
	 * 引数  :int memberInfo:会員番号
	 * 　　  :create_tag :createLittleContentsクラスインスタンス
	 * 返却値  :なし
	 * 作成日　:2015.0912
	 * 作成者　:T.Yamamoto	 
	 */
	this.cancelDialogOpenFromReservedTable =  function(memberInfo, create_tag) {
		var thisElem = this;
		//予約中授業テーブルの行がクリックされたときに予約キャンセルダイアログを出す処理
		$(STR_BODY).on(CLICK, DOT + RESERVED_LESSON_TABLE_RECORD , function(){
			//キャンセルダイアログを開く
			thisElem.openCancelDialog(this, memberInfo, create_tag);
		});
	}

}	//クラス定義ここまで

//どこでも当クラスインスタンスを使えるように、共通関数クラスインスタンスをこの場(当JSファイル読み込みの最後)で生成する
memberPageFuncs = new memberPage();


/* 
 * 関数名:createMemberFinishedLessonContent
 * 概要  :会員ページの受講済み授業タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createMemberFinishedLessonContent() {
	//受講済み授業の絞り込み領域を作る
	creator.outputTag('selectTheme', 'selectTheme', '#finishedLesson');
	//受講済みテーブルページングの一番外側となる領域を作る
	creator.outputTag('finishedLessonPagingArea', 'divArea', '#finishedLesson');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('finishedLessonTableOutside', 'divArea', '.finishedLessonPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter', 'numberingOuter', '.finishedLessonPagingArea');
	//受講済み授業一覧のデータを取り出す
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json['finishedLessonTable'], 'finishedLessonTable');
	//ページング機能付きでメルマガテーブルを作る
	creator.outputNumberingTag('finishedLessonTable', NUMBERING_START, NUMBERING_PAGE, NUMBERING_DEFAULT, NUMBERING_DISPLAY, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	//授業の絞り込み機能を実装する
	setConfigFinishedLesson()
}

/* 
 * 関数名:setConfigFinishedLesson
 * 概要  :受講済み授業タブの設定を行う。
 		設定内容は授業の絞り込み機能
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function setConfigFinishedLesson() {
	//セレクトボックスのvalueを画面に表示されている値にする
	creator.setSelectboxValue('.selectThemebox');
	//絞り込み機能を実装する
	finshedLessonTableThemeSelect();
}

/*
 * 関数名:finshedLessonTableAfterPaging
 * 概要  :会員トップ、受講済みテーブルでページングボタンがクリックされた時や
 		テーマでの絞り込み機能でテーブルをリロードした後にテーブルの値を置換する処理を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableAfterPaging() {
	//受講済みテーブルを編集が終わるまで表示しなくする
	$('.finishedLessonTable').hide();
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		//ページングの処理を行う件数を取得するためにページングの現在のページを取得する
		var nowPageNumber = Number($('.select').text() - 1);
		//テーブルのデータを取得する
		var tableRow = creator.json.finishedLessonTable[TABLE_DATA_KEY];
		//テーブルの値を編集するループを開始する値を取得する
		var loopStartCount = nowPageNumber * 10;
		//テーブルのレコード数を取得する
		var recordCount = Number(tableRow.length);
		//今のページングの値が最大値なら行数の最大値、違うならページングの最後の行の値をループの終わり値とする
		var loopEndCount = loopEndCount >= recordCount ? recordCount-1 : nowPageNumber * 10 + 9;
		//テーブルのループのための行番号を取得する
		var rowNumber = 1;
		//ループで受講済みテーブルを編集する
		for(loopStartCount; loopStartCount<=loopEndCount; loopStartCount++) {
			//テーブルの値を置換する
			callMemberLessonValue('.finishedLessonTable', tableRow, loopStartCount, rowNumber);
			//行番号をインクリメントして次の行についてのループに備える
			rowNumber++;
		}
		//受講済みテーブルを表示する
		$('.finishedLessonTable').show();
	},1);
}

/*
 * 関数名:finshedLessonTableThemeSelect
 * 概要  :会員top、受講済み授業一覧のテーブルをテーマのセレクトボックスが変更されたときに変換するイベントを登録する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableThemeSelect() {
	//ページングがクリックされた時のイベントを登録する
	$(STR_BODY).on(CHANGE, '#finishedLesson .selectThemebox', function() {
		//テーブルを作るためのクエリを置換する
		creator.replaceTableQuery('finishedLessonTable');
		//ページングに使うものを初期化し、ページングを作り直すために備える
		creator.pagingReset('finishedLessonTable');
		//クエリを発行してDBから対象のデータの受講済み授業一覧のデータを取り出す
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json.finishedLessonTable, 'finishedLessonTable');
		//ページング機能付きで受講済みテーブルを作り直す
		creator.outputNumberingTag('finishedLessonTable', NUMBERING_START, NUMBERING_PAGE, NUMBERING_DEFAULT, NUMBERING_DISPLAY, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	});
}

