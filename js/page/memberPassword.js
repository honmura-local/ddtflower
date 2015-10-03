/* 
 * ファイル名:memberPassword.js
 * 概要  :会員プロフィールページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberPassword.js
 */

/* 
 * 関数名:setPasswordUpdate
 * 概要  :パスワード変更画面で更新ボタンを押されたときにテキストボックスに
 		 入っている値をDBに送信してデータを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setPasswordUpdate() {
	//更新ボタンが押された時の処理
	$('.passwordUpdate').click(function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = commonFuncs.getInputData('postPass');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = create_tag.json.accountHeader.user_key.value;
		//新しいパスワードと確認のパスワードが一致すれば登録する
		if(queryReplaceData.newPass === queryReplaceData.password) {
			//データべベースにクエリを発行してデータを更新する
			create_tag.setDBdata(create_tag.json.updatePassword, queryReplaceData, MESSAGE_SUCCESS_PASSWORD_UPDATE);
		} else {
			alert('パスワードが確認と異なります');
		}
	});
}

