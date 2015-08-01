//会員top予約授業一覧テーブル
LESSON_TABLE 						= 'lessonTable';
MEMBER_RESERVED_CONFIRM_DIALOG		= 'memberReservedConfirmDialog';
CANCEL_LESSON_DIALOG 				= 'cancelLessonDialog';
ADMIN_LESSONLIST_DIALOG 			= 'adminLessonListDialog';
LESSON_DETAIL_DIALOG 				= 'lessonDetailDialog';

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
		//変数に予約一覧テーブルのjsonの連想配列を入れる
		var lessonTable = reserveLessonListCreator.json[LESSON_TABLE].table;
		// 時間割1限分の生徒の合計人数が入った連想配列を作る
		var timeStudentsCount = getTotalStudentsOfTimeTable(lessonTable);
		//予約一覧テーブルの値を置換する
		lessonReservedTableValueInput(DOT + LESSON_TABLE, lessonTable, "callReservedLessonValue", timeStudentsCount);
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
		//予約一覧テーブルを表示する
		openAdminLessonDetailDialog();
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
 * 概要　:管理者需要詳細ダイアログを開く
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
		console.log(sendObject);
		//予約キャンセルダイアログを作る
		var cancelLessonDialog = new dialogEx('dialog/cancelLessonDialog.html', sendObject, dialogExOption[CANCEL_LESSON_DIALOG]);
		//ダイアログを開くときのテーブルの値を編集して表示する
		// cancelLessonDialog.setCallbackOpen(reservedLessonListDialogOpenFunc);
		cancelLessonDialog.setCallbackClose(cancelLssonDialogCloseFunc);	//閉じるときのイベントを登録
		cancelLessonDialog.run();	//主処理を走らせる。
	});
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


