
/* 
 * ファイル名:memberPage.js
 * 概要  :会員トップページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberPage.js
 */

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
	creator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	//セレクトボックスのvalueを画面に表示されている値にする
	creator.setSelectboxValue('.selectThemebox');
	//絞り込み機能を実装する
	finshedLessonTableThemeSelect();
}

/*
 * 関数名:finshedLessonTableAfterPaging
 * 概要  :会員トップ、受講済みテーブルでページングボタンがクリックされた時にテーブルの値を置換する処理を行う
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
		//デフォルトのクエリを保存して変化後のクエリを基に戻せるようにする
		var defaultQuery = creator.json.finishedLessonTable.db_getQuery;
		//テーブルを作るためのクエリを置換する
		creator.replaceTableQuery('finishedLessonTable');
		//ページングに使うものを初期化し、ページングを作り直すために備える
		creator.pagingReset('finishedLessonTable');
		//クエリを発行してDBから対象のデータの受講済み授業一覧のデータを取り出す
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json.finishedLessonTable, 'finishedLessonTable');
		//ページング機能付きで受講済みテーブルを作り直す
		creator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	});
}

