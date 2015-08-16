/* ファイル名:adminMailSendDialog.js
 * 概要　　　:管理者、メール送信確認ダイアログ
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/adminMailSendDialog.js
 */

/* クラス名:adminMailSendDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/adminMailSendDialog.js
 */
function adminMailSendDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	//はい、いいえボタンの配列
	this.yes_no = [
					{	//はいボタン
						text:TEXT_YES,
						//クリック時のコールバック関数
						click://ダイアログのステータスをはいボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(YES)
					},
					//いいえボタン
					{	//ボタンテキスト
						text:TEXT_NO,
						//クリック時のコールバック関数
						click://ダイアログのステータスをいいえボタンが押されたステータスに変更する
							this[DIALOG_BUILDER].buttonCallBack(NO)
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
			//ブログ確認ダイアログのjsonデータを取得する
			this.create_tag.getJsonFile(SUGGESTION_CONFIRM_DIALOG_JSON);
			//記事更新ステータスを取得する
		//例外時処理
		}catch(e){
			//例外を投げ、dispContents内で処理する
			throw new cannotGetAnyRecordException();
		}
	};

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
		this.setDialogTitle(ADMIN_MAIL_SEND_TITLE);
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
		//確認ダイアログを作成する。送信タイプ別にメッセージ、コールバック関数を設定する
		this.dialogClass.setConfirmContents(ADMIN_MAIL_SEND_TEXT, sendAdminMail);
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
		//ダイアログにボタンをセットする
		this.setDialogButtons(this.yes_no);
		//ダイアログの位置を修正する
		this.setDialogPosition({my:DIALOG_POSITION,at:DIALOG_POSITION, of:window});
	}
	
	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
		//ダイアログを閉じるときは破棄するように設定する
		dialogClass.setCallbackCloseOnAfterOpen(dialogClass.destroy);
	}
	
	/* 関数名:buttonCallBack
	 * 概要　:ダイアログのイエスノーボタンがクリックされた時に走るコールバック関数
	 * 引数　:string:buttonType:クリックされたボタンの種類
	 * 返却値:なし
	 * 作成日　:2015.08.16
	 * 作成者　:T.Yamamoto
	 */
	this.buttonCallBack = function(buttonType) {
		//ボタンがクリックされたステータスを登録する
		this.setPushedButtonState(buttonType);
		//ダイアログを閉じる
		$(this).dialog(CLOSE);
	}

	/* 関数名:updateJson
	 * 概要　:ブログ記事更新の更新データをjsonに入れる
	 * 引数　:なし
	 * 返却値:クエリを発行するためのクエリ
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 */
	this.updateJson = function() {
		var data = commmonFuncs.getInputData(ADMIN_MAIL_DATA_DOM_PARENT);		//argumentObjのdataを取得する
		var resultwork = null;								//
		var sendUrl = MAIL_SEND_ENTRY_ADMIN_MAIL_PHP ;	//通常会員メールの送信先PHP
		var sendObject = {									//送信するデータのオブジェクト
				from:data.user_key				//送信元
				,subject:data.message_title		//タイトル
				,content:data.message_content	//本文
		}
		//送信するデータを更新する
		var sendObject = $.extend(true, {}, sendObject, data);
		return sendObject;
	}

	/* 本村さんのメール送信関数 */
	/* 関数名:sendMemberMail
	 * 概要　:会員ページ 会員メール/目安箱メールを送信する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.07xx
	 * 作成者　:A.Honmura
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:現行のdialogExクラス用に作り直しました。
	 */
	this.sendAdminMail = function() {
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			//インスタンスを保存して関数内でも使えるようにする
			var instance = this;
			//送信するデータを取得する
			var sendObject = updateJson();
			//メールのタイプの数値で送信先PHP、送信データの構成を変える
			switch(parseInt(sendObject.sendType)){
			//通常メールの場合
			case ADMIN_NORMAL_MAIL:break;	//初期化内容が該当するのでなにもしない
			//目安箱メールの場合
			case ADMIN_ANNOUNCE_MESSAGE:
					//目安箱メール送信用PHPにメールを処理させる
					sendUrl = SEND_SUGGEST_PHP;
					break;
			default:break;
			}
			
			$.ajax({					//PHPにメール用データを渡すAjax通信
					url:sendUrl			//PHPのURLを設定する
					,data:sendObject	//送信データのオブジェクト
					,dataType:"json"	//JSON形式でデータをもらう
					,type:"POST"		//POSTメソッドでHTTP通信する
					,success:function(result){		//通信成功時
						resultwork = result;		//通信結果から情報を取り出す
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_SUCCESS_SIMPLE_NOTICE);	//送信完了のメッセージを出す
						//目安箱メールを送信していたら
						if(parseInt(sendObject.sendType) == ADMIN_ANNOUNCE_MESSAGE){
							//目安箱テーブルに新たにデータを挿入する
							instance.sendQuery(URL_SAVE_JSON_DATA_PHP, sendObject);
						}
					}
					//通信失敗時
					,error:function(xhr, status, error){
						//throw new (status + ":" + MESSAGE_FAILED_CONNECT);
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	//送信失敗のメッセージを出す
					}
				});
		}

}

//継承の記述
adminMailSendDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminMailSendDialog.prototype.constructor = baseDialog;
