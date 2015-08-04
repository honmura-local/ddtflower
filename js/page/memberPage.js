
/* 
 * ファイル名:memberPage.js
 * 概要  :会員トップページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberPage.js
 */

console.log(1);
console.log(2);
console.log(3);
console.log(4);

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
	creator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside');
	//受講済みテーブルのテーブルの値をしかるべき値にする
	lessonTableValueInput('.finishedLessonTable', creator.json.finishedLessonTable.table, 'callMemberLessonValue');
	//セレクトボックスのvalueを画面に表示されている値にする
	creator.setSelectboxValue('.selectThemebox');
	//絞り込みボタン機能を実装する
	creator.reloadTableTriggerEvent('#finishedLesson .selectThemebox', CHANGE, 'finishedLessonTable');
	//ページング後の処理を登録する
	creator.finshedLessonTableAfterPaging();
}


