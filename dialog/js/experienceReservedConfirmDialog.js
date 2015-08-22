/* ファイル名:experienceReservedConfirmDialog.js
 * 概要　　　:体験レッスン予約希望ダイアログ用クラス
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/experienceReservedConfirmDialog.js
 */

/* クラス名:experienceReservedConfirmDialog.js
 * 概要　　:体験レッスン予約希望確認ダイアログ用クラス。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/experienceReservedConfirmDialog.js
 */
function experienceReservedConfirmDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする
	
	/* 関数名:dispContentsHeader
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のヘッダー部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsHeader = function(){
		//ダイアログのタイトルを変更する。
		//ログインエラー例外クラス生成時に設定されたタイトルを使う
		this.setDialogTitle(this.dialogClass.getArgumentDataObject().title);
	}

	/* 関数名:dispContentsMain
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		//メール送信確認画面を出すため、一度目のフォーム送信を行う。
		//CGIから返された結果のHTMLを画面に表示する。
		this.sendReservedDataForConfirm();
	}

	/* 関数名:sendReservedDataForConfirm
	 * 概要　:メール送信確認画面を出すため、一度目のフォーム送信を行う。
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.sendReservedDataForConfirm = function(){
		
	};
	
	/* 関数名:dispContentsFooter
	 * 概要　:openDialogから呼ばれる、画面パーツ設定用関数のフッター部分作成担当関数
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsFooter = function(){
		//ダイアログの位置を修正する
		this.setDialogPosition(POSITION_CENTER_TOP);
	}

	/* 関数名:setDialogEvents
	 * 概要　:ダイアログのイベントを設定する
	 * 引数　:なし(オーバーライド時に定義する)
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.setDialogEvents = function(){
		//メール送信ボタンのイベントを登録する
		this.registerSendMailButtonEvent();
		//キャンセルボタンのイベントを登録する
		this.registerCancelButtonEvent();
		//ダイアログを閉じるときのイベントを登録する。
		//メール送信結果の確認が主なものとなる
		this.dialogClass.setCallbackCloseOnAfterOpen(this.removeDialogWithParent);
	}
	
	/* 関数名:removeDialogWithParent
	 * 概要　:自分と親のダイアログをまとめて消す。現状はcloseイベント用
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.removeDialogWithParent = function(){
		var dialogClass = this.instance;	//ダイアログのクラスインスタンスを取得する
		//押されたボタンの値を取得する
		var buttonState = this.getPushedButtonState();
		dialogClass.destroy();					//自分を消す
		//最終的な送信ボタンが押されていたら
		if(buttonState == YES){
			//アラートに出すメッセージを格納する変数を用意する。失敗時のメッセージで初期化する
			var message = EXPERIENCE_RESERVED_FAILED_MESSAGE;			
			//メールの送信に成功していたら
			if(dialogClass[SEND_COMPLETE]){
				//ダイアログのインプットパラメータ用オブジェクトを取得する
				var data = this.instance.getArgumentDataObject();
				$(data.parentDialog).dialog(CLOSE);		//親を消す
				//送信完了メッセージをセットする
				message = EXPERIENCE_RESERVED_COMPLETE_MESSAGE;
			}
			
			//送信結果のメッセージを出す
			alert(message);
		}
	}

	/* 関数名:registerSendMailButtonEvent
	 * 概要　:メール送信フォームの送信イベントを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.registerSendMailButtonEvent = function(){
		$(CURRENT_DIALOG).on(SUBMIT, FORM, function(event){
			//submitイベントをキャンセルする。
			event.preventDefault();
			//フォームのaction属性から送信URLを取得する。
			var sendUrl = $(this).attr(ACTION);
			
			//送信するフォームデータを作成する。
			var formData = commonFuncs.createFormData($(this));

			//ダイアログを閉じるため、ダイアログのクラスインスタンスを取得する
			var dialogClass = this.dialogClass;
			
			//Ajax通信でjsonファイルを取得する。
			$.ajax({
				//jsonファイルのURLを指定する。
				url: sendUrl,
				//HTMLデータを取得する(ただし、使用しない。)
				dataType: STR_HTML,
				//POSTメソッドでデータを送信する
				type:STR_POST,
				//同期通信を行う。
				async: false,
				//フォームデータをサーバに送信する
				data: formData,
				//キャッシュを無効にする。
				cache:false,
				//通信完了時の処理を記述する。
				success: function(html, status){
					//ダイアログの状態オブジェクトを取得する
					var statusObj = dialogClass.getReturnStatusObject();
					//メール送信の成否を判定し、ダイアログのreturnObjのstatusObjにセットする。
					//CGIが通信の結果返す送信完了の画面のHTMLの独自のクラスを持つ要素の取得を試み、成功したらtrueとなる
					statusObj[SEND_COMPLETE]= $(MAIL_SEND_COMPLETE_CGI, html).length? true : false;
				},
				//通信失敗時の処理。
				error:function(xhr, status, error){
					
				}
			});
			
			//ダイアログのstatusObjに「はい」ボタンを押したという情報を登録する
			dialogClass.setPushedButtonState(YES);
			$(dialogClass[STR_DOM]).dialog(CLOSE);	//ダイアログを閉じる
		});
		
	}
	
	/* 関数名:registerCancelButtonEvent
	 * 概要　:メール送信のキャンセルボタンのイベントを登録する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Masuda
	 */
	this.registerCancelButtonEvent = function(){
		//ダイアログのDOMを取得する
		var $dialog = $(this[DIALOG_CLASS][STR_DOM]);
		//キャンセルボタンのクリックイベントを登録する
		$(CURRENT_DIALOG).on(CLICK, SEELCTOR_CONF_BACK_BUTTON, function(event){
			event.preventDefault();	//デフォルトのイベントがあればキャンセルする
			//ダイアログを閉じる。
			$dialog.dialog(CLOSE);
		});
	}
	
	//ここまでクラス定義
}

//継承の記述
experienceReservedConfirmDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
experienceReservedConfirmDialog.prototype.constructor = baseDialog;
