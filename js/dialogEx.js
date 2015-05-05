/* ファイル名:dialogEx.js
 * 概要　　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 場所　　:js/dialogEx.js
 */

//定数を定義する
SPECIAL_RESERVED_CONFIRM_DIALOG_URL			 = 'dialog/specialReservedConfirmDialog.html';	//体験レッスン予約確認ダイアログのHTMLファイルのURL
DIALOG_DEFAULT_ALERT_CONTENTS				 = 'dialog/defaultAlertContents.html';			//アラートを出すdomがあるファイル名
DIALOG_RESERVE_LESSON_LIST 					 = 'dialog/reserveLessonListDialog.html';		//会員、予約可能授業一覧ダイアログファイルパス
DIALOG_MEMBER_RESERVED_CONFIRM 				 = 'dialog/memberReservedConfirmDialog.html';	//会員、授業予約確認ダイアログパス
DIALOG_CANCEL_LESSON 						 = 'dialog/cancelLessonDialog.html';			//会員、授業予約キャンセルダイアログパス
DIALOG_LESSON_DETAIL 						 = 'dialog/lessonDetailDialog.html';			//管理者、授業詳細、授業の詳細ダイアログパス
DIALOG_ADMIN_NEW_LESSON_CREATE				 = 'dialog/adminNewLessonCreateDialog.html';	//管理者、授業詳細、新規授業作成ダイアログパス
UI_DIALOG_CONTENT 							 = 'ui-dialog-content';							//ダイアログコンテンツのクラス名
DIALOG_CONTENT_ADMIN_LESSON_LIST 			 = 'adminLessonListContent';					//管理者、授業一覧ダイアログコンテンツ部分
DIALOG_CONTENT_ADMIN_NEW_LESSON_CREATE		 = 'adminNewLessonCreateContent';				//管理者、新規授業作成ダイアログコンテンツ部分
DIALOG_CONTENT_RESERVED_LESSON_LIST 		 = 'reserveLessonListContent';					//会員、予約可能授業ダイアログコンテンツ部分
DIALOG_CONTENT_MEMBER_RESERVED_CONFIRM 		 = 'memberReservedConfirmDialogContent';		//会員、予約確認ダイアログコンテンツ部分
DIALOG_CONTENT_CANCEL_LESSON				 = 'cancelLessonDialogContent';					//会員、予約キャンセルダイアログコンテンツ部分
UI_DIALOG 									 = 'ui-dialog';									//ダイアログクラス名
CLOSE 										 = 'close';										//クローズ処理に使う
DIALOG_CLOSE_BUTTON 						 = 'dailogCloseButton';							//閉じるボタンクラス名
DEFAULT_ALERT_CONTENTS 						 = 'defaultAlertContents';						//アラートダイアログの外側divのクラス名
TAG_P										 = ' p';										//pタグ
LESSON_TABLE 								 = 'lessonTable';								//会員画面予約授業一覧テーブル
LESSON_TABLE_RECORD 						 = 'targetLessonTable';							//会員画面予約授業一覧テーブルの1行ごとのクラス名
MEMBER_RESERVED_CONFIRM_DIALOG				 = 'memberReservedConfirmDialog';				//会員画面予約確認ダイアログ
CANCEL_LESSON_DIALOG 						 = 'cancelLessonDialog';						//会員画面予約キャンセルダイアログ
ADMIN_LESSONLIST_DIALOG 					 = 'adminLessonListDialog';						//管理者画面授業設定一覧ダイアログ
LESSON_DETAIL_DIALOG 						 = 'lessonDetailDialog';						//管理者画面授業詳細設定ダイアログ
ADMIN_NEW_LESSON_CREATE 					 = 'adminNewLessonCreateDialog';				//管理者画面新規授業作成ダイアログ
ADMIN_MAIL_SEND_DIALOG 						 = 'adminMailSendDialog';						//管理者画面メール送信ダイアログ
CONFIRM_DIALOG 								 = 'confirmDialog';								//確認ダイアログ
TITLE 										 = 'title';										//ダイアログの設定のタイトルなどで使う
USER_ID 									 = 'userId';									//ユーザの会員番号key名
TABLE 										 = 'table';										//テーブル。DBから取り出した値のkey名としても使われている
TABLE_DATA 									 = 'tableData';									//テーブルのデータ
LESSON_DATE 								 = 'lessonDate'									//レッスン日
TIME_SCHEDULE 								 = 'time_schedule';								//時間割の列名
LESSON_TABLE_REPLACE_FUNC 					 = 'callReservedLessonValue';					//予約可能授業一覧置換関数名
ADMIN_LESSON_DETAIL_TABLE					 = 'adminLessonDetailTable';					//管理者、授業詳細一覧テーブル
ADMIN_LESSON_DETAIL_TABLE_RECORD			 = 'targetAdminLessonRecord';					//管理者、授業詳細一覧テーブルの1行ごとのクラス名
ADMIN_LESSON_DETAIL_TABLE_REPLACE_FUNC 		 = 'callAdminReservedLessonValue';				//管理者、授業詳細一覧テーブル置換関数名
FINISHED_LESSONTABLE						 = 'finishedLessonTable';						//会員、受講済み授業テーブル
FINISHED_LESSONTABLE_REPLACE_FUNC			 = 'callMemberLessonValue';						//会員、受講済み授業テーブル置換関数名
RESERVED_LESSON_TABLE 						 = 'reservedLessonTable';						//会員、予約中授業テーブル
RESERVED_LESSON_TABLE_RECORD 				 = 'targetCancelReservedLesson';				//会員、予約中授業テーブルの1行ごとのクラス名
RESERVED_LESSON_TABLE_REPLACE_FUNC 			 = 'callMemberLessonValue';						//会員、予約中授業テーブル置換関数名
EACH_DAY_RESERVED_INFO_TABLE 				 = 'eachDayReservedInfoTable';					//管理者、日ごと予約者一覧テーブル
EACH_DAY_RESERVED_INFO_TABLE_RECORD			 = 'targetEachDayLessonRecord';					//管理者、日ごと予約者一覧テーブル1行ごとのクラス名
EACH_DAY_RESERVED_INFO_TABLE_REPLACE_FUNC 	 = 'callEachDayReservedValue';					//管理者、日ごと予約者一覧テーブル置換関数名
DO_LECTURE_PERMIT_INFO_TABLE 				 = 'doLecturePermitInfoTable';					//管理者、受講承認テーブル
DO_LECTURE_PERMIT_INFO_TABLE_REPLACE_FUNC 	 = 'callLecturePermitValue';					//管理者、受講承認テーブル置換関数名
LECTURE_PERMIT_LIST_INFO_TABLE				 = 'lecturePermitListInfoTable';				//管理者、受講承認一覧テーブル
LECTURE_PERMIT_LIST_INFO_TABLE_REPLACE_FUNC  = 'callPermitLessonListValue';					//管理者、受講承認一覧テーブル置換関数名
ADMIN_LESSON_ADD_BUTTON						 = 'lessonAddButton';							//管理者、授業詳細、新規授業の追加ボタン
LESSON_DATA 								 = 'lessonData';								//管理者、授業詳細、授業データ部分クラス名
COLUMN_NAME_TIME_TABLE_DAY_KEY 				 = 'time_table_day_key';						//授業の時限データのキー名
COLUMN_NAME_TIMETABLE_KEY 					 = 'timetable_key';								//スクールの時限ごとのキー名
CREATE_NEW_LESSON_MESSAGE 					 = '新規授業の作成に成功しました。';	
CONFIRM_DIALOG_BUTTONS						= '.confirmDialog button';						//確認ダイアログのボタン×2のセレクタ
CLICK										= 'click';										//クリックイベント用文字列
CONFIRM_DIALOG_PATH							= 'dialog/confirmDialog.html';					//確認ダイアログのHTMLファイルパス
UI_DIALOG_CLOSEBOX							= '.ui-dialog-titlebar-close';					//jQuery UI Dialogのクローズボックスのセレクタ
UI_DIALOG_BUTTON_PANEL						= '.ui-dialog-buttonpane';						//jQuery UI Dialogのオプションで作るボタン領域のセレクタ

//選択されたボタンを表す値。
UNSELECTED 									= -1;											//ボタン未選択の値
NO											= 0;											//「はい」ボタンの値
YES											= 1;											//「いいえ」ボタンの値
CONFIRM_DIALOG_WAIT							= 30;											//汎用確認ダイアログ関数終了後関数実行までの待ち時間
ARGUMENT_OBJ								= 'argumentObj';								//dialogExクラスのインプット用オブジェクト名
RETURN_OBJ									= 'returnObj';									//dialogExクラスのアウトプット用オブジェクト名
SELECTOR_LAST								= ':last';										//「一番後ろの要素」の疑似セレクタ
MESSAGE_SEND_SUCCESS_SIMPLE_NOTICE			= "メッセージの送信が完了しました。";					//簡易的なメッセージ送信完了のメッセージ	
ROLE										= 'role';										//role属性
CONFIRM_DIALOG								= 'confirmDialog';								//確認ダイアログ
SUGGESTION_BOX_CONFIRM_DIALOG				= 'suggestionBoxConfirmDialog';					//目安箱送信確認ダイアログ
MY_BLOG_CONFIRM_DIALOG						= 'myBlogConfirmDialog';						//マイブログ更新確認ダイアログ
MAIL_MAGAZINE_CONFIRM_DIALOG				= 'mailmagazineConfirmDialog';					//メルマガ送信確認ダイアログ
DESTROY										= 'destroy';									//破棄命令の文字列
MESSAGE_SEND_FAILED_SIMPLE_NOTICE			= 'メッセージの送信に失敗しました。時間をおいてお試しください。';	//簡易的なメッセージ送信失敗のメッセージ	

/* クラス名:dialogEx
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 引数　　:String url:ダイアログのクラス名
 * 		　:Object argumentObj:イアログ内のコンテンツ作成のためのパラメータをまとめたオブジェクト
 * 		　:Object returnObject:jQuery UI Dialogの設定用オブジェクト
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 変更日　:2015.0731
 * 変更者　:T.Masuda
 * 内容　　:引数「argumentObj」を追加しました
 */
function dialogEx(url, argumentObj, returnObj){
	//ダイアログのHTMLのURLを格納するメンバ
	this.url = url;
	//ダイアログのDOMを格納するメンバ
	this.formDom = '';
	//ダイアログ内のコンテンツ作成のためのパラメータをまとめたオブジェクト
	this.argumentObj = argumentObj !== void(0)? argumentObj : {};
	//設定用オブジェクトを格納するメンバ
	this.returnObj = returnObj !== void(0)? returnObj : {};
	
	//デフォルト設定のオブジェクト
	//argumentObjを作る際に参考にしてください。
	this.defaultArgumentObj = {
			//ダイアログの設定データオブジェクト
			config:{
				width: 'auto',		//幅を自動調整する
				autoOpen : true,	//作成時の自動オープンを無効にする
				modal : true,		//モーダル表示
				resizable : false,	//ドラッグでのリサイズ可否
				//表示位置の指定。
				position :{my:'center top',at:'center top', of:window},
				closeOnEscape : false,	//escキーを押して閉じるか
				create:function(){	//ダイアログ作成時のイベント
					
				},
				open:function(){	//ダイアログが開くときのイベント
					
				},
				close:function(){	//ダイアログが閉じられるときのイベント
					
				}
			},
			//インプット用データオブジェクト
			data:{
			}
	};
	
	//デフォルトのアウトプット用オブジェクト
	//returnObjを作る際に参考にしてください。
	this.defaultReturnObj = {
			//ダイアログのステータスオブジェクト
			statusObj:{
				buttonState:UNSELECTED	//押されたボタンの値。1→未選択 0→いいえ 1→はい 
			},
			//関数オブジェクト
			funcObj:{
				YES_NO:[	//「はい」ボタン、「いいえ」ボタン用コールバック関数
				        function(){	//「いいえ」ボタン
				        	//いいえ」ボタンの処理内容
				        },
				        function(){	//「はい」ボタン
				        	//「はい」ボタンの処理内容
				        }
				]
			},
			//アウトプット用データのオブジェクト
			data:{
			}
	};
	
	/* 関数名:load
	 * 概要　:URLからダイアログのHTMLファイルを取得してメンバに保存する。
	 * 引数　:String: domUrl: ダイアログの中で展開されるdomが入ったhttmlファイル名
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	//変更者:T.Yamamoto 変更指示者:H.Kaneko 日付2015.08.07 内容：引数にdomUrlを追加し、その引数からdomを読み込むようにした
	this.load = function(domUrl){
		//クラスインスタンスへの参照を変数に格納しておく。
		var tmpThis = this;
		
		//Ajax通信でURLからHTMLを取得する。
		$.ajax({
			url:domUrl,			//URLを設定する
			dataType:'HTML',		//HTMLデータを取得する
			async: false,			//同期通信を行う
			cache: true,			//通信結果をキャッシュする
			success:function(html){	//通信成功時
				//取得したhtmlデータをメンバに格納する。
				tmpThis.formDom = html;
			},
			error:function(xhr, status, e){	//通信失敗時
				throw e;			//例外を投げる。エラーオブジェクトを渡す。
			}
		});
		
	}

	/* 関数名:run
	 * 概要　:ダイアログを生成して表示する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.run = function(){
		//ロード失敗時の例外処理を行うため、try-catch節を使う。
		try{
			//変更者:T.Yamamoto 変更指示者:H.Kaneko 日付2015.08.07 内容：loadの引数を
			//メンバのURLからHTMLデータを読み込む
			this.load(this.url);
			//returnObjが空オブジェクトであれば、デフォルト用に用意したオブジェクトをセットする
			//@mod 2015.0808 T.Masuda デフォルトでセットされるオブジェクトについて変更しました。
			//argumentObjも空であればデフォルトのオブジェクトをが入力されるようにしました。
			this.returnObj = Object.keys(this.returnObj).length? this.returnObj: this.defaultReturnObj;
			this.argumentObj = Object.keys(this.argumentObj).length? this.argumentObj: this.defaultArgumentObj;
			
			var form = $(this.formDom)[0];	//ダイアログのDOMを取得する
			form.instance = this;			//ダイアログのDOMにクラスインスタンスへの参照を持たせる。
			//取得したHTMLデータをjQueryUIのダイアログにして、そのダイアログへの参照をメンバに格納する。
			//※this.formDomへはjQueryオブジェクトとしてformDomへの参照が代入される。
			//*formDom内のHTMLにscriptタグが記述されていた場合、このコード実行時にscriptタグのコードが動き出す。
			this.formDom = $(form).dialog(this.argumentObj.config);
		//例外をキャッチしたら
		} catch(e){
			console.log(e.stack);	//投げられたエラーオブジェクトをコンソールログに出す。
		}
	}

	/* 関数名:setCallbackClose
	 * 概要　:ダイアログのcloseイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackClose = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function? this.argumentObj.config['close'] = func: console.log('setCallBackClose recieved enythingeles function');
	}

	/* 関数名:setCallbackCloseOnAfterOpen
	 * 概要　:ダイアログが開いた後にcloseイベントのコールバックを設定する
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackCloseOnAfterOpen = function(func){

		if(func instanceof Function){
			this.formDom.dialog('option', 'close', func);
		} else {
			alert("not a function");
		}
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		//func instanceof Function? this.formDom.dialog('option', 'close', func): console.log('setCallBackClose recieved enythingeles function');
	}
	
	/* 関数名:setCallbackOpen
	 * 概要　:ダイアログのopenイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackOpen = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.argumentObj.config['open'] = func: console.log('setCallBackOpen recieved enythingeles function');
	}

	/* 関数名:setCallbackCreate
	 * 概要　:ダイアログのcreateイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 * 変更日　:2015.0808
	 * 変更者　:T.Masuda
	 * 内容　　:セット先が変わりました。
	 */
	this.setCallbackCreate = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.argumentObj.config['create'] = func: console.log('setCallBackCreate recieved enythingeles function');
	}
	
	/* 関数名:destroy
	 * 概要　:ダイアログのを破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
		//ダイアログのDOMを取得する。
		var $dialog = this.formDom !== void(0)? $(this.formDom) : $(this);
		var dialogRole = $dialog.attr(ROLE);	//ダイアログのrole属性を取得する
		//ダイアログが確認ダイアログであれば、その親の要素(=元のダイアログ)を取得して処理対象にする
		$dialog = dialogRole !== void(0) && dialogRole.indexOf(CONFIRM_DIALOG) != -1 
			? $(DOT + CONFIRM_DIALOG + SELECTOR_LAST).parent(): $dialog;
//		var dialogClassName = $dialog.attr('class').split(' ')[0];	//ダイアログのクラス名を取得する
		
		//まずはダイアログを閉じる
		$dialog.dialog(CLOSE);
//		$(DOT + dialogClassName).dialog(CLOSE);
		//jQuery UIのダイアログを破棄する
		$dialog.dialog(DESTROY);
		$dialog.remove();
	}

	/* 関数名:setAlertContents
	 * 概要　:ダイアログにアラートと閉じるボタンを表示する
	 * 引数　:String:alertMessage: アラートで表示するメッセージ文字列
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.08.07
	 * 作成者　:T.Yamamoto
	 */
	this.setAlertContents = function(alertMessage) {
		//アラートとして表示するためのdomを取得する
		this.load(DIALOG_DEFAULT_ALERT_CONTENTS);
		//アラートで表示するdomをセレクタとして変数に入れる
		var alertDom = $(this.formDom)[0];
		//domをダイアログにセットする
		$(DOT + UI_DIALOG_CONTENT).append(alertDom);
		//メッセージを表示する
		$(DOT + UI_DIALOG_CONTENT + TAG_P).text(alertMessage);
	}

	/* 関数名:setConfirmContents
	 * 概要　:ダイアログに確認用テキストとはい、いいえのボタンを表示する
	 * 引数　:String:message:ダイアログのメッセージ
	 * 		:Function:func:ダイアログが閉じるときのコールバック関数
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.08.07
	 * 作成者　:T.Yamamoto
	 * 変更日　:2015.08.08
	 * 変更者　:T.Masuda
	 * 内容　　:内容を作りました。
	 */
	this.setConfirmContents = function(message, func) {
		//アラートとして表示するためのdomを取得する
		this.load(CONFIRM_DIALOG_PATH);
		//アラートで表示するdomをセレクタとして変数に入れる
		var confirm = $(this.formDom)[0];
		//domをダイアログにセットする
		$(DOT + UI_DIALOG_CONTENT).filter(SELECTOR_LAST).append(confirm);
		//メッセージを表示する
		$(DOT + UI_DIALOG_CONTENT + TAG_P).filter(SELECTOR_LAST).text(message);
		//タイマー関数のコールバックでthisが変わるため、変数にthisを格納しておく
		var thisElem = this;	
		//処理終了後にタイマー関数をセットする
		window.setTimeout(function(){
			//ダイアログのクローズボックスを消す
			thisElem.removeDialogCloseBox();
			//ダイアログの設定で出現するボタンを消す
			thisElem.removeDialogButtons();
			thisElem.setCallbackCloseOnAfterOpen(func);	//ボタン押下後のコールバック関数をセットする
		}, CONFIRM_DIALOG_WAIT);	//定数で設定した時間だけ待って実行する
	}

	/* 関数名:setPushedButtonState
	 * 概要　:押されたボタンがどれかを表す値を更新するsetterメソッド
	 * 引数　:String buttonState:ボタンの値。ボタンが押された後にbuttonタグのvalueから値を取得することを想定しているため、文字列となっている
	 * 返却値:なし
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.setPushedButtonState = function(buttonState){
		//引数の値を押されたボタンの状態としてセットする
		this.returnObj.statusObj.buttonState = parseInt(buttonState);
	}
	
	/* 関数名:getPushedButtonState
	 * 概要　:押されたボタンを表す値を返すgetterメソッド
	 * 引数　:String:なし
	 * 返却値:int:ボタンを表す整数を返す
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getPushedButtonState = function() {
		return this.returnObj.statusObj.buttonState;
	}

	
	/* 関数名:getArgumentObject
	 * 概要　:argumentObjを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログのインプットデータオブジェクト
	 * 作成日　:015.08.09
	 * 作成者　:T.Masuda
	 */
	this.getArgumentObject = function() {
		return this.argumentObj;	//argumentオブジェクトを返す
	}
	
	/* 関数名:getConfigObject
	 * 概要　:configオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:ダイアログの設定用オブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getConfigObject = function() {
		return this.argumentObj.config;	//configオブジェクトを返す
	}
	
	/* 関数名:getArgumentDataObject
	 * 概要　:インプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:インプット用データオブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getArgumentDataObject = function() {
		return this.argumentObj.data;	//dataオブジェクトを返す
	}
	
	/* 関数名:getReturnObject
	 * 概要　:アウトプット用オブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用オブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnObject = function() {
		return this.returnObj;		//アウトプット用オブジェクトを返す
	}

	/* 関数名:getReturnDataObject
	 * 概要　:アウトプット用データオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用データオブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnDataObject = function() {
		return this.returnObj.data;		//アウトプット用データのオブジェクトを返す
	}
	
	/* 関数名:getReturnStatusObject
	 * 概要　:アウトプット用ステートオブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用ステートオブジェクトを返す
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnStatusObject = function() {
		return this.returnObj.statusObj;	//アウトプット用ステートのオブジェクトを返す
	}
	
	/* 関数名:getReturnFunctionObject
	 * 概要　:アウトプット用コールバック関数定義オブジェクトを返す
	 * 引数　:なし
	 * 返却値:Object:アウトプット用データオブジェクト
	 * 作成日　:015.08.08
	 * 作成者　:T.Masuda
	 */
	this.getReturnFunctionObject = function() {
		return this.returnObj.funcObj;	//アウトプット用コールバック関数定義オブジェクトを返す
	}
	
	/* 関数名:setYESNOFunction
	 * 概要　:「はい」ボタン、「いいえ」ボタンを押したときの関数を登録する
	 * 引数　:String: domUrl: ダイアログの中で展開されるdomが入ったhttmlファイル名
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.setYESNOFunction = function(noFunc,yesFunc){
		var yesNo = this.returnObj.funcObj.YES_NO;
		yesNo[NO]	= noFunc;	//いいえボタンの関数を登録する
		yesNo[YES]	= yesFunc;	//はいボタンの関数を登録する
	}

	/* 関数名:removeCloseBox
	 * 概要　:ダイアログのクローズボックスを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogCloseBox = function(){
		$(UI_DIALOG_CLOSEBOX, this.formDom.parent()).remove();
	}
	
	/* 関数名:removeDialogButtons
	 * 概要　:ダイアログの設定で表示するボタンを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogButtons = function(){
		$(UI_DIALOG_BUTTON_PANEL, this.formDom.parent()).remove();
	}
	
	/* 本村さんのメール送信関数 */
	this.sendMemberMail = function() {
		var dialogClass = $(this)[0].instance;	//クラスインスタンス取得
		
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
			var resultwork = null;
			
				$.ajax({
					url:'php/mailSendEntryMemberMail.php'
					,data:{
							from:data.from
							,subject:data.mailSubject
							,content:data.mailContent
					}
					,dataType:"json"
					,type:"POST"
					//通信成功時
					,success:function(result){
						resultwork = result;		//通信結果から情報を取り出す
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_SUCCESS_SIMPLE_NOTICE);	//送信完了のメッセージを出す
					}
					//通信失敗時
					,error:function(xhr, status, error){
						//throw new (status + ":" + MESSAGE_FAILED_CONNECT);
						//送信完了と共に入力ダイアログを消す
						alert(MESSAGE_SEND_FAILED_SIMPLE_NOTICE);	//送信失敗のメッセージを出す
					}
				});
		
		// @TODO 結果をどうしいのかはまだ未定
		//return resultwork
		
		}
	}

	/* 本村さんのメルマガ送信関数 改修中 */
	this.sendMailmagazine = function() {
		var dialogClass = $(this)[0].instance;	//クラスインスタンス取得
		
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
			//メルマガをDBに新規登録する
			data.creator.setDBdata(data.creator.json.insertMailMagazine, data, '');
			var resultwork = null;
			alert("メルマガを送信しました。");
		}
	}
	
	//目安箱としてメールを送信する
	/* 								sendSuggest(
											sendData['user_key']
											,sendData['suggest_type']
											,sendData['suggest_content']
											,sendData['suggest_title']
	 							);
	 							*/	
									//通常メールとして送信する
	/* 								sendMemberMail(
											sendData['user_key']
											,sendData['suggest_content']
											,sendData['suggest_title']
	 */								
	
	
	
}

/* ログイン前の準備関数 */
function beforeLoginProcedure(){
	//ログインダイアログのJSONが用意されていなければ
	if(util.checkEmpty(creator)|| !(LOGIN_DIALOG in creator.json)){
		//ログインダイアログのJSONを取得する
		creator.getJsonFile(PATH_LOGIN_DIALOG_JSON);
	}
}
//ここまでログインダイアログの関数

//体験レッスン予約ダイアログ関連関数
//予約ダイアログの準備関数
function beforeOpenSpecialReservedDialog(){
	//予約ダイアログのインスタンスを取得する。
	var specialReservedDialogClass = $('.specialReservedDialog')[0].instance;
	
	//日付の配列を取り出す。
	var array = specialReservedDialogClass.argumentObj.date;
	var content = specialReservedDialogClass.argumentObj.contentName;
	// ダイアログのデータを格納する連想配列を宣言し、引数の配列に格納されたコンテンツ名と予約希望日時を格納する。
	reservedData = {'year': array[0], 'month': array[1], 'day': array[2]};
	
	// 全ての曜日のチェックボックスにチェックする
	allCheckbox('.allDayCheckbox', 'input[name="dayOfWeek"]');
	// 全ての週のチェックボックスにチェックする
	allCheckbox('.allWeekCheckbox', 'input[name="week"]');
	
	// ダイアログに日付欄を追加する。
	createSpecialDate(reservedData['year'], reservedData['month'], reservedData['day']);
};

//ダイアログのクローズするときにダイアログのdomを消去してリセットする
/* 関数名:disappear
 * 概要　:ダイアログをクローズするときにダイアログのdomを消去してリセットする
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function disappear(){
	//ダイアログをdomごと削除する
	this.instance.destroy();
}

/*
 * 関数名:lessonListDialogSendObject
 * 引数  :strig: calendarDate:カレンダーをクリックしたときに返ってくる日付の値
 		string:dialogOptionName:ダイアログのオプションの名前
 * 戻り値:object:sendObject:授業一覧ダイアログを開く時に渡される連想配列
 * 概要  :カレンダーをクリックしたときにその日付をダイアログのタイトルにセットし、日付を連想配列にして返す
 * 作成日:2015.08.06
 * 作成者:T.Yamamoto
 */
function lessonListDialogSendObject(calendarDate, dialogOptionName){
	//ダイアログのタイトルの日付を日本語名にして取得する
	var dialogTitle = changeJapaneseDate(calendarDate);
	//ダイアログのタイトルをセットして予約日を分かりやすくする
	dialogExOption[dialogOptionName].argumentObj.config[TITLE] = dialogTitle;
	//予約ダイアログを開くのに必要なデータである日付を連想配列に入れる
	var sendObject = {
		//予約日付をセットし、どの日に予約するのかを識別する
		lessonDate:calendarDate
	};
	//予約データ連想配列を返し、ダイアログに渡すのに使う
	return sendObject;
}

/* 
 * 関数名:dbDataTableValueReplace
 * 概要　:データベースから取り出したテーブルについて、値を置換する
 * 引数　:string:tableName:値を置換する対象のテーブル名
 		:string:replaceFuncName:置換を行う関数名
 		:boolean:lessonList:置換するテーブルが授業を一覧で表示する(会員、管理者両方にあてはまる)テーブルであるなら受講人数を使うかどうかの判定
 		:creatTagInstance:creator:クリエイトタグのインスタンス名
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function dbDataTableValueReplace(tableName, replaceFuncName, lessonList, creator) {
	//テーブルを置換が終えるまで画面に表示しなくする
	$(DOT + tableName).hide();
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		//置換を行うテーブルのデータを取得する
		var tableData = creator.json[tableName].table;
		//第三引数がtrueなら授業受講者人数を求めた上で関数を実行する
		if(lessonList) {
			//時間割1限分の生徒の合計人数が入った連想配列を作る
			var timeStudentsCount = getTotalStudentsOfTimeTable(tableData);
			//テーブルの値を置換する
			dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, timeStudentsCount);
		} else {
			//テーブルの値を置換する
			dbDataTableReplaceExecute(DOT + tableName, tableData, replaceFuncName, '');
		}
		//テーブルを画面に表示する
		$(DOT + tableName).show();
	},1);
}

/* 関数名:tableReplaceAndSetClass
 * 概要　:テーブルを置換し、さらに行に対してクラス属性を付ける
 * 引数　:string:tableName:テーブル名
 		string :tableReplaceFunc:テーブル置換関数名
		bool:replaceBool:置換するときにレッスン合計人数がどうかの判定
		string:recordClassName:行につけるクラス属性名
 * 返却値:なし
 * 作成日　:2015.08.08
 * 作成者　:T.Yamamoto
 */
function tableReplaceAndSetClass(tableName, tableReplaceFunc, replaceBool, creator, recordClassName) {
	//予約可能授業一覧を置換する
	dbDataTableValueReplace(tableName, tableReplaceFunc, replaceBool, creator);
	//予約一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	setTableRecordClass(tableName, recordClassName);
}

/* 
 * 関数名:insertConfirmReserveJsonDialogValueEx
 * 概要  :授業一覧レコードの値を予約確定ダイアログのJSONに渡す。
 * 引数  :Object targetJson:値を渡す元となるオブジェクト
 		String:dialogJsonKey:ダイアログのkey名
 		:Object creator:　creatorクラスオブジェクト
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.31
 */
function insertConfirmReserveJsonDialogValueEx(targetJson, dialogJsonKey, creator){
	//値を格納するオブジェクトの、可能なまで深い参照を変数に格納する
	var object = creator.json[targetJson];
	//ダイアログを作るクラスで受け取った値を扱いやすくするため変数に入れる
	var receivedObject = $(DOT + dialogJsonKey)[0].instance.getArgumentDataObject();
	//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
	object.lessonConfirm.lessonInfo.timeSchedule.text = buildHourFromTo(receivedObject);	//受講時間
	object.lessonConfirm.lessonInfo.store.text = receivedObject.school_name;				//店舗名
	object.lessonConfirm.lessonInfo.course.text = receivedObject.lesson_name;				//授業テーマ
	object.lessonConfirm.lessonInfo.price.text = sumCost(receivedObject);					//受講料
	object.attention.cancelRateValue.lesson_key.value = receivedObject.lesson_key;			//受講授業id(キャンセル)
	object.attention.addPointValue.lesson_key.value = receivedObject.lesson_key;			//受講授業id(加算ポイント)
}

/*
 * 関数名:getClickTableRecordData
 * 概要　:クリックされたテーブルの行にある連想配列のデータを取得する。
 		使い方としてクリックイベントの中で使う
 * 引数　:string:tableName:データ取得対象のテーブルクラス名
 		string:clickRecordClassName:クリックされたレコードのクラス名
 		createTagInstance:creator:クリエイトタグインスタンス名
 * 返却値:object:returnObject:取得したデータの結果
 * 作成日　:2015.08.08
 * 作成者　:T.Yamamoto
 */
function getClickTableRecordData(clickTarget, tableName, clickRecordClassName, creator) {
	//クリックされたのが何行目なのかを取得する。ここでのthisはクリックされた時に要素を指す
	var rowNum = $(DOT + clickRecordClassName).index(clickTarget);
	//次のダイアログに渡すデータを変数に入れる
	var recordObject = creator.json[tableName][TABLE][rowNum];
	//取得したデータを返却する
	var returnObject = {
		number:rowNum,			//クリックされた行番号
		data:recordObject		//クリックされた行のデータ
	}
	//取得した行の番号とデータを返す
	return returnObject;
}

/*
 * 関数名:getDialogTitleDate
 * 概要　:ハイフン形式の日付から日付を日本語表記にしたものを取得する
 * 引数　string: date:日付
 * 返却値:string:returnDate:日本語名にした結果の日付
 * 作成日　:2015.08.08
 * 作成者　:T.Yamamoto
 */
function getDialogTitleDate(date) {
	//日付のハイフンを置換前のスラッシュ区切りにする
	var date = date.replace(/-/g,"/");
	// 日付を日本語表示にする
	var titleDate = changeJapaneseDate(date);
	//日付を返す
	return titleDate;
}

/* 
 * 関数名:cancelDialogOpen
 * 概要  :予約キャンセルダイアログを開く
 * 引数  :object:dialogData:キャンセルダイアログを開くときに必要なデータ
 		string dialogTitleDate:ダイアログタイトルに使う日付
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function cancelDialogOpen(dialogData, dialogTitleDate) {
	//キャンセルダイアログ用のオプションを取得する
	var dialogOption = $.extend(true, {}, dialogExOption[CANCEL_LESSON_DIALOG].argumentObj);
	//ダイアログのタイトルをセットして予約日を分かりやすくする
	dialogOption.config[TITLE] = dialogTitleDate;

	$.extend(true, 							//dataオブジェクトを統合する
			dialogOption.data,				//新たにオブジェクトを作り、そこにまとめる
			dialogData		 				//選択された行データ
	);
	
	console.log(dialogOption);
	
	//予約キャンセルダイアログを作る
	var cancelLessonDialog = new dialogEx(
			DIALOG_CANCEL_LESSON, 
			dialogOption,
			dialogExOption[CANCEL_LESSON_DIALOG].returnObj
		);
	cancelLessonDialog.setCallbackClose(cancelLessonDialogClose);	//閉じるときのイベントを登録
	cancelLessonDialog.run();	//主処理を走らせる。
}

/* 
 * 関数名:cancelDialogOpenFromReservedTable
 * 概要  :予約キャンセルダイアログを予約済み授業から開くための関数
 * 引数  :int memberNumber:会員番号
 * 　　  :createLittleContents creator:createLittleContentsクラスインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.31
 * 変更者:T.Masuda
 * 変更日:2015.08.09
 * 内容	:改修したdialogExクラスに対応しました。
 */
function cancelDialogOpenFromReservedTable (memberNumber, creator) {
	//予約中授業テーブルの行がクリックされたときに予約キャンセルダイアログを出す処理
	$(STR_BODY).on(CLICK, DOT + RESERVED_LESSON_TABLE_RECORD , function(){
		var recordData = getClickTableRecordData(this, RESERVED_LESSON_TABLE, RESERVED_LESSON_TABLE_RECORD , creator);
		//ダイアログに送信するデータ(クリックしたテーブルのデータとユーザの会員番号を合わせた連想配列)を連想配列型変数に入れる
		//@mod 2015.0809 T.Masuda creatorもsendObjectに含む様にしました
		var sendObject = $.extend(true, {userId:memberNumber}, {'creator':creator}, recordData.data);
		//日付を日本語表示にする
		var titleDate = getDialogTitleDate(sendObject.lesson_date);
		//キャンセルダイアログを開く
		cancelDialogOpen(sendObject, titleDate);
	});
}


/* 関数名:memberReservedConfirmDialogClose
 * 概要　:会員top、予約確認ダイアログでokボタンが押された時の処理を登録する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 * 変更日　:2015.08.09
 * 変更者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function memberReservedConfirmDialogClose() {
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	
	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		
		if(!data.user_work_status) {
			//DBにデータを挿入して予約処理をする
			dialogClass.creator.setDBdata(dialogClass.creator.json.sendReservedData, data, MESSAGE_SUCCESS_RESERVED);
			//以前にキャンセルしたことがある授業の場合
		} else {
			//DBにデータの更新で予約処理をする
			dialogClass.creator.setDBdata(dialogClass.creator.json.updateReservedData, data, MESSAGE_SUCCESS_RESERVED);
		}
		
		//会員トップ画面、予約中授業一覧ダイアログをリロードして最新の状態にする
		data.creator.tableReload(RESERVED_LESSON_TABLE);
		//予約授業一覧ダイアログのテーブルをリロードして最新の状態にする
		data.reservedListCreator.tableReload(LESSON_TABLE);
	}
}

/* 関数名:cancelLessonDialogClose
 * 概要　:会員top、予約キャンセルダイアログでokボタンが押された時の処理を登録する
 * 引数　:sendObject:送信する連想配列データ
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 * 修正日　:2015.08.09
 * 修正者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function cancelLessonDialogClose() {
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する
	
	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		//ダイアログの呼び出し元で違うcreateLittleContentsクラスインスタンスを利用する
		var creator = data.reservedListCreator !== void(0)?	data.reservedListCreator: data.creator;
		//変更者:T.Yamamoto 変更日:2015.06.27 内容:予約が完了する処理(DBのデータを更新する処理)を関数化しました。
		//変更者:T.Masuda 変更日:2015.08.09 ダイアログのクラスインスタンスに持たせたcreateLittleContentsクラスに関数をコールさせます。
		creator.setDBdata(creator.json.cancelReservedData, data, MESSAGE_SUCCESS_CANCELED);
	
		//予約可能授業一覧テーブルがあればテーブルをリロードする
		if(data.reservedListCreator !== void(0)) {
			//予約可能授業一覧テーブルをリロードする
			data.reservedListCreator.tableReload(LESSON_TABLE);
		}
		
		//予約がキャンセルされたことを分かりやすくするためにテーブルを再読み込みし、予約していた内容が消えることをすぐに確認できるようにする
		data.creator.tableReload(RESERVED_LESSON_TABLE);
	}
}

/* 
 * 関数名:newLessonEntry
 * 概要  :管理者、授業詳細タブで新規に授業をDBに登録する処理
 * 引数  :
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.03
 * 修正日　:2015.08.09
 * 修正者　:T.Masuda
 * 内容	　:改修したdialogExクラスに対応しました。また、改名しました
 */
function newLessonEntry() {
	
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
	
		//時限データを入れる変数を作り、すでにある時限についてはこの変数を使うようにする
		var timeTableDayKey = "";
		//授業一覧のデータを長さを取得し、ループが終わる回数として使う
		var loopEndCount = data.tableData.length;
		//新規授業追加ダイアログで入力された値を取得し、DBに値をinsertする時に使う
		var newLesoonData = getInputData('lessonData');
		
		//受け取った授業一覧データから時限データを探す
		for(var loopStartCount = 0; loopStartCount < loopEndCount; loopStartCount++) {
			//time_table_day_keyが空白のものはループを飛ばす
			if(data.tableData[loopStartCount]['time_table_day_key'] == "") {
				//次のループに行く
				continue;
			}
			//新規授業作成データの時限データが見つかった時の処理
			if(newLesoonData['timetable_key'] == data.tableData[loopStartCount]['timetable_key'] && data.tableData[loopStartCount]['time_table_day_key'] != "") {
				//時限データを取得し、ループを終える
				timeTableDayKey = data.tableData[loopStartCount]['time_table_day_key'];
				//ループを終わらせる
				break;
			}
		}
		
		//新しく授業データを作るために授業日を連想配列に入れる
		var lessonData = {lessonDate:data.lessonDate,
						time_table_day_key:timeTableDayKey}
		//新しく授業データを挿入するために日付データを含めて送信する
		var sendReplaceQuery = $.extend(true, {}, newLesoonData, lessonData);
		
		//時限データが空のときは新規時限データを作成し、そのあとに授業データを作成する
		if(timeTableDayKey == EMPTY_STRING) {
			//時限データテーブルに対してinsert処理を行い、次の授業データを新しく作るための準備をする
			var errorCount = dialogClass.creator.setDBdata(dialogClass.creator.json.insertTimeTableDay, sendReplaceQuery, EMPTY_STRING);
			//失敗件数が0でないなら授業データを新しく作るクエリを発行する
			if (errorCount != 0) {
				//新規に授業のデータをDBに登録する
				dialogClass.creator.setDBdata(dialogClass.creator.json.newClassWork, sendReplaceQuery, '新規授業の作成に成功しました。');
			}
		//予約する時限があった時にそれを使って新規授業を作成する
		} else {
			//すでにある時限データを使って授業データを作る
			dialogClass.creator.setDBdata(dialogClass.creator.json.normalInsertClasswork, sendReplaceQuery, '新規授業の作成に成功しました。');
		}
		//授業詳細一覧テーブルを更新する
		data.creator.tableReload('adminLessonDetailTable');
	}
}

/* 関数名:onCloseLessonDetailDialog
 * 概要　:管理者画面 授業詳細ダイアログが閉じたときのためのイベント。
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.09
 * 作成者　:T.Masuda
 */
function onCloseLessonDetailDialog(){
	//createLittleContentsクラスインスタンスを取り出すため、argumentObjectのdataを取り出す
	var data = this.instance.getArgumentDataObject();	
	//更新に合わせ、対象のテーブルの値を更新する
	data.creator.tableReload('adminLessonDetailTable');
	this.instance.destroy();		//ダイアログを完全に破棄する
}


/* 関数名:dialogDestroy
 * 概要　:ダイアログを破棄する。コールバック関数用の構成。
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.09
 * 作成者　:T.Masuda
 */
function dialogDestroy() {
	//ダイアログをDOMごと破棄する
	$(this)[0].instance.destroy();
}


// 以下、本村さん作成部分
var SimpleConfirmDialog = function(yesFunc, message) {
	this.message = message;									// 確認メッセージ
	this.targetHtml = "dialog/simpleConfirmDialog.html";	// ダイアログ本体html
	this.noFunc = null;										// いいえの時のメソッド
	this.closeFunc = null;									// 閉じるためのメソッド
	this.yesCaption = "はい";								// はいボタンのキャプション
	this.noCaption = "いいえ";								// いいえボタンのキャプション

	var rapDestroy = function(){
		if(this.dialogCreator) {
			return this.dialogCreator.destroy();
		}
		return null;
	};
	
	this.yesFunc = function(){
		yesFunc();
		return rapDestroy();
	};
	
	// ダイアログ表示
	this._showDialog = function() {
		
		// 閉じる機能もいいえ機能もデフォルトは閉じるだけ
		if(!this.noFunc) {
			this.noFunc = function(){return rapDestroy();};
		}
		
		// パラメター設定
		var params = {
				yesFunc:this.yesFunc
				,noFunc:this.noFunc
				,yesCaption:this.yesCaption
				,noCaption:this.noCaption
				,message:this.message
		};
		
		dialogCreator = new dialogEx(this.targetHtml, params, dialogExOption[CONFIRM_DIALOG]);
		// 閉じる機能もいいえ機能もデフォルトは閉じるだけ
		if(!this.closeFunc) {
			this.closeFunc = function(){return rapDestroy();};
		}
		dialogCreator.setCallbackClose(this.closeFunc);
		
		// 表示実行
		dialogCreator.run();
	};
	
	this.setNoFunc = function(func) {
		this.noFunc = func;
	};
	
	this.setCloseFunc = function(func) {
		this.closeFunc = func;
	};
	
	this.setYesCaption = function(caption) {
		this.yesCaption = caption;
	};
	
	this.setNoCaption = function(caption) {
		this.noCaption = caption;
	};
};

/* 関数名:doSendMail
 * 概要　:メールを送信する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.10
 * 作成者　:T.Masuda
 */
function doSendMail(){
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		// メールを送信する処理
		//メール送信用のデータを取得する
		var sendMaidData = getInputData('mailSendContent');
		//送信完了と共に入力ダイアログを消す
		data.dialog.formDom.dialog(CLOSE);
		alert(MESSAGE_SEND_SIMPLE_NOTICE);	//送信完了のメッセージを出す
	}
};

/* 
 * 関数名:announceInsert
 * 概要  :管理者会員一覧でお知らせのダイアログから送信ボタンがクリックされてお知らせテーブルに対して新規データの作成を行う
 * 引数  :
 * 返却値 :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function announceInsert(){
	var dialogClass = this.instance;			//ダイアログのクラスインスタンスを取得する

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
	//@mod 2015.0811 T,Masuda 山本さんが再度着手するまで一旦処理を凍結します。
	//入力されたお知らせメッセージのデータを取得する
//	var announceData = getInputData('mailSendContent');
//	//DBにメッセージ登録のクエリを投げる
//	mailDialogCreator.setDBdata(mailDialogCreator.json.insertMessageInf, announceData, '');
//	//ループでメッセージ宛先を登録するため、登録する宛先となる会員番号が何個あるか取得する
//	var loopEndCount = $('.adminMailDialogContent')[0].instance.argumentObj.memberNumber.length;
//	//ループでメッセージ宛先の情報を登録する
//	for(var loopStartCounter = 0; loopStartCounter < loopEndCount; loopStartCounter++) {
//		//ループ中の会員番号を取得する
//		var sendReplaceArray = {
//			user_key:$('.adminMailDialogContent')[0].instance.argumentObj.memberNumber[loopStartCounter]
//		};
//		//宛先テーブルを更新する
//		mailDialogCreator.setDBdata(mailDialogCreator.json.insertMessageTo, sendReplaceArray, '');
//	}
		//送信完了と共に入力ダイアログを消す
		data.dialog.formDom.dialog(CLOSE);
		alert(MESSAGE_SEND_SIMPLE_NOTICE);	//送信完了のメッセージを出す
	}
}
