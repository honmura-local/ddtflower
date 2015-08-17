
/* 
 * ファイル名:memberProfile.js
 * 概要  :会員プロフィールページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberProfile.js
 */

/* 
 * 関数名:setProfileUpdate
 * 概要  :プロフィール画面で更新ボタンを押されたときにテキストボックスに
 		 入っている値をDBに送信してデータを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setProfileUpdate() {
	//更新ボタンが押された時の処理
	$(BODY).on(CLICK, '.updateButton', function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = getInputData('memberInfo');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = creator.json.accountHeader.user_key.value;
		//入力項目に不備があったときにエラーメッセージを出す配列を作る
		var updateError = [];
		//メッセージを挿入するための関数を作る
		function erroeMesseageInput (func ,checkTarget, errorMessage) {
			//第一引数の関数を実行して第二引数の文字列をチェックをする
			if(!func(queryReplaceData[checkTarget])) {
				//エラー内容が初めてのときは改行を挟まずにエラーメッセージを表示する
				if(updateError.length == 0) {
					//エラーメッセージを配列に入れる
					updateError.push(errorMessage);
				} else {
					//改行を含めて配列に入れる
					updateError.push('\n' + errorMessage);
				}
			}
		}
		//名前の入力された文字をチェックする
		erroeMesseageInput(creator.checkInputName, 'user_name', '名前に数字や記号が入っています');
		//カナの入力された文字をチェックする
		erroeMesseageInput(creator.checkInputName, 'name_kana', '名前(カナ)に数字や記号が入っています');
		//電話番号の入力された文字をチェックする
		erroeMesseageInput(creator.checkInputPhone, 'telephone', '電話番号に文字や記号が入っています');

		//入力内容エラーがあったときにメッセージを表示する
		if(updateError.length) {
			//配列を結合してエラーメッセージのアラートを出す
			alert(updateError.join(','))
		//入力内容にエラーがなかった時の処理
		} else {
			//データべベースにクエリを発行してデータを更新する
			creator.setDBdata(creator.json.updateUserInf, queryReplaceData, MESSAGE_SUCCESS_PROFILE_UPDATE);
		}
	});
}




