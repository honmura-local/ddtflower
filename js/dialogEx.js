/* ファイル名:dialogEx.js
 * 概要　　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 場所　　:js/dialogEx.js
 */

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
 * 変更日　:2015.0813
 * 変更者　:T.Masuda
 * 内容　　:windowExクラスを継承するようにしました。
 */
function dialogEx(url, argumentObj, returnObj){
	//親クラスのコンストラクタを起動する
	windowEx.call(this, url, argumentObj, returnObj);

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
			this.argumentObj = Object.keys(this.argumentObj).length? this.argumentObj: this.defaultArgumentObj;
			
			var form = $(this.dom)[0];	//ダイアログのDOMを取得する
			form.instance = this;		//ダイアログのDOMにクラスインスタンスへの参照を持たせる。
			this.dom = form;			//クラスインスタンスにDOMへの参照を持たせる
			
			$(form).dialog(this.argumentObj.config);	//configの設定を使ってダイアログを作成、表示する
		//例外をキャッチしたら
		} catch(e){
			console.log(e.stack);	//投げられたエラーオブジェクトをコンソールログに出す。
		}
	}

	
	/* 関数名:destroy
	 * 概要　:ダイアログの破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
		//ダイアログのDOMを取得する。
		var $dialog = this.dom !== void(0)? $(this.dom) : $(this);
		var dialogRole = $dialog.attr(ROLE);	//ダイアログのrole属性を取得する
		//ダイアログが確認ダイアログであれば、その親の要素(=元のダイアログ)を取得して処理対象にする
		$dialog = dialogRole !== void(0) && dialogRole.indexOf(CONFIRM_DIALOG) != -1 
			? $(DOT + CONFIRM_DIALOG + SELECTOR_LAST).parent(): $dialog;
		
		//まずはダイアログを閉じる
		$dialog.dialog(CLOSE);
		//jQuery UIのダイアログを破棄する
		$dialog.dialog(DESTROY);
		$dialog.remove();	//DOMを消す
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
		var alertDom = $(this.dom)[0];
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
		var confirm = $(this.dom)[0];
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

	/* 関数名:removeCloseBox
	 * 概要　:ダイアログのクローズボックスを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogCloseBox = function(){
		$(UI_DIALOG_CLOSEBOX + SELECTOR_LAST).remove();
	}
	
	/* 関数名:removeDialogButtons
	 * 概要　:ダイアログの設定で表示するボタンを消す
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0808
	 * 作成者　:T.Masuda
	 */
	this.removeDialogButtons = function(){
		$(UI_DIALOG_BUTTON_PANEL, this.dom.parent()).remove();
	}
	
}

//windowExクラスを継承する
dialogEx.prototype = new windowEx();
//サブクラスのコンストラクタを有効にする
dialogEx.prototype.constructor = windowEx;


/* 後で各ダイアログのJSに移す関数をここに置いておく */
function eachDialogTmp(){
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
	this.sendMemberMail = function() {
		var dialogClass = $(this)[0].instance;	//クラスインスタンス取得
		
		//はいボタンが押されていたら
		if(dialogClass.getPushedButtonState() == YES){
			var data = dialogClass.getArgumentDataObject();		//argumentObjのdataを取得する
			var resultwork = null;								//
			var sendUrl = SEND_MEMBERMAIL_PHP ;	//通常会員メールの送信先PHP
			var sendObject = {									//送信するデータのオブジェクト
					from:data.user_key					//送信元
					,subject:data.suggest_title		//タイトル
					,content:data.suggest_content	//本文
			};
			
			//メールのタイプの数値で送信先PHP、送信データの構成を変える
			switch(parseInt(data.suggestionRadio)){
			//通常会員メールの場合
			case MEMBER_MAIL:break;	//初期化内容が該当するのでなにもしない
			//目安箱メールの場合
			case SUGGESTION_MAIL:
					//目安箱メールならタイプの値を追加する
					$.extend(true, sendObject, {type:data.suggest_type});
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
						if(parseInt(data.suggestionRadio) == SUGGESTION_MAIL){
							//目安箱テーブルに新たにデータを挿入する
							data.creator.setDBdata(data.creator.json.insertSuggestionBox, data, EMPTY_STRING);
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

	/* 本村さんのメルマガ送信関数 改修中 */
	/* 関数名:sendMailmagazine
	 * 概要　:メルマガを送信する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.07xx
	 * 作成者　:A.Honmura
	 * 変更日　:2015.0812
	 * 変更者　:T.Masuda
	 * 内容　	:現行のdialogExクラス用に作り直しました。
	 */
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

//管理者メール送信確認ダイアログのコールバック関数。

/* 関数名:doSendMail
 * 概要　:メールを送信する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.10
 * 作成者　:T.Masuda
 */
function doSendMail(){
	//ダイアログのクラスインスタンスを取得する。コールバックか否かで取得方法が変わる。
	var dialogClass = this.instance !== void(0)? this.instance : this;

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var data = dialogClass.getArgumentDataObject();	//argumentObjのdataを取得する
		// メールを送信する処理
		//メール送信用のデータを取得する
		var sendMaidData = getInputData('mailSendContent');
		//送信完了と共に入力ダイアログを消す
		data.dialog.dom.dialog(CLOSE);
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
 * 修正者:T.Yamamoto
 * 修正日:2015.08.12
 * 内容　:現時点でのdialogExクラスへの対応をしました
 */
function announceInsert(){
	//ダイアログのクラスインスタンスを取得する。コールバックか否かで取得方法が変わる。
	var dialogClass = this.instance !== void(0)? this.instance : this;

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
		data.dialog.dom.dialog(CLOSE);
		alert(MESSAGE_SEND_SIMPLE_NOTICE);	//送信完了のメッセージを出す
	}
}

/*
 * 関数名:submitArticle
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :記事を投稿する
 * 作成日 :2015.08.12
 * 作成者 :T.M
 */
function submitArticle(){
	//ダイアログのクラスインスタンスを取得する。コールバックか否かで取得方法が変わる。
	var dialogClass = this.instance !== void(0)? this.instance : this;

	//はいボタンが押されていたら
	if(dialogClass.getPushedButtonState() == YES){
		var dialogClass = $(this)[0].instance;				//ダイアログのクラスインスタンスを取得する
		var data = dialogClass.getArgumentDataObject();		//インプット用データを取得する
		postForm(data.form);								//フォームを送信する
		//alert(SEND_TO_SERVER_MESSAGE);					//メッセージを出す
	}
}

