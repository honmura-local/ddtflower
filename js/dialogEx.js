/* ファイル名:dialogEx.js
 * 概要　　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 設計者　:H.Kaneko
 * 作成日　:2015.0729
 * 作成者　:T.Masuda
 * 場所　　:js/dialogEx.js
 */

//定数を定義する
SPECIAL_RESERVED_CONFIRM_DIALOG_URL = 'dialog/specialReservedConfirmDialog.html';	//体験レッスン予約確認ダイアログのHTMLファイルのURL

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
	this.argumentObj = argumentObj;
	//設定用オブジェクトを格納するメンバ
	this.returnObj = returnObj !== void(0)? returnObj : {};
	//デフォルト設定のオブジェクト
	this.defaultObj = {
			width: 'auto',		//幅を自動調整する
			autoOpen : true,	//作成時の自動オープンを無効にする
			modal : true,		//モーダル表示
			resizable : false,	//ドラッグでのリサイズ可否
			//表示位置の指定。
			position :{my:'center top',at:'center top', of:window},
			closeOnEscape : false	//escキーを押して閉じるか
	};
	
	/* 関数名:load
	 * 概要　:URLからダイアログのHTMLファイルを取得してメンバに保存する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.load = function(){
		//クラスインスタンスへの参照を変数に格納しておく。
		var tmpThis = this;
		
		//Ajax通信でURLからHTMLを取得する。
		$.ajax({
			url:this.url,			//URLを設定する
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
			//メンバのURLからHTMLデータを読み込む
			this.load();
			//returnObjが空オブジェクトであれば、デフォルト用に用意したオブジェクトをセットする
			this.returnObj = Object.keys(this.returnObj).length? this.returnObj: this.defaultObj;
			var form = $(this.formDom)[0];	//ダイアログのDOMを取得する
			form.instance = this;			//ダイアログのDOMにクラスインスタンスへの参照を持たせる。
			//取得したHTMLデータをjQueryUIのダイアログにして、そのダイアログへの参照をメンバに格納する。
			//※this.formDomへはjQueryオブジェクトとしてformDomへの参照が代入される。
			//*formDom内のHTMLにscriptタグが記述されていた場合、このコード実行時にscriptタグのコードが動き出す。
			this.formDom = $(form).dialog(this.returnObj);
		//例外をキャッチしたら
		} catch(e){
			console.log(e.message);	//投げられたエラーオブジェクトをコンソールログに出す。
		}
	}

	/* 関数名:setCallbackClose
	 * 概要　:ダイアログのcloseイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.setCallbackClose = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function? this.returnObj['close'] = func: console.log('setCallBackClose recieved enythingeles function');
	}

	/* 関数名:setCallbackOpen
	 * 概要　:ダイアログのopenイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.setCallbackOpen = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.returnObj['open'] = func: console.log('setCallBackOpen recieved enythingeles function');
	}
	
	/* 関数名:setCallbackCreate
	 * 概要　:ダイアログのcreateイベントのコールバック関数をセットする。
	 * 引数　:function func:コールバック関数で実行される関数のポインタ
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.setCallbackCreate = function(func){
		//引数が関数であれば、closeイベントのコールバック関数として登録する。
		func instanceof Function?  this.returnObj['create'] = func: console.log('setCallBackCreate recieved enythingeles function');
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
		//jQuery UIのダイアログを破棄する
		$dialog.dialog('destroy');
		//画面上に展開されているダイアログのDOMを破棄する。
		$dialog.remove();
	}
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

LESSON_TABLE 						= 'lessonTable';					//会員画面予約授業一覧テーブル
MEMBER_RESERVED_CONFIRM_DIALOG		= 'memberReservedConfirmDialog';	//会員画面予約確認ダイアログ
CANCEL_LESSON_DIALOG 				= 'cancelLessonDialog';				//会員画面予約キャンセルダイアログ
ADMIN_LESSONLIST_DIALOG 			= 'adminLessonListDialog';			//管理者画面授業設定一覧ダイアログ
LESSON_DETAIL_DIALOG 				= 'lessonDetailDialog';				//管理者画面授業詳細設定ダイアログ
ADMIN_NEW_LESSON_CREATE 			= 'adminNewLessonCreateDialog';		//管理者画面新規授業作成ダイアログ


//ダイアログのクローズするときにダイアログのdomを消去してリセットする
function disappear(){
	$('.reserveLessonListContent')[0].instance.destroy();
}

/* 関数名:reservedLessonListDialogCloseFunc
 * 概要　:会員top、予約授業一覧ダイアログが閉じるときにコールされる関数一覧。初期化処理を行う
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function reservedLessonListDialogCloseFunc() {
	//読み込んだテーブルのデータを消して初期化し、次に別のデータを開くときに備える
	creator.json[LESSON_TABLE].table = {};
	//予約中授業一覧ダイアログをリロードして最新の状態にする
	tableReload(RESERVED_LESSON_TABLE);
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.reserveLessonListContent')[0].instance.destroy();
}

/* 関数名:reservedLessonListDialogOpenFunc
 * 概要　:会員top、予約授業一覧ダイアログが開くときにコールされる関数一覧。テーブルの値を置換する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function reservedLessonListDialogOpenFunc() {
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		// 時間割1限分の生徒の合計人数が入った連想配列を作る
		var timeStudentsCount = getTotalStudentsOfTimeTable(reserveLessonListCreator.json[LESSON_TABLE].table);
		//予約一覧テーブルの値を置換する
		lessonReservedTableValueInput(DOT + LESSON_TABLE, reserveLessonListCreator.json[LESSON_TABLE].table, "callReservedLessonValue", timeStudentsCount);
		//予約一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
		setTableRecordClass(LESSON_TABLE, 'targetLessonTable');
		//予約一覧テーブルを表示する
		$(DOT + LESSON_TABLE).show();
	},1);
}

/* 関数名:adminLessonListDialogOpenFunc
 * 概要　:管理者授業一覧ダイアログが開くときにコールされる関数一覧。テーブルの値を置換する
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function adminLessonListDialogOpenFunc() {
	//テーブルの値を変換するため、テーブルを隠す
	$('.adminLessonDetailTable').hide();
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		//変数に管理者授業詳細一覧テーブルのjsonの連想配列を入れる
		var lessonTable = adminLessonListCreator.json['adminLessonDetailTable'].table;
		// 時間割1限分の生徒の合計人数が入った連想配列を作る
		var timeStudentsCount = getTotalStudentsOfTimeTable(lessonTable);
		//管理者授業詳細一覧テーブルの値を置換する
		lessonReservedTableValueInput(DOT + 'adminLessonDetailTable', lessonTable, 'callAdminReservedLessonValue', timeStudentsCount);
		//管理者授業詳細一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
		setTableRecordClass('adminLessonDetailTable', 'targetAdminLessonRecord');
		//テーブルの行がクリックされたときに授業詳細ダイアログを開く
		openAdminLessonDetailDialog();
		//新規作成ボタンがクリックされたら授業新規作成ダイアログを開く
		openAdminNewLessonCreateDialog();
		//値の変換が終わればテーブルを表示する
		$('.adminLessonDetailTable').show();
	},1);
}

/* 関数名:adminLessonListDialogCloseFunc
 * 概要　:管理者授業一覧ダイアログが閉じるときにコールされる関数一覧。初期化処理を行う
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function adminLessonListDialogCloseFunc() {
	//読み込んだテーブルのデータを消して初期化し、次に別のデータを開くときに備える
	adminLessonListCreator.json['adminLessonDetailTable'].table = {};
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.adminLessonListContent')[0].instance.destroy();
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
	var receivedObject = $(DOT + dialogJsonKey)[0].instance.argumentObj;
	//順次オブジェクトから取り出したデータをJSONのしかるべき場所にセットしていく
	//受講時間
	object.lessonConfirm.lessonInfo.timeSchedule.text = buildHourFromTo(receivedObject);
	//店舗名
	object.lessonConfirm.lessonInfo.store.text = receivedObject.school_name;
	//授業テーマ
	object.lessonConfirm.lessonInfo.course.text = receivedObject.lesson_name;
	//受講料
	object.lessonConfirm.lessonInfo.price.text = sumCost(receivedObject);
	//受講料単位
	object.lessonConfirm.lessonInfo.priceUnit.text = '円';
	//受講授業id(キャンセル)
	object.attention.cancelRateValue.lesson_key.value = receivedObject.lesson_key;
	//受講授業id(加算ポイント)
	object.attention.addPointValue.lesson_key.value = receivedObject.lesson_key;
}

/* 関数名:openMemberReservedConfirmDialog
 * 概要　:会員top、予約確認ダイアログを開く処理
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function openMemberReservedConfirmDialog() {
	//予約確認ダイアログを表示する処理
	$('.reserveLessonListContent').on(CLICK, '.targetLessonTable', function(){
		//クリックしたセルの親の行番号を取得する
		var rowNum = $('.targetLessonTable').index(this);
		//残席の記号を取得する
		var restMarkNow = $('.targetLessonTable' +':eq(' + (rowNum) + ') td').eq(4).text();
		//残席が✕でないものでかつ、会員が受講できないようになっている授業(NFDなど)についてはクリックして予約確認ダイアログは開かない
		if (reserveLessonListCreator.json[LESSON_TABLE][TAG_TABLE][rowNum][COLUMN_NAME_DEFAULT_USER_CLASSWORK_COST] && restMarkNow != '✕') {
			//次のダイアログに渡すデータを変数に入れる
			var sendObject = reserveLessonListCreator.json[LESSON_TABLE][TAG_TABLE][rowNum];
			//予約する人が誰なのかを分かりやすくするために会員番号を送信する連想配列に入れる
			sendObject['userId'] = reserveLessonListCreator.json.lessonTable.user_key.value;
			//日付のハイフンを置換前のスラッシュ区切りにする
			var date = sendObject.lesson_date.replace(/-/g,"/");
			// 日付を日本語表示にする
			var titleDate = changeJapaneseDate(date);
			//予約が初めてのときに予約ダイアログを開く
			if(!reserveLessonListCreator.json[LESSON_TABLE][TAG_TABLE][rowNum]['user_work_status'] || reserveLessonListCreator.json[LESSON_TABLE][TAG_TABLE][rowNum]['user_work_status'] == 10) {
				//ダイアログのタイトルをセットして予約日を分かりやすくする
				dialogExOption[MEMBER_RESERVED_CONFIRM_DIALOG]['title'] = titleDate;
				//予約授業一覧ダイアログを作る
				var memberReservedConfirmDialog = new dialogEx('dialog/memberReservedConfirmDialog.html', sendObject, dialogExOption[MEMBER_RESERVED_CONFIRM_DIALOG]);
				//ダイアログを開くときのテーブルの値を編集して表示する
				// memberReservedConfirmDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
				memberReservedConfirmDialog.setCallbackClose(memberReservedConfirmDialogCloseFunc);	//閉じるときのイベントを登録
				memberReservedConfirmDialog.run();	//主処理を走らせる。

			//すでに予約しているのであればキャンセルダイアログを開く
			} else if (reserveLessonListCreator.json[LESSON_TABLE][TAG_TABLE][rowNum]['user_work_status'] == 1) {
				//ダイアログのタイトルをセットして予約日を分かりやすくする
				dialogExOption[CANCEL_LESSON_DIALOG]['title'] = titleDate;
				//予約キャンセルダイアログを作る
				var cancelLessonDialog = new dialogEx('dialog/cancelLessonDialog.html', sendObject, dialogExOption[CANCEL_LESSON_DIALOG]);
				//ダイアログを開くときのテーブルの値を編集して表示する
				// cancelLessonDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
				cancelLessonDialog.setCallbackClose(cancelLssonDialogCloseFunc);	//閉じるときのイベントを登録
				cancelLessonDialog.run();	//主処理を走らせる。
			}
		}
	});
}

/* 関数名:openAdminLessonDetailDialog
 * 概要　:管理者授業詳細ダイアログを開く
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function openAdminLessonDetailDialog() {
	//レコードをクリックして授業詳細ダイアログを開くイベントを登録する
	//予約決定ダイアログを表示する処理
	$('.adminLessonListContent').on(STR_CLICK, '.targetAdminLessonRecord', function(){
		//クリックしたセルの行番号を取得する
		var rowNum = $('.targetAdminLessonRecord').index(this);
		//次のダイアログに渡すデータを変数に入れる
		var sendObject = adminLessonListCreator.json['adminLessonDetailTable'][TAG_TABLE][rowNum];
		//次のダイアログに時間割を渡すためにテーブルに表示されている時間割の値を取得する
		var timeSchedule = $('.targetAdminLessonRecord:eq(' + rowNum + ') td').eq(0).text();
		//時間割を次のダイアログに入れるためのデータに入れる
		sendObject['time_schedule'] = timeSchedule;
		//日付のハイフンを置換前のスラッシュ区切りにする
		var date = sendObject.lesson_date.replace(/-/g,"/");
		// 日付を日本語表示にする
		var titleDate = changeJapaneseDate(date);
		//ダイアログのタイトルをセットして予約日を分かりやすくする
		dialogExOption[LESSON_DETAIL_DIALOG]['title'] = titleDate;
		//授業詳細ダイアログを作る
		var lessonDetailDialog = new dialogEx('dialog/lessonDetailDialog.html', sendObject, dialogExOption[LESSON_DETAIL_DIALOG]);
		//ダイアログを開くときのテーブルの値を編集して表示する
		// memberReservedConfirmDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
		lessonDetailDialog.setCallbackClose(adminLessonDetailDialogCloseFunc);	//閉じるときのイベントを登録
		lessonDetailDialog.run();	//主処理を走らせる。
	});
}

/* 関数名:adminNewLessonCreateDialogCloseFunc
 * 概要　:管理者新規授業作成ダイアログが閉じた時のイベント登録関数
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.01
 * 作成者　:T.Yamamoto
 */
function adminNewLessonCreateDialogCloseFunc() {
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.adminNewLessonCreateContent')[0].instance.destroy();
}

/* 関数名:openAdminNewLessonCreateDialog
 * 概要　:管理者新規授業作成ダイアログを開く
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.08.01
 * 作成者　:T.Yamamoto
 */
function openAdminNewLessonCreateDialog() {
	//レコードをクリックして新規授業追加ダイアログを開くイベントを登録する
	$('.adminLessonListContent').on(STR_CLICK, '.lessonAddButton', function(){
		//新規授業追加ダイアログに渡す変数を宣言しておく
		var sendObject = {};
		//日本語名の日付を渡すデータを入れる(DBの形式をそろえるためスラッシュはハイフンに置き換える)
		sendObject['lessonDate'] = $('.adminLessonListContent')[0].instance.argumentObj.lessonDate.replace(/\//g,"-");
		//取得したテーブルの情報があればそれを新規作成ダイアログに渡す
		sendObject['tableData'] = adminLessonListCreator.json.adminLessonDetailTable.table;
		//ダイアログのタイトルをセットして予約日を分かりやすくする
		dialogExOption[ADMIN_NEW_LESSON_CREATE]['title'] = dialogExOption[ADMIN_LESSONLIST_DIALOG]['title'];
		//新規授業追加ダイアログを作る
		var newLessonCreateDialog = new dialogEx('dialog/adminNewLessonCreateDialog.html', sendObject, dialogExOption[ADMIN_NEW_LESSON_CREATE]);
		//ダイアログを開くときのテーブルの値を編集して表示する
		// memberReservedConfirmDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
		newLessonCreateDialog.setCallbackClose(adminNewLessonCreateDialogCloseFunc);	//閉じるときのイベントを登録
		newLessonCreateDialog.run();	//主処理を走らせる。
	});
}

/* 関数名:memberReservedConfirmDialogCloseFunc
 * 概要　:会員top、予約確認ダイアログが閉じるときにコールされる関数一覧。初期化処理を行う
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function memberReservedConfirmDialogCloseFunc() {
	//予約授業一覧テーブルをリロードして最新の状態にする
	//tableReload(RESERVED_LESSON_TABLE);
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.memberReservedConfirmDialogContent')[0].instance.destroy();
}

/* 関数名:adminLessonDetailDialogCloseFunc
 * 概要　:管理者授業詳細ダイアログが閉じるときにコールされる関数一覧。初期化処理を行う
 * 引数　:なし
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function adminLessonDetailDialogCloseFunc() {
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.adminLessonDetailContent')[0].instance.destroy();
}

/* 関数名:memberReservedConfirmDialogOkButtonFunc
 * 概要　:会員top、予約確認ダイアログでokボタンが押された時の処理を登録する
 * 引数　:sendObject:送信する連想配列データ
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function memberReservedConfirmDialogOkButtonFunc(sendObject) {
	if(!sendObject.user_work_status) {
		//DBにデータを挿入して予約処理をする
		setDBdata(memberReservedConfirmtCreator.json.sendReservedData, sendObject, MESSAGE_SUCCESS_RESERVED);
	//以前にキャンセルしたことがある授業の場合
	} else {
		//DBにデータの更新で予約処理をする
		setDBdata(memberReservedConfirmtCreator.json.updateReservedData, sendObject, MESSAGE_SUCCESS_RESERVED);
	}

	$('.memberReservedConfirmDialogContent').dialog(CLOSE);			//ダイアログを閉じる
}

/* 関数名:memberReservedConfirmDialogOkButton
 * 概要　:会員top、予約キャンセルダイアログでダイアログが閉じる時の処理
 * 引数　:sendObject:送信する連想配列データ
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function cancelLssonDialogCloseFunc() {
	//予約がキャンセルされたことを分かりやすくするためにテーブルを再読み込みし、予約していた内容が消えることをすぐに確認できるようにする
	tableReload(RESERVED_LESSON_TABLE);
	//ダイアログのdomを削除して初期化し次に開くときに備える
	$('.cancelLessonDialogContent')[0].instance.destroy();
}


/* 関数名:cancelLssonDialogDialogOkButton
 * 概要　:会員top、予約キャンセルダイアログでokボタンが押された時の処理を登録する
 * 引数　:sendObject:送信する連想配列データ
 * 返却値:なし
 * 作成日　:2015.07.31
 * 作成者　:T.Yamamoto
 */
function cancelLssonDialogDialogOkButton(sendObject) {
	//変更者:T.Yamamoto 変更日:2015.06.27 内容:予約が完了する処理(DBのデータを更新する処理)を関数化しました。
	setDBdata(cancelLessonCreator.json.cancelReservedData, sendObject, MESSAGE_SUCCESS_CANCELED);
	//予約がキャンセルされたことを分かりやすくするためにテーブルを再読み込みし、予約していた内容が消えることをすぐに確認できるようにする
	//tableReload(RESERVED_LESSON_TABLE);
	//ダイアログを閉じる
	$('.cancelLessonDialogContent').dialog(CLOSE);
}

/* 
 * 関数名:cancelDialogExOpen
 * 概要  :予約キャンセルダイアログを予約済み授業から開くための関数
 * 引数  :int memberNumber:会員番号
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.31
 */
function cancelDialogExOpen (memberNumber) {
	//予約中授業テーブルの行がクリックされたときに予約キャンセルダイアログを出す処理
	$(STR_BODY).on(CLICK, DOT + 'targetCancelReservedLesson', function(){
		//クリックした行番号を取得する
		var rowNum = $(DOT + 'targetCancelReservedLesson').index(this);
		//ダイアログに送信するデータ(クリックしたテーブルのデータとユーザの会員番号を合わせた連想配列)を連想配列型変数に入れる
		var sendObject = $.extend(true, {userId:memberNumber}, creator.json[RESERVED_LESSON_TABLE][TAG_TABLE][rowNum]);
		//日付を置換前のスラッシュ区切りにする
		var date = sendObject.lesson_date.replace(/-/g,"/");
		//日付を日本語表示にする
		var titleDate = changeJapaneseDate(date);

		//ダイアログのタイトルをセットして予約日を分かりやすくする
		dialogExOption[CANCEL_LESSON_DIALOG]['title'] = titleDate;
		//予約キャンセルダイアログを作る
		var cancelLessonDialog = new dialogEx('dialog/cancelLessonDialog.html', sendObject, dialogExOption[CANCEL_LESSON_DIALOG]);
		//ダイアログを開くときのテーブルの値を編集して表示する
		// cancelLessonDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
		cancelLessonDialog.setCallbackClose(cancelLssonDialogCloseFunc);	//閉じるときのイベントを登録
		cancelLessonDialog.run();	//主処理を走らせる。
	});
}

/* 
 * 関数名:newLessonEntry
 * 概要  :管理者、授業詳細タブで新規に授業をDBに登録する処理
 * 引数  :
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.03
 */
function newLessonEntry() {
	//授業一覧のデータを長さを取得し、ループが終わる回数として使う
	var loopEndCount =$('.adminNewLessonCreateContent')[0].instance.argumentObj.tableData.length;
	//新規授業追加ダイアログで入力された値を取得し、DBに値をinsertする時に使う
	var newLesoonData = getInputData('lessonData');
	//時限データを入れる変数を作り、すでにある時限についてはこの変数を使うようにする
	var timeTableDayKey = "";
	//受け取った授業一覧データから時限データを探す
	for(var loopStartCount = 0; loopStartCount < loopEndCount; loopStartCount++) {
		//time_table_day_keyが空白のものはループを飛ばす
		if($('.adminNewLessonCreateContent')[0].instance.argumentObj.tableData[loopStartCount]['time_table_day_key'] == "") {
			//次のループに行く
			continue;
		}
		//新規授業作成データの時限データが見つかった時の処理
		if(newLesoonData['timetable_key'] == $('.adminNewLessonCreateContent')[0].instance.argumentObj.tableData[loopStartCount]) {
			//時限データを取得し、ループを終える
			timeTableDayKey = $('.adminNewLessonCreateContent')[0].instance.argumentObj.tableData[loopStartCount];
			//ループを終わらせる
			break;
		}
	}
	//新しく授業データを作るために授業日を連想配列に入れる
	var lessonData = {lessonDate:$('.adminNewLessonCreateContent')[0].instance.argumentObj.lessonDate,
					time_table_day_key:timeTableDayKey}
	//新しく授業データを挿入するために日付データを含めて送信する
	var sendReplaceQuery = $.extend(true, {}, newLesoonData, lessonData);
	//時限データが空のときは新規時限データを作成し、そのあとに授業データを作成する
	if(timeTableDayKey == "") {
		//時限データテーブルに対してinsert処理を行い、次の授業データを新しく作るための準備をする
		var errorCount = setDBdata(adminNewLessonCreator.json.insertTimeTableDay, sendReplaceQuery, '');
		//失敗件数が0でないなら授業データを新しく作るクエリを発行する
		if (errorCount != 0) {
			//新規に授業のデータをDBに登録する
			setDBdata(adminNewLessonCreator.json.newClassWork, sendReplaceQuery, '新規授業の作成に成功しました。');
		}
	//予約する時限があった時にそれを使って新規授業を作成する
	} else {
		setDBdata(adminNewLessonCreator.json.normalInsertClasswork, sendReplaceQuery, '新規授業の作成に成功しました。');
	}
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
		
		dialogCreator = new dialogEx(this.targetHtml, params);
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


