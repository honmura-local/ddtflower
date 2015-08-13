/* ファイル名:testdialog.js
 * 概要　　　:テスト用ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialog.js
 */

/* クラス名:testdialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/testdialog.js
 */
function testdialog(){
	baseDialog.call(this);
	
	$(this).dialog('option', 'buttons', yes_no);
	$(this).dialog('option', 'title', alterTitle);
	
	//はい、いいえボタンの配列
	var yes_no = [
					{
						text:'はい',
						click:function(){
							alert("YES");
						}
					},
					{
						text:'いいえ',
						click:function(){
							$(this).dialog('close');
						}
					}
	           ];

	function callAlert(){
		alert("I called.")
	}
	
	//タイトルの文字列
	var alterTitle = '変更できました。';

}

//継承の記述
testdialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
testdialog.prototype.constructor = baseDialog;
