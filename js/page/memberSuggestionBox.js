/* 
 * ファイル名:memberSuggestionBox.js
 * 概要  :会員 目安箱ページのjsファイル
 * 作成者:T.Masuda
 * 作成日:2015.10.03
 * パス :/js/page/memberSuggestionBox.js
 */

/* 
 * 関数名:setSuggestionBoxSendEvent
 * 概要  :目安箱の送信ボタンが押されたときのイベントコールバックを登録する。
 * 引数  :String selector:ボタンのセレクタ
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.10.03
 */
function setSuggestionBoxSendEvent(selector){
	//送信ボタンがクリックされた時、入力されているデータを取得してDBを更新し、メールを送信する
	$(selector).on(CLICK, function() {
		
		//ダイアログ用オブジェクトを作る
		var dialogObj = $.extend(true, {}, commonFuncs.getDefaultArgumentObject());
		dialogObj.config.title = '送信確認'; 
		dialogObj.data.message = '入力した内容を送信します。'; 
		//送信するデータをオブジェクトに統合する
		$.extend(true, dialogObj.data, {callback : commonFuncs.sendMemberMail, user_key : create_tag.getUserId()});
		
		//メール送信ダイアログを作る
		var mailSendDialog = new dialogEx('dialog/confirmDialog.html', dialogObj);
		mailSendDialog.setCallbackClose(mailSendDialog.destroy);	//閉じるときのイベントを登録
		mailSendDialog.run();	//主処理を走らせる
	});
}
