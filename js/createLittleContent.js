/* 
 * ファイル名:createLittleContent.js
 * 概要  :小規模の処理の関数を定義する
 * 作成者:T.M
 * 作成日:2015.
 * パス :/js/createLittleContent.js
 */

/**
 * 小規模のパーツ、コンテンツを作るためのJSファイル。
 */

//ブラウザ判別のためのコード。
/*
 * if.useragent.js v0.1
 * info: http://company.miyanavi.net/archives/808
 * auther: miyanavi
 * licence: MIT
 *
 */
var uaName = 'unknown';
var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();
 
//定数定義
ADMIN_LESSON_LIST_INFORMATION	= 'adminLessonInformation';			//管理者日ごとダイアログの内容
NOW_PAGE						= 'nowPage';						//ページングの現在のページのクラス名
PAGING 							= 'paging';							//ページングのクラス名
PAGING_AREA						= 'pagingArea';						//ページングを囲むdivクラス名
CHANGE							= 'change';							//イベント名がchangeのときにchangeイベントを登録するための定数
LOCATION	= 'flower_clone/';								//サイトルート前
SITE_ROOT	= 'http://localhost/' + LOCATION;				//サイトルート
IMAGE_PATH	= 'uploadImage/flowerImage/';					//アップロード画像フォルダ
UPLOAD_LOCATION = SITE_ROOT + SITE_ROOT;					//アップロードURL
SPECIAL_RESERVED_DIALOG_URL		= 'dialog/specialReservedDialog.html';	//体験レッスン予約ダイアログのHMTLファイルURL

if (userAgent.indexOf('msie') != -1) {
  uaName = 'ie';
  if (appVersion.indexOf('msie 6.') != -1) {
    uaName = 'ie6';
  } else if (appVersion.indexOf('msie 7.') != -1) {
    uaName = 'ie7';
  } else if (appVersion.indexOf('msie 8.') != -1) {
    uaName = 'ie8';
  } else if (appVersion.indexOf('msie 9.') != -1) {
    uaName = 'ie9';
  } else if (appVersion.indexOf('msie 10.') != -1) {
    uaName = 'ie10';
  }
} else if (userAgent.indexOf('android') != -1) {
	uaName = 'android';
} else if (userAgent.indexOf('ipad') != -1) {
  uaName = 'ipad';
} else if (userAgent.indexOf('ipod') != -1) {
  uaName = 'ipod';
} else if (userAgent.indexOf('iphone') != -1) {
  uaName = 'iphone';
  var ios = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
//  uaName = [parseInt(ios[1], 10), parseInt(ios[2], 10), parseInt(ios[3] || 0, 10)];
} else if (userAgent.indexOf('mobile') != -1) {
	uaName = 'mobile';
} else if (userAgent.indexOf('chrome') != -1) {
	  uaName = 'chrome';
} else if (userAgent.indexOf('safari') != -1) {
  uaName = 'safari';
} else if (userAgent.indexOf('gecko') != -1) {
  uaName = 'gecko';
} else if (userAgent.indexOf('opera') != -1) {
  uaName = 'opera';
};
//以上、引用終了。

//http://yoyogisan.hatenablog.com/entry/2014/08/24/191101 より引用。
//使っているのがAndroidの標準ブラウザかの判定の関数です。
function isAndDefaultBrowser(){
    var ua=window.navigator.userAgent.toLowerCase();
    if(ua.indexOf('linux; u;')>0){
        return true;
    }else{
        return false;
    } 
}

/*
 * 関数名:function isIE()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ブラウザがIEかどうかを調べる。IEならUA文字列を返す。
 * 作成日:2015.04.23
 * 作成者:T.M
 */
function isIE(){
	//IEであればIEのUA文字列を返し、そうでなければfalseを返す。
	return uaName.indexOf('ie') != -1? uaName: false;
}

//Optionタグを生成するための連想配列。createOptions関数で使う。
var options = {
				"publifications":{
					"0":{"text":"全体"},
					"1":{"text":"友達のみ"},
					"2":{"text":"非公開"}
				}
			};


//Datepickerの日本語用設定。
var dpJpSetting = {
		closeText: '閉じる',
		prevText: '&#x3c;前',
		nextText: '次&#x3e;',
		currentText: '本日',
		monthNames: ['1月','2月','3月','4月','5月','6月',
		             '7月','8月','9月','10月','11月','12月'],
		             monthNamesShort: ['1月','2月','3月','4月','5月','6月',
		                               '7月','8月','9月','10月','11月','12月'],
		                               dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
		                               // dayNamesShort: ['日','月','火','水','木','金','土'],
		                               // dayNamesMin: ['日','月','火','水','木','金','土'],
		                               weekHeader: '週',
		                               dateFormat: 'yy/mm/dd',
		                               firstDay: 0,
		                               isRTL: false,
		                               showMonthAfterYear: true,
		                               yearSuffix: '年'};

//Datepickerによるカレンダー作成時に関数に渡すオプションをまとめた連想配列を定義する
var calendarOptions = {};

//ブログページのカレンダー
calendarOptions['blog'] = {
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			//絞り込まれたブログ記事を書き出す
			creator.outputNumberingTag('blogArticle', 1, 4, 1, 5, '.blog', dateText);	// ブログの記事を作る。
		},
		//日付有効の設定を行う。配列を返し、添字が0の要素がtrueであれば日付が有効、falseなら無効になる
		beforeShowDay:function(date){
			//@add 2015.0604 T.Masuda 日付が用意されていなければ処理しないようにしました
			return putDisableDate(date, this.dateArray);
		}
	}

//マイページの予約カレンダー
calendarOptions['myPageReserved'] = {
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			// 開発中のメッセージを出す。
			alert('現在この機能は開発中となっています。');
		},
		maxDate:this.dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
		minDate:1			//過去はクリックできなくする。
	}

//予約ダイアログ
calendarOptions['reserved'] = {		//カレンダーを作る。
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			// 予約のダイアログを出す。
			callReservedDialog(dateText, $(this));
		},
		maxDate:this.dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
		minDate:1			//今日以前はクリックできなくする。
	}

//会員ダイアログ
calendarOptions['member'] = {		//カレンダーを作る。
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			//ダイアログのタイトルの日付を設定する
			var titleDate = changeJapaneseDate(dateText);
			//予約ダイアログを開くのに必要なデータである日付と会員番号を連想配列に入れる
			var dialogDataObj = {
				//会員番号をセットしてどのユーザが予約するのかを識別する
				userId:creator.json.memberHeader.user_key.value,
				//予約日付をセットし、どの日に予約するのかを識別する
				lessonDate:dateText
			};
			//ダイアログのタイトルをセットして予約日を分かりやすくする
			dialogExOption[STR_RESERVE_LESSON_LIST_DIALOG]['title'] = titleDate;
			//予約授業一覧ダイアログを作る
			var reservedLessonListDialog = new dialogEx('dialog/reserveLessonListDialog.html', dialogDataObj, dialogExOption[STR_RESERVE_LESSON_LIST_DIALOG]);
			//ダイアログを開くときのテーブルの値を編集して表示する
			// reservedLessonListDialog.setCallbackOpen(jreservedLessonListDialogOpenFunc);
			reservedLessonListDialog.setCallbackClose(reservedLessonListDialogCloseFunc);	//閉じるときのイベントを登録
			reservedLessonListDialog.run();	//主処理を走らせる。


			//講座一覧ダイアログを開く
			// this.dialog.openTagTable({userId:this.userId,lessonDate:dateText.replace(/\//g,'-')}, 
			// 		{url:URL_GET_JSON_STRING_PHP, key:STR_MEMBER_INFORMATION, domName:STR_MEMBER_INFORMATION, appendTo:SELECTOR_RESERVE_LESSON_LIST_DIALOG},
			// 		titleDate
			// );
		}
//
//		maxDate:this.dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
//		minDate:1			//今日以前はクリックできなくする。
		//日付有効の設定を行う。配列を返し、添字が0の要素がtrueであれば日付が有効、falseなら無効になる
//		beforeShowDay:function(date){
//			return putDisableDate(date, this.dateArray);
//		}
	}

//管理者ダイアログ
calendarOptions['admin'] = {		//カレンダーを作る。
	// カレンダーの日付を選択したら
	onSelect: function(dateText, inst){
		//ダイアログのタイトルの日付を設定する
		var titleDate = changeJapaneseDate(dateText);
		//予約ダイアログを開くのに必要なデータである日付と会員番号を連想配列に入れる
		var dialogDataObj = {
			//予約日付をセットし、どの日に予約するのかを識別する
			lessonDate:dateText
		};
		//ダイアログのタイトルをセットして予約日を分かりやすくする
		dialogExOption[ADMIN_LESSONLIST_DIALOG]['title'] = titleDate;
		//予約授業一覧ダイアログを作る
		var adminLessonListDialog = new dialogEx('dialog/adminLessonListDialog.html', dialogDataObj, dialogExOption[ADMIN_LESSONLIST_DIALOG]);
		//ダイアログを開くときのテーブルの値を編集して表示する
		adminLessonListDialog.setCallbackOpen(adminLessonListDialogOpenFunc);
		adminLessonListDialog.setCallbackClose(adminLessonListDialogCloseFunc);	//閉じるときのイベントを登録
		adminLessonListDialog.run();	//主処理を走らせる。

		// //講座一覧ダイアログを開く
		// this.dialog.openTagTable({lessonDate:dateText.replace(/\//g,'-')}, 
		// 		{url:URL_GET_JSON_STRING_PHP, key:ADMIN_LESSON_LIST_INFORMATION, domName:ADMIN_LESSON_LIST_INFORMATION, appendTo:DOT + ADMIN_LESSON_LIST_DIALOG},
		// 		titleDate
		// );
	}
}

/*
 * クラス名:calendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 戻り値:なし
 * 概要  :カレンダーを作る
 * 作成日:2015.06.10
 * 作成者:T.Masuda
 */
function calendar(selector) {
	//コンストラクタの引数をメンバに格納する
	this.selector = selector;
	this.calendarName = '';	//カレンダー名を設定する
	
	this.calendarOptions = {};	//オプションをオブジェクトで記述する
	
	//datepickerの日本語設定を行う
    $.datepicker.regional['ja'] = dpJpSetting;	
	$.datepicker.setDefaults($.datepicker.regional['ja']);

	/* 
	 * 関数名:create
	 * 概要  :カレンダーを作る処理
	 * 引数  :なし
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.06.10
	 */
	this.create = function(){
			
		$(selector).datepicker(this.calendarOptions);
	}
}

/*
 * クラス名:reservedCalendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 *     :int dateRange:クリック可能な日付の期間
 * 戻り値:なし
 * 概要  :予約カレンダーを作る
 * 作成日:2015.06.10
 * 作成者:T.Masuda
 */
function reservedCalendar (selector, dateRange) {
	calendar.call(this, selector);	//スーパークラスのコンストラクタを呼ぶ
	this.calendarName = 'reserved';	//カレンダー名をセットする
	this.dateRange = dateRange;	//クリック可能な日付の期間の引数をメンバに格納する
	//オプションを設定する
	this.calendarOptions = calendarOptions['reserved'];
}

/*
 * クラス名:myPageReserved
 * 引数  :string selector:カレンダーにするタグのセレクタ
 *     :int dateRange:クリック可能な日付の期間
 * 戻り値:なし
 * 概要  :マイページのカレンダーを作る
 * 作成日:2015.06.10
 * 作成者:T.Masuda
 */
function myPageReservedCalendar(selector, dateRange) {
	calendar.call(this, selector);	//スーパークラスのコンストラクタを呼ぶ
	this.calendarName = 'myPageReserved';	//カレンダー名をセットする
	this.dateRange = dateRange;	//クリック可能な日付の期間の引数をメンバに格納する
	//オプションを設定する
	this.calendarOptions = calendarOptions['myPageReserved'];
}

/*
 * クラス名:memberCalendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 *     :int dateRange:クリック可能な日付の期間
 *     :int userId:ユーザID
 *     :element dialog:ダイアログへの参照
 * 戻り値:なし
 * 概要  :マイページのカレンダーを作る
 * 作成日:2015.06.11
 * 作成者:T.Yamamoto
 * 変更日:2015.06.13
 * 変更者:T.Masuda
 */
function memberCalendar(selector, dateRange, userId, dialog) {
	calendar.call(this, selector);	//スーパークラスのコンストラクタを呼ぶ
	this.calendarName = 'member';	//カレンダー名をセットする
	
	$calendar = $(selector)[0];		//カレンダーの要素を取得する
	$calendar.calendar = this;		//クラスへの参照をカレンダーのタグにセットする
	$calendar.dialog = dialog;		//ダイアログへの参照をDOMに保存する
	$calendar.userId = userId;		//ユーザIDを保存する
	
	this.dateRange = dateRange;	//クリック可能な日付の期間の引数をメンバに格納する
	//オプションを設定する
	this.calendarOptions = calendarOptions[this.calendarName];
}

/*
 * クラス名:adminCalendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 *     :element dialog:ダイアログへの参照
 * 戻り値:なし
 * 概要  :管理者のカレンダー
 * 作成日:2015.07.01
 * 作成者:T.Yamamoto
 */
function adminCalendar(selector, dialog) {
	calendar.call(this, selector);	//スーパークラスのコンストラクタを呼ぶ
	this.calendarName = 'admin';	//カレンダー名をセットする
	
	$calendar = $(selector)[0];		//カレンダーの要素を取得する
	$calendar.calendar = this;		//クラスへの参照をカレンダーのタグにセットする
	$calendar.dialog = dialog;		//ダイアログへの参照をDOMに保存する
	
	//@mod 2015.0704 T.Masuda 引数にない変数を使おうとしているのでコメントアウトしました。
	//this.dateRange = dateRange;	//クリック可能な日付の期間の引数をメンバに格納する
	//オプションを設定する
	this.calendarOptions = calendarOptions[this.calendarName];
}


/*
 * クラス名:blogCalendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 *     :int dateRange:クリック可能な日付の期間
 * 戻り値:なし
 * 概要  :ブログページのカレンダーを作る
 * 作成日:2015.06.10
 * 作成者:T.Masuda
 */
function blogCalendar(selector, dateArray) {
	calendar.call(this, selector);	//スーパークラスのコンストラクタを呼ぶ
	this.calendarName = 'blog';		//カレンダー名をセットする
	$(selector)[0].dateArray = dateArray;		//有効な日付設定の文字列をカレンダーのタグにセットする
	//オプションを設定する
	this.calendarOptions = calendarOptions['blog'];
}

//カレンダークラスの親子関係を設定する
reservedCalendar.prototype = new calendar();
myPageReservedCalendar.prototype = new calendar();
blogCalendar.prototype = new calendar();
//サブクラスのコンストラクタを有効にする
reservedCalendar.prototype.constructor = reservedCalendar;
myPageReservedCalendar.prototype.constructor = myPageReservedCalendar;
blogCalendar.prototype.constructor = blogCalendar;


/*
 * 関数名:function putDisableDate(date, dateArray)
 * 引数  :Date date: 日付
 *     :Array dateArray: 日付の配列
 * 戻り値:Array:DatepickerのbeforeShowDayで要求されるbooleanの配列を返す
 * 概要  :配列に該当する日付があるかのチェックを行い、判定を返す
 * 作成日:2015.06.04
 * 作成者:T.Masuda
 */
function putDisableDate(date, dateArray){
	console.log(dateArray);
	var retArray = [false];					//返却する配列を作る。
	//日付が用意されていたら
	if(dateArray != null){
		var ymd = createYMD(date);				//日付の配列を作る。
		var dArrayLength = dateArray.length;	//日付配列の要素数を取得する。
			
		//日付配列を走査する。
		for(var i = 0; i < dateArray.length; i++){
			//合致する日付があれば
			if(compareYMD(ymd, createYMD(dateArray[i]))){
				retArray[0] = true;	//その日付を無効にする。
			}
		}
	//日付の配列が用意されていなければ
	} else {
		retArray[0] = true;	//日付を有効にする
	}
	
	return retArray;	//判定の配列を返す。
}

/*
 * 関数名:function extractDateArray(map)
 * 引数  :map map: 処理対象とする連想配列。
 * 戻り値:Array:日付型の配列。
 * 概要  :blogのJSONから日付型の配列を作る。現状ではblogcontent.jsonの形式にあわせる。
 * 作成日:2015.04.19
 * 作成者:T.Masuda
 */
function extractDateArray(map){
	var retArray = [];		//返却するための配列を用意する。
	//キーが数字かどうかのチェックを行いながら走査する。
	for(key in map){
		//キーが数字であれば
		if(!(isNaN(key))){
			//日付のキーを取得して配列に格納する。
			retArray.push(new Date(map[key].blogArticleTitle.blogArticleDate.text));
		}
	}
	
	return retArray;	//配列を返す。
}

/*
 * 関数名:function createYMD(date)
 * 引数  :Date date: 日付。
 * 戻り値:Array:年月日の配列。
 * 概要  :日付型から年月日の配列を作って返す。
 * 作成日:2015.04.19
 * 作成者:T.Masuda
 */
function createYMD(date){
	var retArray = [];	//返却する配列を作成する。
	
	retArray.push(date.getFullYear());				//年を取得する。
	retArray.push(date.getMonth() + 1);				//月を取得する。
	retArray.push(date.getDate());					//日を取得する。
	
	return retArray;	//配列を返す。
}

/*
 * 関数名:function compareYMD(target1, target2)
 * 引数  :Array target1: 比較対象1。
 *     :Array target2: 比較対象2。
 * 戻り値:boolean:日付が同じかどうかの判定を返す。
 * 概要  :2つの日付型の配列が同じかどうかを判定して結果を返す。
 * 作成日:2015.04.19
 * 作成者:T.Masuda
 */
function compareYMD(target1, target2){
	var retBoo = true;	//返す真理値を格納する配列を用意する。
	
	var ymdLength = target1.length;	//日付の構成要素の数を取得する。
	
	//2つの日付を走査する。
	for(var i = 0; i < ymdLength; i++){
		if(target1[i] != target2[i]){	//日付が違ったら
			retBoo = false;				//false判定を返す。
			break;						//ループを抜ける。
		}
	}
	
	return retBoo;	//判定を返す。
}

/*
 * 関数名:setCallCalendar(selector)
 * 引数  :string selector:カレンダーと関連づける要素のセレクタ。
 * 戻り値:なし
 * 概要  :指定した要素をクリックしてカレンダーを呼ぶようにする。
 * 作成日:2015.03.26
 * 作成者:T.Y
 */
function setCallCalendar (selector) {
		//datepickerの日本語表示設定。
        $.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);

        $(selector).datepicker();
}

/*
 * 関数名:function checkDate(dateText, calendar)
 * 引数  :string dateText:日付のテキスト。
 *     :element calendar:この関数をコールしたdatepicker。
 * 戻り値:booelan:判定結果を返す。
 * 概要  :選択したカレンダーの日付が今日より前かどうかをチェックすり。
 * 作成日:2015.04.10
 * 作成者:T.Masuda
 */
function checkDate(dateText, calendar){
	var retBoo = true;	//返却値を格納する変数を宣言、trueで初期化する。
	//予約カレンダーであれば
	if(calendar.hasClass('reservedCalendar')){
		//本日の日付のインスタンスを生成する。
		var today = new Date();
		//本日の0時0分0秒の日付を作成する。
		var today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
		
		//選択した日付のインスタンスを生成する。
		var selectedDay = new Date(dateText);
		//今日より前の日付なら
		if(today.getTime() > selectedDay.getTime()){
			retBoo = false;	//falseを返すようにする。
		}
	}
	
	return retBoo;	//retBooを返す。
}

/*
 * 関数名:toolTip
 * 引数  :var targetElement
 * 戻り値:なし
 * 概要  :引数の要素に対してツールチップを表示する
 * 作成日:2015.02.06
 * 作成者:T.Y
 * 変更日:2015.03.10
 * 変更者:T.Masuda
 * 内容 :,を余計に書いてあった部分とコメント抜けを修正しました。
 */
function toolTip() {
  $(function() {
    // 要素を追加する処理
    $('body').append('<div class="tip"></div>');

    $('.tip')                         // 表示するツールチップに関するcssを有効にする
      .css({                          // jqueryでcssを記述する宣言をする
          border: '1px solid Black',  // 枠線を1pxで黒色、実線で描く
          backgroundColor: '#ffc',    // 背景を黄色っぽくする
          fontSize: 'smaller',        // ツールチップ内での文字のサイズは小さめにする
          padding: '2px',             // 2px分要素全体の幅を広くとる
          position: 'absolute',       // ポジションを絶対位置にする
          display: 'none'             // 画面には表示しない

      })
    //ツールチップを表示する処理
    $('.tiplink')
      //マウスオーバしたときの処理
      .mouseenter(function(e) {
      //.tipがアニメーション中でない場合のみ処理をする
        $('.tip:not(:animated)')
        //data-tips属性から本体テキストを設定
          .text($(this).data('tips'))
        //マウスの座標に応じて表示位置を決定
          .css({
            top: e.pageY,	//現在マウスポインターがあるY座標
            left: e.pageX,	//現在マウスポインターがあるX座標
            zIndex: 2		//z-indexを指定して重なりを制御する。
          })
          .fadeIn(300);//300ミリ秒かけて表示する
      })
      //マウスオーバから離れたときの処理
      .mouseleave(function(e) {
      $('.tip')//tipの中身について
        .fadeOut(500);//500ミリ秒かけて表示しなくなる
      })

  });  
}

/*
 * 関数名:getContentName()
 * 引数  :なし
 * 戻り値:String
 * 概要  :URLから現在のファイル名を取り出し返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function getContentName(){
	// URLからファイル名を取得する。
	var contentName = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
	// ファイル名から拡張子を取り除く。
	contentName = contentName.substring(0,contentName.indexOf('.'));
	// ファイル名に予約コンテンツであるということを示す文字列を追加する。
	contentName = contentName + 'Reserved';
	
	//contentNameを返す
	return contentName;
}

/*
 * 関数名:createDateArray(dateText)
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :日付文字列を配列にして返す。
 * 作成日:2015.02.12
 * 作成者:T.M
 */
function createDateArray(dateText){

	// 選択した日付を1つの文字列から配列に変換する。
	var date = dateText.split('/');
	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により不要になりました。
	// 配列内の日付の並びが年月日になっていないので、並びを修正した配列を整数に直した上でtrueDateに格納する。
//	var trueDate = [parseInt(date[2]), parseInt(date[0]), parseInt(date[1])];

	//@mod 2015.02.19 T.M jQuery UIのバージョン変更により、trueDateではなくdateを返すことになりました。
	// trueDateを返す。
	return date;
	// trueDateを返す。
//	return trueDate;
}

/*
 * 関数名:callReservedDialog
 * 引数  :String dateText:日付テキスト
 *     :jQuery calendar:カレンダーの要素
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.M
 * 修正日:2015.04.17
 * 修正者:T.M
 * 内容 :カレンダーのタグからコンテンツ名を取得するようにしました。
 */
function callReservedDialog(dateText, calendar){
	// カレンダーからコンテンツ名を取得する。
	var contentName = calendar.attr('name');
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	
	// 予約希望ダイアログを作成する。引数のオブジェクトに日付データ配列、コンテンツ名を渡す
	var reservedDialog = new dialogEx(SPECIAL_RESERVED_DIALOG_URL, {contentName: contentName, date:date}, specialReservedDialogOption);
	//予約ダイアログが開いたときのコールバック関数を登録する
	reservedDialog.setCallbackOpen(beforeOpenSpecialReservedDialog);
	//閉じたら完全にダイアログを破棄させる
	reservedDialog.setCallbackClose(reservedDialog.destroy);
	reservedDialog.run();	//ダイアログを開く
}

/*
 * 関数名:callMemberDialog
 * 引数  :String dateText:日付テキスト
 *     :jQuery calendar:カレンダーの要素
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.Yamamoto
 */
function callMemberDialog(dateText, calendar){
	// カレンダーからコンテンツ名を取得する。
	var contentName = calendar.attr('name');
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	// 予約希望ダイアログを作成する
	 var mDialog = new memberDialog('memberDialog',date,null, contentName, date);
	mDialog.open();	//ダイアログを開く
}

/*
 * 関数名:useZoomImage(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :fancyboxによる画像の拡大表示を有効にする。
 * 作成日:2015.03.20
 * 作成者:T.M
 */
function useZoomImage(selector){
	// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
	// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	});
}

/*
 * 関数名:function isTouchDevice()
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :スマホ・タブレットかPCかを判別する。
 * 作成日:2015.04.17
 * 作成者:T.M
 */
function isTouchDevice(){
	var retBoo = false;	//返却する真理値を格納する変数を宣言、falseで初期化する。
	if ((navigator.userAgent.indexOf('iPhone') > 0 				//UAがIPhoneか
			|| navigator.userAgent.indexOf('iPad') > 0) 		//iPadか
			|| navigator.userAgent.indexOf('iPod') > 0 			//iPodか
			|| navigator.userAgent.indexOf('Android') > 0) {	//Androidであれば
		retBoo = true;	//trueを返すようにする。
	}
	
	return retBoo;	//結果を返す。
}

/*
 * 関数名:createGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :カルーセルのギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 * 変更日:2015.03.09
 * 変更者:T.M
 * 内容　:setTimeoutを利用してAjax通信でのページ読み込みに対応しました。
 */
function createGallery(selector){
	//タッチ端末かどうかを判定する。
	var touchDevice = isTouchDevice();
	//要素を取得して変数に格納する。
	$gallery = $('.'+selector);
	//一旦ギャラリーを隠す。
	$gallery.hide();
	//時間をおいて関数を実行する。
	window.setTimeout(function(){
		//ギャラリーを見える様にする。
		$gallery.show();
		
		//SmoothDivScrollの関数をコールしてギャラリーを作る。
		$gallery.smoothDivScroll({
			//スマホなら両端のHotSpotによるスクロールを無効にする。
			hotSpotScrolling: !touchDevice,
			//タッチでのスクロールを有効にする。
			touchScrolling: true,
			//手動の無限スクロールをオンにする。
			manualContinuousScrolling: true,
			//スマホならホットスポットの背景をを出さない、PCなら出す。
			visibleHotSpotBackgrounds:touchDevice? "":"always",
			//マウスホイールによるスクロールを無効にする。
			mousewheelScrolling: false
		});
		//fancyboxで画像を拡大できるようにする。
		useZoomImage(selector);
	//1秒置いて実行する。
	}, 1000);
}

/*
 * 関数名:createUnmovableGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :不動のギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 */
function createUnmovableGallery(selector){
// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
	$('.' + selector).slick({
        //以下2ステップ、矢印を使わない設定。
		accessibility:false,
        arrows:false,
        // レスポンシブレイアウトに対応する。
        responsive:true,
        //可変幅にする。
		variableWidth:true,
        // 用意されている画像の数だけ並べる。
        slidesToShow:$('.' + selector + ' img').length
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	}); 
}

/*
 * 関数名:allCheckbox
 * 引数  :var checkboxTarget, var allCheckTarget
 * 戻り値:なし
 * 概要  :クリックするとすべてのチェックボックスにチェックを入れる。
 * 作成日:2015.02.28
 * 作成者:T.Yamamoto
 */
function allCheckbox(checkboxTarget, allCheckTarget) {
	// 第一引数の要素がクリックされたときの処理
	$(STR_BODY).on(CLICK, checkboxTarget, function() {
		// 第一引数のチェックボックスにチェックが入った時の処理
		if($(checkboxTarget + ':checked').val() == 'on') {
			// 第二引数のチェックボックスにチェックする
			$(allCheckTarget).prop('checked', true);
		// 第一引数のチェックボックスのチェックが外れた時の処理
		} else if ($(checkboxTarget + ':checked').val() == undefined) {
			// 第二引数のチェックボックスのチェックを外す
			$(allCheckTarget).prop('checked', false);
		};
	});
}

/*
 * 関数名:createTab(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :タブのコンテンツを作成する。
 * 作成日:2015.03.17
 * 作成者:T.Masuda
 */
function createTab(selector){
	//タブのコンテンツを作成する。
	$(selector).easytabs({
		updateHash:false	//タブのインデックスをクリックしてもURLのハッシュが変わらないようにする。
	});
}

/*
 * イベント名:(document).bind('easytabs:ajax:complete')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信でタブの内容を呼び出したときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
$(document).bind('easytabs:ajax:complete', function(event, $clicked, $targetPanel, response, status, xhr){
	//overwriteContent関数同様、scriptタグとlinkタグを取得する。
	var pagedrawer = $('script, link', response);
	//コードを順番に実行する。
	$.when(
			//createTagのJSONを初期化する。
			creator.json = '',
		//読み込み先のタブパネル内に取得したタグを展開する。
		$($targetPanel).html(pagedrawer)
	).done(function(){
	});
});


/*
 * 関数名:unwrapTable(row)
 * 概要  :trタグの親となるtableタグを消す。createTagでtrタグを追加する場合に使用する。
 * 引数  :String row:trタグのセレクタ文字列
 * 戻り値:なし
 * 作成日:2015.03.25
 * 作成者:T.Masuda
 */
function unwrapTable(row){
	//trタグの親、祖父であるtbody、tableタグを消す。
	$(row).unwrap().unwrap();
}

/*
 * 関数名:injectionTableData(target, map)
 * 概要  :対象となるテーブルに配置された空のセルに連想配列の値を流し込む。
 * 引数  :String target:処理対象となるテーブル。
 * 		:Object map:流し込むデータを持つ連想配列。
 * 戻り値:なし
 * 作成日:2015.03.26
 * 作成者:T.Masuda
 */
function injectionTableData(target, map){
	//ループのカウンター変数を準備する。
	var counter = 0;
	//処理対象のテーブルのjQueryオブジェクトを取得する。
	var $table = $(target);
	
	//mapを走査する。
	for(key in map){
		//対応するセルにデータを流し込む。
		$('.' + key + ' td', $table).text(map[key]);
		//疑似フォームで値を受け取る準備がしてあれば、そちらにも値を流し込む。
		$('.imitateForm input:hidden').filter('[name="' + key + '"]').val(map[key]);
	}
}

/*
 * 関数名:createNewPhoto()
 * 概要  :作成したMyギャラリーの新規のし写真に基本データを追加する。
 * 引数  :なし
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function createNewPhoto(){
	var $new = $('.myPhoto:last');	//新規の写真を変数に入れる。
	var cookieData = GetCookies();	//ユーザ名取得のため、クッキーのデータを連想配列で取得する。
	
	//ユーザ名を写真に追加する。ログインしていない状態なら、ゲスト名を入れる。
	$('.myPhotoUser', $new).text('userName' in cookieData 
			&& cookieData['userName'] != "" ? cookieData['userName'] : "Guest");
	//今日の日付を取得し、写真に追加する。
	$('.myPhotoDate', $new).text(getDateTime());
	//公開設定を追加する。
	$('.myPhotoPublication', $new).text('全体').attr('value', '0');
}

/*
 * 関数名:getDateTime()
 * 概要  :日付を取得する。
 * 引数  :なし
 * 戻り値:string:日付の文字列。
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function getDateTime(){
	var date = new Date()//日付取得のため、Dateクラスのインスタンスを生成する。
	//日付を取得して返す。
	return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
}

/*
 * 関数名:deletePhoto()
 * 概要  :チェックが入ったMyギャラリーの写真を削除する。
 * 引数  :なし
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function deletePhoto(){
	//チェックボックスが入っている写真があれば
	if($('.myPhotoCheck:checked')){
		//選択された写真を消す。
		$('.myPhoto').has('.myPhotoCheck:checked').remove();
	} else {
		//写真未選択の旨を伝える。
		alert('削除する写真を選んでください。');
	}
}

/*
 * 関数名:postPhoto(photo)
 * 概要  :サーバに保存する写真のデータを送信する。
 * 引数  :element photo:写真のタグ。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function postPhoto(photo){
	//写真のデータを連想配列にして返してもらう。
	var photoData = createPhotoData(photo);
	
	//Ajax通信でサーバに写真のデータを送信する。
	$.ajax({
		url:init['photoPost'],	//初期化データの連想配列にあるURLに送信する
//		dataType:'json',		//JSONで返してもらう。
		dataType:'text',		
		data:photoData,			//作成した写真データを送信する。
		//通信が成功したら
		success:function(json){
			//特に何もせず、静かに更新する。
		},
		//通信が失敗したら
		error:function(){
			//保存失敗の旨を伝える。
			alert('写真の保存に失敗しました。');
		}
	});
}

/*
 * 関数名:createPhotoData(photo)
 * 概要  :写真のデータの連想配列を作成する。
 * 引数  :element photo:写真のタグ。
 * 戻り値:Object:写真のデータ。
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function createPhotoData(photo){
	var retMap = {};	//返す連想配列を用意する。
	//日付を格納する。
	retMap['date'] = $('.myPhotoDate', photo).text();
	//ユーザ名を格納する。
	retMap['user'] = $('.myPhotoUser', photo).text();
	//タイトルを格納する。
	retMap['title'] = $('.myPhotoTitle', photo).text();
	//コメントを格納する。
	retMap['comment'] = $('.myPhotoComment', photo).text();
	//公開設定を格納する。
	retMap['publication'] = $('.myPhotoPublication', photo).attr('value');
	
	//作成した連想配列を返す。
	return retMap;
}

/*
 * 関数名:function createOptions(key)
 * 概要  :連想配列からoption要素を作成する。
 * 引数  :String key:連想配列のキー。
 * 戻り値:Element:作成したoption要素
 * 作成日:2015.04.09
 * 作成者:T.Masuda
 */
function createOptions(key){
	//キーに応じた連想配列を取得する。
	var map = options[key];
	var retElem = document.createElement('div');	//返却する値を格納する変数を宣言する。外枠となるdivタグを生成しておく。
	//連想配列を走査する。
	for(key in map){
		//optionタグを生成して変数に格納する。keyをoptionの値とする。
		var option = $('<option></option>').attr('value', key);
		//更に連想配列を進んでいく。
		for(childKey in map[key]){
			//キーがテキストなら
			if(childKey == 'text'){
				//optionにテキストを追加する。
				option.text(map[key][childKey]);
			//属性なら
			}else{
				//optionタグにキーと値を設定していく。
				option.attr(childKey, map[key][childKey]);
			}
		//生成したoptionタグをretElemに追加していく。
		$(retElem).append(option);
		}
	}	
	
	return $('option', retElem);	//生成した要素を返す。
}
	

/*
 * 関数名:startEditText(textElem)
 * 概要  :テキストを編集するモードに移行する。
 * 引数  :elemental textElem:対象となる要素。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function startEditText(textElem){
	var currentText = $(textElem).text()		//テキストの値を取得する。
	var className = $(textElem).attr('class');	//クラス名を取得する。
	
	//classNameがコメントのクラスであれば
	if(className == 'myPhotoComment'){
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<textarea>')
				.addClass(className + 'Edit')	//編集テキストエリア用のクラスをセットする。
				.val(currentText)				//テキストを引き継ぐ。
			);
	//公開設定であれば
	} else if(className == 'myPhotoPublication'){
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<select></select>')
				.addClass(className + 'Edit')				//編集テキストエリア用のクラスをセットする。
				.val($(textElem).attr('value'))							//テキストを引き継ぐ。
				.append(createOptions('publifications'))	//optionタグをセットする。
				.focus());
		//選択済みにする。
//		$('.' + className + 'Edit').val($(textElem).attr('value'));
	}else {
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<input>')
				.addClass(className + 'Edit')	//編集テキストエリア用のクラスをセットする。
				.val(currentText)				//テキストを引き継ぐ。
				.attr('type', 'text')			//テキストボックスのtypeをセットする。	
		);
	}

	//Androidの標準ブラウザでなければ　※Androidの標準ブラウザはfocus()を使わずともセレクトメニューにフォーカスするので
	if(!isAndDefaultBrowser() && !$('.' + className + 'Edit')[0].tagName != 'SELECT'){
		//追加した要素にフォーカスする。
		$('.' + className + 'Edit').focus();
		//編集終了のイベントを登録する。
		$('.myPhotoTitleEdit,.myPhotoCommentEdit,.myPhotoPublicationEdit').on('blur', function(){
			//自身を持つ写真要素のセレクタを取得する。
			var myphoto = $('.myPhoto').has(this);
			//編集モードを解除する。
			endEditText(this);
			//編集したデータを送信する。
			postPhoto(myphoto);
		});
	} else {
		$('body').on('click.editSelect', function(){
			//自身を持つ写真要素のセレクタを取得する。
			var myphoto = $('.myPhoto').has('.myPhotoPublicationEdit').eq(0);
			//編集終了の関数をコールする。
			endEditText($('.myPhotoPublicationEdit').eq(0));
			$('body').off('click.editSelect');
			//編集したデータを送信する。
			postPhoto(myphoto);
		});
	}
	
	//イベント発火元の要素を消す。
	$(textElem).remove();
};

/*
 * 関数名:endEditText($this)
 * 概要  :テキストの編集モードを終了する。
 * 引数  :jQuery $this
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function endEditText(textElem){
	var $this = $(textElem);	//引数の要素のjQueryオブジェクトを取得する。
	//編集後のテキストボックスを取得する。
	var currentText = $this.val();
	//編集モードになる前のクラス名を取得する。
	var pastClass = $this.attr('class').replace('Edit', '');
	
	//セレクトメニューであれば
	if($this[0].tagName == 'SELECT'){
		//編集モードになる前のタグを生成する。
		$this.after($('<p></p>')
				.attr('value', currentText)	//value属性を設定する。
				//テキストを反映する。
				.text($('option[value="' + currentText + '"]', $this).text())
				.addClass(pastClass)	//元のクラスを設定する。
		);
	//それ以外であれば
	} else {
		//編集モードになる前のタグを生成する。
		$this.after($('<p></p>')
				.text(currentText)		//テキストを反映する。
				.addClass(pastClass)	//元のクラスを設定する。
		);
	}
	
	//用済みになった編集要素を消す。
	$this.remove();
}

/*
 * 関数名:popupComment(selector)
 * 概要  :指定した要素をクリックまたはタップするとテキストがポップアップで表示されるようにする。
 * 引数  :string selector:ポップアップさせる要素。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function popupComment(selector){
	//指定した要素をクリックまたはダブルクリックしたらテキストがポップアップ表示される様にする。
	$(selector, document).smallipop({triggerOnClick:true});
}

/*
 * 関数名:beforeConfirmButtonPush(func, message, arg)
 * 概要  :関数をコールする前に確認のダイアログを出す。
 * 引数  :funciton func:対象の関数
 * 		:string message:ダイアログに出すメッセージ。
 * 		:?		arg:引数。特に型を指定しない。
 * 戻り値:なし
 * 作成日:2015.03.27
 * 作成者:T.Masuda
 */
function beforeConfirmButtonPush(func, message, arg){
	//確認ダイアログを出し、OKかキャンセルかを選択してもらう。
	ret = confirm(message);
	
	//OKが押されたら
	if(ret){
		//引数の関数をコールする。
		func(arg);
	}
}

/*
 * イベント名:$(document).on('click', '.myGalleryEditButtons .deleteButton')
 * 引数  　 	:string 'click':クリックイベントの文字列
 * 			:string '.myGalleryEditButtons .deleteButton':削除ボタンのセレクタ
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの削除ボタンを押したときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
// $(document).on('click', '.myGalleryEditButtons .deleteButton', function(){
// 	//チェックが入っている写真があれば
// 	if($('.myPhotoCheck:checked').length){
// 		//確認ダイアログを出して同意を得てから画像を消す。
// 		beforeConfirmButtonPush(deletePhoto, '選択した写真を削除しますか?', '');
// 	}
// });

/*
 * イベント名:$(document).on('dblclick', '.myPhotoTitle,.myPhotoComment,.myPhotoPublication')
 * 引数  　 	:string 'dblclick':ダブルクリックイベントの文字列
 * 			:string '.myPhotoTitle,.myPhotoComment,.myPhotoPublication':写真のタイトル、コメント、公開設定のセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のタイトル、コメント、公開設定をダブルクリックしたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('dblclick doubletap','.myPhotoTitle,.myPhotoComment,.myPhotoPublication', function(){
	//タイトルを編集モードにする。
	startEditText(this);
});

/*
 * イベント名:$(document).on('blur', '.myGallery .myPhotoTitleEdit')
 * 引数  　 	:string 'blur':フォーカスが外れたときのイベントの文字列
 * 			:string '.myGallery .myPhotoTitle':写真のタイトルのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のタイトルの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
//$(document).on('blur', '.myPhotoTitleEdit,.myPhotoCommentEdit,.myPhotoPublicationEdit', function(){
//	//自身を持つ写真要素のセレクタを取得する。
//	var myphoto = $('.myPhoto').has(this);
//	//編集モードを解除する。
//	endEditText(this);
//	//編集したデータを送信する。
//	postPhoto(myphoto);
//});

function bindClickTarget(selector, target){
	$(selector).on('click', function(){	//クリックイベントを登録する。
		var $target = $(target);	//ターゲットのjQueryオブジェクトを取得する。
		//ターゲットをクリックする。
		$target.trigger('click');
	});
}

/*
 * 関数名:function setMyGalleryChangeEvent(selector)
 * 引数 	:String selector:イベントをバインドする対象のセレクタ
 * 戻り値:なし
 * 概要  :Myギャラリーの新規作成イベントの関数
 * 作成日:2015.04.23
 * 作成者:T.Masuda
 */
function setMyGalleryChangeEvent(selector){
	$(selector).on('change', function(event){
		//拡張子チェックを行う。画像の拡張子でなければはじく。
		if(!checkIdentifier($(this).val())){
			//有効なファイルを選んでもらうように警告を出す。
			alert('無効なファイルです。以下の拡張子の画像ファイルを選択してください。\n.png .PNG .jpg .jpeg .JPG .JPEG');
			return;	//処理を終える。
		}

		//保存先を指定して画像のアップロードを行う。input type="file"のname属性と会員IDを添えて送信する。
		//  $(this).upload(init['saveJSON'],{"dir":init['photoDirectory']}, function(xml) {
		//	$(this).upload('uploadImage',{"dir":init['photoDirectory'], postedName:$(this).attr('name')}, function(xml) {
		$(this).upload(init['photoPost'],{postedName:$(this).attr('name'), userId:creator.json.memberHeader.user_key.value}, function(xml) {
	    	
			//jQueryセレクターで取得して出力
			console.log('filename(selector search): ' + $('filename', xml).text());
			//find関数で取得して出力
			console.log('filename(find function): ' + $(xml).find('filename').text());
			//追記者 T.Yamamoto 追記日:2015．07.29 内容:DBに画像のコメントを除くデータをDBにアップロードする
			//アップロード画像の情報をDBに入れて送るための連想配列を作る
			var sendReplaceArray = {};
			//DBに画像タイトルを追加するためにアップロードされた画像のタイトルを取得する
			sendReplaceArray['photo_title'] = $('filename', xml).text();
			//会員番号を更新情報のクエリに入れる
			sendReplaceArray['user_key'] = creator.json.memberHeader.user_key.value;
			//画像情報をDBに新規登録する
			setDBdata(creator.json.insertMyGalleryPhoto, sendReplaceArray, '');
			console.log(sendReplaceArray);
			console.log(creator.json.insertMyGalleryPhoto);
			
			//返ってきたデータから成否判定の値を取り出す。
	    	//var issuccess = parseInt($(xml).find('issuccess').text());
	    	//ローカルでのテスト用のxmlデータを作る。
	    	var issuccess = 1;
	    	xml = $('<root></root>')
	    			.append($('<src></src>')
	    					.text('')
	    			)
	    			.append($('<message></message>')
	    					.text('success')
	    			);
	    	if(issuccess){	//保存に成功していたら
	    		//IE9以下でなければ
	    		if(!(uaName == 'ie6' || uaName == 'ie7' || uaName == 'ie8' || uaName == 'ie9')){
		    		//ファイルのオブジェクトをを取得する。
		    		var file = event.target.files[0];
		    		//画像の縮小を行う。
		    		canvasResize(file, {
		    			crop: false,	//画像を切り取るかを選択する
		    			quality: 80,	//画像の品質
		    			//コールバック関数。画像パスを引数として受け取る。
		    			callback: function(data) {
		    				$(xml).attr('src', data);	//アップロードした画像をセットする。
		    				var src = data;	//画像の保存先を取得する。
		//    				var src = $(xml).find('src').text();	//画像の保存先を取得する。
		    				//createTagで新たな写真を作成する。
		    				creator.outputTag('blankPhoto', 'myPhoto', '.myGallery');
		    				//新たな写真を初期化する。
		    				createNewPhoto();
		    				//画像拡大用のタグにソースをセットする。
		    				$('.myPhotoLink:last').attr('href', src);
		    				//画像サムネイルに使う要素の画像を設定する。
		    				$('.myPhotoImage:last').css('background-image', 'url('  +  src + ')');
		    				$('.myPhoto:last').removeClass('blankPhoto');	//空の写真のクラスを消す。
		    			}
		    		});
		    	//IE6~9なら
		    	} else {
		    		//サムネイルが出ないことを伝える。
		    		alert('サーバへの画像の保存の処理ができるまでIE6~9はサムネイルを使えません。');
	    			var src = 'photo/general/web/DSC_0266.JPG';	//今のところはダミーの写真を追加する。
	    			//createTagで新たな写真を作成する。
	    			creator.outputTag('blankPhoto', 'myPhoto', '.myGallery');
	    			//新たな写真を初期化する。
	    			createNewPhoto();
	    			//画像拡大用のタグにソースをセットする。
	    			$('.myPhotoLink:last').attr('href', src);
	    			//画像サムネイルに使う要素の画像を設定する。
	    			$('.myPhotoImage:last').css('background-image', 'url('  +  src + ')');
	    			$('.myPhoto:last').removeClass('blankPhoto');	//空の写真のクラスを消す。
		    	}
	    	//保存に失敗していたら
	    	} else {
	    		alert($(xml).find('message').text());	//メッセージを取り出してアラートに出す。
	    	}
	    //サーバから返されたデータをXMLとして扱う。
	    },"xml");
	});
}
	
/*
 * 関数名:function uploadImage(uploader, parent, srcReturn)
 * 引数  :element uploader:input type="file"の要素
 * 		:element parent: 画像パスの追加を行う要素の親要素。
 * 　　　:String srcReturn:取得した画像パスを追加する要素のセレクタ。
 * 戻り値:なし
 * 概要  :画像をアップロードし、指定した要素に画像パスを追加する。
 * 作成日:2015.04.14
 * 作成者:T.Masuda
 */
//アップロードボタンの値が変わったときのイベント(=アップロードを行った後のイベント)
function uploadImage(uploader, parent, srcReturn){
	$uploader = $(uploader);	//アップローダーの要素をjQueryオブジェクトにして変数に格納する。
	//保存先を指定して画像のアップロードを行う。
	$uploader.upload('source/dummy.xml',{"dir":init['photoDirectory']}, function(html) {
//		$uploader.upload(init['saveJSON'],{"dir":init['photoDirectory']}, function(html) {
		//返ってきたデータから成否判定の値を取り出す。
//		var issuccess = parseInt($(xml).find('issuccess').text());
		var issuccess = "true";
		if(issuccess == "true"){	//保存に成功していたら
		
			//IE6~9でなければ
    		if(!(uaName == 'ie6' || uaName == 'ie7' || uaName == 'ie8' || uaName == 'ie9')){
	    		//ファイルのオブジェクトをを取得する。
	    		var file = uploader.files[0];
	    		var filetmp = '';	//画像パスの一時保存場所のパス用の変数を用意する。
	    		//画像の縮小を行う。
	    		canvasResize(file, {
	    			crop: false,	//画像を切り取るかを選択する
	    			quality: 80,	//画像の品質
	    			//コールバック関数。画像パスを引数として受け取る。
	    			callback: function(data) {
	    				filetmp = data;				//filetmpにdataを一時保存する。
	    				//			var src = $(xml).find('src').text();	//画像の保存先を取得する。
	    				var src = filetmp;								//画像の保存先を取得する。
	    				$(srcReturn, parent).each(function(){			//画像パスを返す要素を操作する。
	    					//画像タグであれば
	    					if($(this)[0].tagName == 'IMG'){
	    						$(this).attr('src', filetmp);	//ソースパスを設定する。
	//					$(this).attr('src', src);	//ソースパスを設定する。
	    						//特別処理の指定がないタグなら
	    					} else {
	    						$(this).val(src);	//画像パスをvalue属性にセットする。
	    					}
	    				});
	    			}
	    		},'xml');
	    	//IE6~9なら
    		}else{
	    		//サムネイルが出ないことを伝える。
	    		alert('サーバへの画像の保存の処理ができるまでIE6~9はサムネイルを使えません。');
				var src = "photo/general/web/DSC_0064.jpg";	//画像の保存先を取得する。
				$(srcReturn, parent).each(function(){			//画像パスを返す要素を操作する。
					//画像タグであれば
					if($(this)[0].tagName == 'IMG'){
						$(this).attr('src', src);	//ソースパスを設定する。
						//特別処理の指定がないタグなら
					} else {
						$(this).val(src);	//画像パスをvalue属性にセットする。
					}
				});
    		}
		} else {
			alert($(xml).find('message').text());	//メッセージを取り出してアラートに出す。
		}
		//サーバから返されたデータをXMLとして扱う。
	},"xml");
}

/*
 * 関数名:function replaceClone(elem)
 * 引数  :element elem:処理対象の要素。
 * 戻り値:なし
 * 概要  :指定した要素を配置し直す。IOS Safariで画像パスを削除した画像タグの画像が空にならないバグへの対処により作成。
 * 作成日:2015.04.22
 * 作成者:T.Masuda
 */
function replaceClone(elem){
	var $target = $(elem);				//処理対象の要素のjQueryオブジェクトを作る。
	var $clone = $(elem).clone(false);	//クローンを作る。
	$(elem).after($clone);				//クローンを処理対象の要素の後ろに配置する。
	$(elem).remove();					//処理対象の要素を消し、置き換えを終える。
}

/*
 * 関数名:function deleteSiblingSrc(button, targets)
 * 引数  :element button:画像削除のイベントをバインドした要素。
 * 　　　:String targets:画像パスを削除する対象の要素のセレクタ。
 * 戻り値:なし
 * 概要  :削除ボタンの指定した兄弟要素の画像パスを削除する。
 * 作成日:2015.04.14
 * 作成者:T.Masuda
 */
function deleteSiblingSrc(button, targets){
	var $siblings = $(button).siblings(targets);	//指定した兄弟要素を取得する。
	$($siblings).each(function(){					//画像パスを削除する要素を走査する。
		//画像タグであれば
		if($(this)[0].tagName == 'IMG' || $(this).filter('[src]').length){
			$(this).attr('src', "");	//ソースパスを空にする。
			//IOSのデバイスなら、DOMそのものを生成し直して画像を空にする。
			if(uaName == 'iphone' ||uaName == 'ipad' ||uaName == 'ipad'){
				replaceClone(this);	//タグを置き換える。
			}
		//特別処理の指定がないタグなら
		} else {
			$(this).val("");	//value属性を空にする。
		}
	});
}

/*
 * 関数名:function numOnly()
 * 引数  :event evt: onkeyDownイベントのeventオブジェクト。
 * 戻り値:boolean
 * 概要  :onkeyDownイベントでコールされ、数字、バックスペース、左右のキーの移動以外の打鍵をキャンセルする。
 * 引用　:http://javascript.eweb-design.com/1205_no.html
 * 作成日:2015.04.14
 * 作成者:T.Masuda
 */
function numOnly() {
	  //押されたキーのコードを1文字に変換する。
	  m = String.fromCharCode(event.keyCode);
	  //指定されたキーコード以外であれば
	  if("0123456789\b\r%\'".indexOf(m, 0) < 0){
		  return false;	//処理を途中終了する。
	  }
	  
	  return true;	//処理を通常通りに行う。
	}

//入力制限の文字列を連想配列に格納する。キーは要素のtype属性の値が相当する。
var limitInput = {
		email:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\b\r%\'½¾ÛÞ»¿ÀÝºâÜ@",
		number:"0123456789\b\r%\'",
		tel:"0123456789\b\r%\'½"
}

/*
 * 関数名:function controllInputChar(evt)
 * 引数  :event evt: onkeyDownイベントのeventオブジェクト。
 * 戻り値:boolean
 * 概要  :入力する文字の制限をかける。
 * 作成日:2015.04.15
 * 作成者:T.Masuda
 */
function controllInputChar(evt){
	var keyCode;	//押下されたキーのコードを受け取る変数を宣言する。
	//document.allはInternet Explorerでのみ使用可能
	if (document.all)  //IEなら
	{
		keyCode = event.keyCode;	//event.keyCodeからキーコードを取得する。
	} else	//IE以外なら
	{
		keyCode = evt.which;		//引数で渡されたイベントオブジェクトからキーコードを取得する。
	}
	
	var type = $(evt.target).attr('type');	//テキストボックスのtype属性を取得する。
	//押されたキーのコードを1文字に変換する。
	m = String.fromCharCode(keyCode);
	//指定されたキーコード以外であれば。tabキーのコードは許可する。
	if(limitInput[type].indexOf(m, 0) < 0 && !(parseInt(keyCode) == 9)){
		//Firefox用のバリデーションを行う
		if(!validateFirefoxKeyCode(keyCode, type)){
			return false;	//処理を途中終了する。
		}
	}
	
	return true;	//処理を通常通りに行う。	
}

/*
 * 関数名:function validateFirefoxKeyCode(keyCode)
 * 引数  :String keyCode: キーコード。
 * 　　  :String type: 判定する入力欄のタイプ。
 * 戻り値:boolean
 * 概要  :Firefoxでのキーコードのチェックを行う。
 * 作成日:2015.04.18
 * 作成者:T.Masuda
 */
function validateFirefoxKeyCode(keyCode,type){
	if(uaName != 'gecko'){	//Firefoxでなければ
		return;	//何もしない。
	}
	var key = parseInt(keyCode);	//キーコードを数値に変換する。
	var retBoo = false;				//返却する値を格納する変数を宣言、falseで初期化する。
	
	//ハイフンかつ電話番号、メールアドレス
	if(key == 173 && (type == 'tel' || type == 'email')){
		retBoo = true;	//trueを返す
	//アンダーバーかつメールアドレス
	} else if(key == 167 && type == "email"){
		retBoo = true;	//trueを返す
	}
	
	return retBoo;	//判定結果を返す。
}

//テキストボックス等のname属性の日本語版を格納する連想配列。
var errorJpNames = {name:'氏名',
					eMail:'メールアドレス',
					email:'メールアドレス',
					sex:'性別',
					content:'お問い合わせ内容',
					tel:"電話番号",
					address:'住所',
					eMailConfirm:"メールアドレス(確認)",
					emailConfirm:"メールアドレス(確認)",
					campaignTitle:'キャンペーン名',
					startDate:'開始日',
					endDate:'終了日',
					maxEntry:'上限人数',
					blogContent:'本文',
					blogTitle:'ブログタイトル',
					imagePath:'画像',
					campaignTitle:'キャンペーン名',
					campaignType:'種別',
					campaignContent:'内容',
					campaignPrice:'金額',
					campaignCopy:'コピー',
					startDate:'開始日',
					endDate:'終了日',
					maxEntry:'上限人数',
					nameKana:'氏名(カナ)',
					passwordConfirm:'パスワード(確認)',
					nickname:'ニックネーム',
					password:'パスワード',
					passwordNew:'パスワード(新)',
					emailNew:'メールアドレス(新)',
					adminBlogTitle:'管理者ブログタイトル',
					allowMidnightMail:'深夜メール受信',
					recieveMailType:'受信するメールの種類',
					myEmail:'メールアドレス'
					};

//validate.jsでチェックした結果を表示する記述をまとめた連想配列。
var showAlert = {
		invalidHandler:function(form,error){	//チェックで弾かれたときのイベントを設定する。
			var errors = $(error.errorList);	//今回のチェックで追加されたエラーを取得する。
			//エラー文を表示する。
			alert(createErrorText(errors, errorJpNames));
		},
		rules:{	//ルールを設定する。
			emailConfirm:{	//メールアドレス入力確認欄
				equalTo: '[name="email"]'	//メールアドレス入力欄と同じ値を要求する。
			},
			passwordConfirm:{	//パスワード入力確認欄
				equalTo: '[name="password"]'	//パスワード入力欄と同じ値を要求する。
			}
		}
	}

//デフォルトのsubmitHandlerを定義する連想配列。
var defaultSubmitHandler = {
	submitHandler:function(form){
		afterSubmitForm(this, event);	//フォームをsubmitした後の処理を行う。
	}
}

//記事の管理ボタン用のsubmitHandler。新規作成ならページを読み込むだけ、編集ならデータを取得
//してテキストボックス等に格納する。
var articleSubmitHandler = {
	submitHandler:function(form){
		//hiddenのinputタグからrole属性の値を受け取る。
		var command = parseInt($('.valueHolder:first', form).attr('data-role'));
		//チェック済みのチェックボックスの数を数える。
		var checked = $('input:checkbox:checked' ,form).length;
		var userId = getUserId();				//ユーザIDを取得する。
		var contentNum = $(form).attr('data-role');	//コンテンツ番号を取得する。
		
		//編集ボタンをクリックされてかつ、リストのチェックボックスに2つ以上チェックが入っていれば
		if(command == 1 && checked > 1){
			alert('編集する記事を1つ選んでください');
		//編集ボタンかつチェックがなければ
		} else if(command == 1 && checked <= 0){
			alert('編集する記事を1つ選んでください');
		//以上の条件に引っかからなければ
		} else {
			//Ajax通信とそのコールバック関数の実行の順番を制御するため、when関数を利用する。
			$.when(
					afterSubmitForm(form)	//フォームをsubmitした後の処理を行う。
			//whenのコードが終了したら
			).then(function(){
				//記事番号を取得する。記事番号でなければ会員IDを取得する。
				var number = $('tr:has(input:checkbox:checked) .number' ,form).length > 0?
						$('tr:has(input:checkbox:checked) .number' ,form).text() 
						: parseInt($('tr:has(input:checkbox:checked) .memberId' ,form).text());
				//commandが1(編集ボタンで画面遷移をしている)なら
				if(command == 1){
					
					//サーバ側の用意が2015/4/16の時点でできていないので、サンプルのJSONのパスを用意する。
					var url="";
					//コンテンツ番号で分岐する。
					switch(parseInt(contentNum)){
					case 4:url = 'source/blogeditsample.json';	//ブログ
						break;
					case 5:url = 'source/campaigneditsample.json';	//キャンペーン
						break;
					case 6:url = 'source/studenteditsample.json';	//生徒さん
						break;
					default:	//当てはまらなければそのまま
						break;
					}
					
					var time = new Date();	//リクエストヘッダーに載せる日付を取得するため、日付型のインスタンスを用意する。
					
					//Ajax通信で該当する記事のJSONを取得する。
					$.ajax({
						//ブログ記事を1つだけ取得するサーバのファイルにアクセスする。
						url:url,
//					url:init['getSelectedBlog'],
						method:'post',	//postメソッドで送信する。
						//ユーザIDと記事番号とコンテンツ番号を送る。
						data:{'userId':userId, 'number':number, 'contentNum':contentNum},
						dataType:'JSON',	//JSONを返してもらう。
						headers: {			//リクエストヘッダを設定する
							"If-Modified-Since": time.toUTCString()	//ファイルの変更の時間をチェックする
						},
						success:function(json){	//通信が成功したら
							//マイブログの記事更新のクエリを使うための準備をする
							setBlogUpdateQueryReplace('myBlogContent', 'memberHeader', 'updateMyBlog', number);

							// //実際にはルート直下に各ブログ記事要素のテキストが配置されているという前提です。
							// //ダミーのJSONでは記事番号をキーとしたオブジェクトの直下に各ブログ記事要素のテキストが配置されています。
							// json = json[number];
							// //jsonを走査する。
							// for(key in json){
							// 	var dom = $('.' + key);//値をセットする対象となるDOMを取得する。
							// 	//domが画像タグならば
							// 	if(dom[0].tagName == 'IMG'){
							// 		//キーに対応したクラスの要素にテキストを追加していく。
							// 		dom.attr('src',json[key]);
							// 	//ラジオボタンなら
							// 	} else if(dom.attr('type') == 'radio'){
							// 		//対象となるラジオボタンにチェックを入れる。
							// 		dom.filter('[value="' + json[key] + '"]').prop('checked', 'true');
							// 	//日付テキストボックスなら
							// 	} else if(dom.attr('type') == 'date'){
							// 		//日付のフォーマットを整えてテキストボックスに値を入れる。
							// 		dom.val(json[key].replace(/\//g, "-"));
							// 		//単にテキストを入れるだけであれば
							// 	} else {
							// 		dom.val(json[key]);	//キーに対応したクラスの要素にテキストを追加していく。
							// 	}
							// }
						}
					})
				}
			});
		}
	}
}

//リストに対する検索フォームのsubmitHandlerの連想配列。
var listSearchSubmitHandler = {
		submitHandler:function(form){	//submitHandlerのコールバック関数
			//入力された項目がある入力欄のデータを取得する。
			var formData = createFormData(form);
			//行のクラス名と同様の文字列をdata-target属性から取得する。
			var rowName = $(form).attr('data-target');
			//サーバに送信するデータを作成する。コンテンツ番号、フォームデータを送信する。
			var sendData = {search:formData,contentNum:$(form).attr('data-role')};
			//ナンバリングのJSONを消す。
			deleteNumberKey(creator.json);
			//サーバへデータを送信する。
		//	creator.getJsonFile(init['getListData'], sendData);//サーバ側の処理が実装されたらこちらを使います。
			
			//現在はダミーの処理です。
			var jsonurl = '';	//jsonファイルのurlを格納する変数を宣言、初期化する。
			var dataRole = parseInt($(form).attr('data-role'));	//コンテンツ番号を取得する。
			switch(dataRole){	//コンテンツ番号で分岐する。
				case 4: jsonurl = 'source/adminbloglist.json';	//管理者ブログ
								break;								//switchを抜ける。
				case 5: jsonurl = 'source/campaignlist.json';	//キャンペーン
								break;								//switchを抜ける。
				case 6: jsonurl = 'source/studentlist.json';	//生徒さん
								break;								//switchを抜ける。
				default:		break;								//switchを抜ける。
			}
			
			creator.getJsonFile(jsonurl, sendData);
			//ここまでダミーのJSON取得の処理
			
			//ナンバリングのJSONが返ってきていれば
			if('1' in creator.json){
				//ナンバリングとともに書き出す。同じdata-roleの値を持つフォームのリストを指定し、レコードを書き出す。
				creator.outputNumberingTag(rowName + 'Wrap', init.listSetting.startPage, 
						init.listSetting.displayPageMax, init.listSetting.displayPage, 
						init.listSetting.pageNum, 
						'.managementForm[data-role=\'' + $(form).attr('data-role') + '\'] .table > tbody');
			//何も返ってきていなければ
			} else {
				//エラーメッセージを出す
				alert('検索条件に該当するデータがなかった、または通信に失敗しました。');
			}
		}
}

//オプション更新のsubmitHandler。
var optionSubmitHandler = { submitHandler:function(form){
		saveOptionSetting();	//設定を保存する。
	},
	invalidHandler:function(form,error){	//チェックで弾かれたときのイベントを設定する。
		var errors = $(error.errorList);	//今回のチェックで追加されたエラーを取得する。
		//エラー文を表示する。
		alert(createErrorText(errors, errorJpNames));
	},
	rules:{	//ルールを設定する。
		emailConfirm:{	//メールアドレス入力確認欄
			equalTo: '[name="emailNew"]'	//メールアドレス入力欄と同じ値を要求する。
		},
		passwordConfirm:{	//パスワード入力確認欄
			equalTo: '[name="passwordNew"]'	//パスワード入力欄と同じ値を要求する。
		}
	}
}


/*
 * 関数名:function deleteRowData(form)
 * 引数  :element form: フォームの要素。
 * 戻り値:なし
 * 概要  :レコードを消すイベントを定義する。
 * 作成日:2015.04.16
 * 作成者:T.Masuda
 */
function deleteRowData(form, deleteQueryKey){
	//削除ボタンが押されたら
	$('.deleteRecord').on('click', function(){
		var numberArray = [];	//記事番号、または会員番号を格納する配列を用意する。
		//記事番号か、会員番号かを判別する。
		var numberString = $('table td.number' ,form).length > 0? 'number':'memberId';
		//チェックが入っている行を取得する。
		var $checkedRecord = $('table tr:has(input:checkbox:checked)', form);
		//フォームのテーブルのチェックボックスが入っている行を走査する。
		$checkedRecord.each(function(){
			//記事番号、または会員番号を配列に追加していく。
			numberArray.push($('.' + numberString,this).text());
		});
		
		//チェックがなければ
		if(numberArray.length <= 0){
			alert('必ず1行以上選択してください。');
			return;	//処理を終える。
		}
		
		//確認ダイアログを出して、OKならば
		if(window.confirm('選択した行を削除しますか?')){
			//DBからチェックが入った記事を削除する
			deleteBlogArticle(deleteQueryKey, numberArray);
			//先ほど選択した行を削除する。
			$checkedRecord.remove();
			//削除完了の旨を伝える。
			alert('選択した行を削除しました。');
		}
	});
}

/*
 * 関数名:function sendButtonRole(form)
 * 引数  :element form: フォームの要素。
 * 戻り値:String:エラーメッセージの文字列。
 * 概要  :ボタンに設定されたroleの値を隠しフォームにセットする。
 * 作成日:2015.04.15
 * 作成者:T.Masuda
 */
function sendButtonRole(form){
	//submitボタンのクリックイベントを設定する。
	$('input:submit').on('click', function(){
		//次に来るvalueHolderクラスのhiddenのinputタグにdata-role属性を渡す。
		$(this).nextAll('.valueHolder:first').attr('data-role', $(this).attr('data-role'));
	});
}

/*
 * 関数名:function createErrorText
 * 引数  :jQuery errors: エラーがあった要素。
 * 　　  :Object jpNames: name属性に対応する日本語名が格納された連想配列。
 * 戻り値:String:エラーメッセージの文字列。
 * 概要  :エラーメッセージを作成する。
 * 作成日:2015.04.15
 * 作成者:T.Masuda
 */
function createErrorText(errors, jpNames){
	//返却する文字列を格納する変数を用意する。
	var retText = "";
	//エラーメッセージの数を取得する。
	var errorLength = errors.length;
	//エラーメッセージを格納する配列を用意する。1つ目の要素に1個目のエラーメッセージを配置する。
	var errorMessages = [errors[0].message];

	//エラーメッセージの数を取得する。
	var messageLength;
	
	//エラーメッセージを取得する。
	for(var i = 0; i < errorLength; i++){
		messageLength = errorMessages.length;	//エラーメッセージの数を更新する。
		//エラーメッセージの重複をチェックする。
		for(var j = 0; j < messageLength; j++){
			//エラーメッセージが重複していれば
			if(errorMessages[j] == errors[i].message){
				break;	//追加せずに抜ける。
			//エラーメッセージの重複がなかったら
			} else if(errorMessages.length >= j){
				//エラーメッセージを配列に追加する。
				errorMessages.push(errors[i].message);	
			}
		}
	}
	
	//エラーメッセージを取得する。
	for(var i = 0; i < messageLength; i++){
		//エラー文を追加する。
		retText += errorMessages[i] + '\n';
		//エラーメッセージごとに要素を走査する。filter関数で対象の要素を絞り込む。
		$(errors).filter(function(){
			return this.message == errorMessages[i];	//エラーメッセージが一致した要素を返す。
		}).each(function(){	//each関数で対象を走査する。
			//retTextに名前を箇条書きする。
			retText += '・' + jpNames[$(this.element).attr('name')] +'\n';
		});
		//項目ごとに改行する。
		retText +='\n';
	}
	
	return retText;	//作成したメッセージを返す。
}

/*
 * 関数名:function deleteNumberKey(map)
 * 引数  :map map: 処理対象とする連想配列。
 * 戻り値:なし
 * 概要  :数字のキーを消す。
 * 作成日:2015.04.16
 * 作成者:T.Masuda
 */
function deleteNumberKey(map){
	//キーが数字かどうかのチェックを行いながら走査する。
	for(key in map){
		//キーが数字であれば
		if(!(isNaN(key))){
			delete map[key];	//キーを削除する。
		}
	}
}

/*
 * 関数名:function saveOptionSetting()
 * 概要  :オプションの設定を保存する。
 * 引数  :なし
 * 戻り値:なし
 * 作成日:2015.04.19
 * 作成者:T.Masuda
 */
function saveOptionSetting(){
	//設定のデータを連想配列にして返してもらう。
	var settingData = JSON.stringify(createOptionData());
	
	//Ajax通信でサーバに写真のデータを送信する。
	$.ajax({
		url:init['postJSON'],	//初期化データの連想配列にあるURLに送信する
		method:"POST",			//POSTメソッドで送信量を気にせず送信できるようにする。
		dataType:'text',		//JSONで返してもらう。	//サーバ側の処理を実装するまでダミーの処理を使う。
		//dataType:'json',		//JSONで返してもらう。
		data:{json:settingData, contentNum:"2"},	//作成した設定を送信する。
		//通信が成功したら
		success:function(json){
			var success = 1;	//成功したかどうかのデータを取得する。//ダミーの処理を用意する。
			//var success = parseInt(json['issuccess']);	//成功したかどうかのデータを取得する。返ってきた数値で判定する。
			var message = "更新に失敗しました。時間をおいてお試しください。";	//メッセージを格納する変数を宣言する。
			//取得したデータが成功のものなら
			if(success){
				message = "更新が完了しました。";	//成功メッセージを用意する。
			}

			alert(message);	//結果をダイアログで表示する。
		},
		//通信が失敗したら
		error:function(){
			//保存失敗の旨を伝える。
			alert('通信に失敗しました。時間をおいてお試しください。');
		}
	});
}

/*
 * 関数名:function createOptionData()
 * 概要  :オプションページの設定の送信データを作成する。
 * 引数  :なし
 * 戻り値:Object : 設定データの連想配列。
 * 作成日:2015.04.03
 * 作成者:T.Masuda
 */
function createOptionData(){
	//フォームデータを作る。
	var retMap = createFormData($('.optionForm'));
	//ユーザIDを格納する。
	retMap['userId'] = getUserId();

	return retMap;	//作成したデータを返す。
}

/*
 * 関数名 :function loadValue(settings)
 * 引数  　:map settings:個人設定情報の連想配列。
 * 戻り値　:なし
 * 概要  　:Myオプションページの個人設定をロードする。
 * 作成日　:2015.04.18
 * 作成者　:T.Masuda
 */
function loadValue(settings){
	//settingsを走査する
	for(key in settings){
		//キーからname属性で対象の要素を取得する。
		var $elem = $('[name="' + key + '"]');
		//elemのタイプを取得する。
		var type = $elem.attr('type');
		//値を取得する。
		var value = settings[key]['value'];
		
		//ラジオボタンであれば
		if(type == "radio"){
			//値に該当する要素をチェックする。
			$elem.filter('[value="' + settings[key]['value'] + '"]').prop('checked', true);
		//チェックボックスであれば
		} else if(type == "checkbox"){
			//チェックが入っているチェックボックスの値の配列の長さを取得する。
			var valueLength = value.length;
			
			//チェックボックスの配列を走査する。
			for(var i = 0; i < valueLength; i++){
				//チェックが入っていることになる要素であれば
				$elem.filter('[value="' + value[i] + '"]').prop('checked', true);
			}
		//それ以外であれば
		} else {
			//普通に値をセットする。
			$elem.val(value);
		}
	}
}

/*
 * 関数名 :function useFileReader(selector)
 * 引数  　:String selector:input type="file"のセレクタ
 * 戻り値　:なし
 * 概要  　:IE9以下でFile APIに対応する。
 * 作成日　:2015.04.23
 * 作成者　:T.Masuda
 */
function useFileReader(selector){
	$(selector).fileReader({		//fileReader.jsの関数をコールする
		id: 'fileReaderSWFObject',	//fileReaderSWFObjectのIDを指定する
		//filereader.swf へのパス
		filereader: 'js/source/filereader.swf',
		//expressInstall.swf へのパス
		expressInstall: 'js/source/expressInstall.swf',
		debugMode: true			//デバッグモードをオンにする。
	});
}

/*
 * 関数名 :createNewArticleList
 * 引数  　:int number: 作成する記事一覧の項目数
 * 戻り値　:なし
 * 概要  　:最新記事の一覧を作る
 * 作成日　:2015.05.27
 * 作成者　:T.Masuda
 */
function createNewArticleList(){
	//各項目を走査する
	$('.currentArticleList li').each(function(i){
		var $elem = $('a:first',this);	//リンク部分を取得する
		//クリックしたらブログの記事を作るコードを追加する
		$elem.attr('onclick', '$(".numberingOuter,.blog").empty();creator.outputTag(' + (i + 1) + ', "blogArticle",".blog");');
		
		var $elems = $('*',$elem);	//項目を取得する
		//ブログ記事のオブジェクトを取得する
		var articleNode = creator.json[String(i + 1)];
		//オブジェクトが取得できていなければ
		if(articleNode === void(0)){
			return;	//関数を終える
		}
		//記事一覧にテキストを入れる
		insertArticleListText($elems, articleNode);
	});
}

/*
 * 関数名 :insertBlogArticleListText
 * 引数  　:element elem:記事リストの項目を構成する要素
 * 　　　　:element articleNode:記事のノード
 * 戻り値　:なし
 * 概要  　:ブログの最新記事の一覧のテキストを入れる
 * 作成日　:2015.05.27
 * 作成者　:T.Masuda
 */
function insertBlogArticleListText(elems, articleNode){
	var elemsLength = elems.length; //項目数を取得する
	//ループで値を入れていく
	for(var j = 0; j < elemsLength; j++){
		//タグ名を取得する
		var tagName = elems[j].tagName;
		//タグ名でデータを取得するJSONノードを決める
		//タイトル
		if(tagName == 'P'){
			//値を入れる
			elems.eq(j).text(articleNode.blogArticleTitle.blogArticleTitleText.text);
			//日時
		} else if(tagName == 'TIME'){
			//値を入れる
			elems.eq(j).text(articleNode.blogArticleTitle.blogArticleDate.text);
			//投稿者
		} else if(tagName == 'SMALL'){
			//値を入れる
			elems.eq(j).text(articleNode.blogArticleTitle.blogArticleUserName.text);
		}
	}
}

/*
 * 関数名 :insertArticleListText
 * 引数  　:element elems:記事リストのDOM
 * 　　　　:element articleNodes:最新記事のタイトル、日付、ユーザー名の連想配列を格納した配列
 * 戻り値　:なし
 * 概要  　:最新記事の一覧のテキストを入れる
 * 作成日　:2015.06.04
 * 作成者　:T.Masuda
 */
function insertArticleListText(elems, articleNodes){
	var articleLength = articleNodes.length; //項目数を取得する
	//ループで値を入れていく。記事データか記事一覧のDOMがなくなったら終了する
	for(var i = 0; i < articleLength && elems[i] != void(0); i++){
		for(key in articleNodes[i]){
			//タイトルを作成する
			$('p',elems[i]).text(articleNodes[i].title);
			//日付を作成する
			$('time',elems[i]).text(articleNodes[i].date);
			//ユーザ名を作成する
			$('small',elems[i]).text(articleNodes[i].user);
		}
	}
}

/* 
 * 関数名:setSelectboxText
 * 引数  :rowData:テーブルの連想配列、DBから取り出した値を使う(値の取得元)
 		 selectboxArray:セレクトボックスの配列構造になっているjsonkey名(値の挿入先)
 		 selectboxTextTarget:抜き出す対象となるテーブルのkey名(値の取得key名)
 * 戻り値:なし
 * 概要  :selectタグのoptionタグに入るテキスト要素をoutput前にDBから取り出した値を連想配列に入れて実装する
 * 作成日 :2015.07.14
 * 作成者:T.Yamamoto
　*/
function setSelectboxText(rowData, selectboxArray, selectboxTextTarget) {
	//テーブルに値がないときはなにもしないようにする
	if(rowData[0]) {
		//ループで行の番号をとるようにするためにカウンターを初期値0で作る
		var counter = 0;
		//テーブルの行の回数だけループし、テーマを取り出す
		$.each(rowData, function(){
			//取り出したテーマを変数に入れ、セレクトボックスに入れるかどうか判定に使う
			var selectboxText = rowData[counter][selectboxTextTarget];
			//セレクトボックスにテーマを全て抜き出すために同じ値はテーマに追加しないようにする
			if(selectboxArray.indexOf(selectboxText) == -1) {
				//jsonの連想配列にテーマのを追加する
				selectboxArray.push(selectboxText);
			}
			//カウンター変数をインクリメントする
			counter++;
		});
	}
}

/* 
 * 関数名:setSelectboxValue
 * 引数  :selector セレクトボックスのセレクター
 * 戻り値:なし
 * 概要  :optionタグのvalue属性に値を入れる
 * 作成日 :2015.06.24
 * 作成者:T.Yamamoto
　*/
function setSelectboxValue(selector) {
	// optionタグをループで全て操作する
	$(selector + ' option').each(function(i){
		// optionタグの文字列を変数に入れる
		var selectValue = $(this).text();
		// 取得した文字列をvalue属性に入れる
		$(this).val(selectValue);
	});
}

/*
 * 関数名:saveCustomizeTabJsonFile
 * 引数  :createTag creator:createTagクラスのインスタンス
 * 戻り値:なし
 * 概要  :フラワースクール管理画面カスタマイズタブの保存を押したときのイベントを登録する
 * 作成日:2015.06.27
 * 作成者:T.Masuda
 */
function saveCustomizeTabJsonFile(creator){
	var $creator = $(creator);	//createTagのインスタンスをjQueryオブジェクトに入れる
	//管理画面カスタマイズタブの保存ボタンを押したときのイベントを登録する
	$(document).on('click', '#customize .saveButton', function(){
		//更新ボタンのtarget属性に仕込まれた更新対象のJSONのトップノード名を取得する。
		var topNodeName = $(this).attr('target'); 
		//トップノード名からDOMのトップのIDを指定し、JSONを更新する。
		//thisの中身がボタンなので、ownに保存したクラスのインスタンスで関数を呼び出す。
		$creator.updateElementJson($creator.json[topNodeName], $('#'+topNodeName));
		//JSONを保存用に文字列に変換する。
		var jsonString = JSON.stringify($creator.json[topNodeName]);
		
		//Ajax通信でJSONをファイルに保存する。
		$.ajax({
			url:'savetextfile.php',	//保存するプログラムのパスを指定する。
			method:'POST',			//POSTメソッドで送信する。
			//送信するデータを設定する。ファイルのパスとJSON文字列を送信する。
			data:{text:jsonString, path:'source/' + topNodeName + '.json'},
			dataType:'text',		//テキストデータを返してもらう。
			//キャッシュを無効にする。
			cache:false,
			async:false,	//同期通信
			success:function(text){	//通信成功時
				alert(text);	//保存結果のログを出す。
			},
			error:function(){		//通信失敗時
				//通信失敗のログを出す。
				alert('通信に失敗しました。時間をおいて試してください。');
			}
		});
	});
}

/* 
 * 関数名:setDBdata
 * 概要  :dbに接続し、データの挿入または更新または削除を行う
 * 引数  :object sendQueryJsonArray: DBに接続するためにdb_setQueryを子に持つcreatorの連想配列
 		:object queryReplaceData: クエリの中で置換するデータが入った連想配列
 		:string successMessage: クエリが成功した時のメッセージ
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.06.27
 */
function setDBdata(sendQueryJsonArray, queryReplaceData, successMessage) {
	//DBに送信するための連想配列
	var send = {};
	//置換済みであるかどうか判定するためにkey名を一つだけ取り出す
	for(var arrayKey in queryReplaceData) {
		//key名を取り出したらループを回さずに終わらせる
		break;
	}
	//置換済みでなければ置換する
	if(!queryReplaceData[arrayKey].value) {
		send = $.extend(true, {}, sendQueryJsonArray, creator.replaceValueNode(queryReplaceData))
	//置換済みであれば値をそのまま結合する	
	} else {
		send = $.extend(true, {}, sendQueryJsonArray, queryReplaceData);
	}
	//変更者:T.Yamamoto 日付:2015.06.26 内容:jsondbManagerに送信する値はjson文字列でないといけないので連想配列を文字列にする処理を追加しました。
	var sendJsonString = JSON.stringify(send);
	//Ajax通信を行う
	$.ajax({
		url: URL_SAVE_JSON_DATA_PHP,		//レコード保存のためのPHPを呼び出す
		//予約情報のJSONを送信する
		//変更者:T.Yamamoto 日付:2015.06.26 内容:dataを変数sendから変数sendJsonStringに変更し、送信する値を配列から文字列を送信するように修正しました
		data:{json:sendJsonString},				//送信するデータを設定する
		dataType: STR_TEXT,					//テキストデータを返してもらう
		type: STR_POST,						//POSTメソッドで通信する
		success:function(ret){				//通信成功時の処理
			//受け取ったjson文字列を連想配列にする
			var resultJsonArray = JSON.parse(ret);
			//更新した結果が何件であったかを返すために、結果件数を変数に入れる
			var resultCount = Number(resultJsonArray.message);
			//更新成功であれば
			//変更者:T.Yamamoto 日付:2015.07.06 内容:コメント化しました
			//if(!parseInt(parseInt(ret.message)) && ret.message != "0"){
			//変更者:T.Yamamoto 日付2015.07.17 内容: ループで更新に対応するために第三引数が空白ならアラートを出さない設定をしました
			//第三引数が空白であるならループで更新を行うということなのでアラートを出さない
			if(successMessage != '') {
				//更新した内容が1件以上の時更新成功メッセージを出す
				if(resultCount >= 1) {
					alert(successMessage);	//更新成功のメッセージを出す
				//更新失敗であれば
				} else {
					alert(STR_TRANSPORT_FAILD_MESSAGE);	//更新失敗のメッセージを出す
				}
			}
			//クエリを発行した結果、何件DBのデータを更新したかを返す。
			return resultCount;
		},
		error:function(xhr, status, error){	//通信失敗時の処理
			//通信失敗のアラートを出す
			alert(MESSAGE_FAILED_CONNECT);
		}
	});
}

/* 
 * 関数名:clickCalendar
 * 概要  :クリックしたときにカレンダーを表示し、日付を指定できるようにする
 * 引数  :string selector:カレンダーをクリックしたときにだしたいセレクター名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.06.27
 */
function clickCalendar(selector) {
	$('[name=' + selector + ']').datepicker({
		// 年月日の順番で表示するフォーマットにする
		dateFormat: 'yy-mm-dd',
		// 月をセレクトボックスで選択できるようにする
		changeMonth: true,
		// 年をセレクトボックスで選択できるようにする
		changeYear: true,
		// 選択できる年は1910年から2100年の範囲にする
		yearRange: '1910:2100',
	});
}

/* 
 * 関数名:getInputData
 * 概要  :テキストボックスとセレクトボックスとテキストエリアのデータを取得し、
		:クラス名をkey、入っている値をvalueの連想配列にして返す
 * 引数  :string selector:値を走査したい親のセレクター名
 * 返却値  :object resultArray:入力データの結果連想配列
 * 作成者:T.Yamamoto
 * 作成日:2015.06.27
 */
function getInputData(selector) {
	//結果の変数を初期化する
	var resultArray = {};
	//inputタグ、セレクトタグ、テキストエリアタグの数だけループする
	$('.' + selector + ' input, .' + selector + ' select, .' + selector + ' textarea').each(function() {
		//入力データのname属性を取得する
		var name = $(this).attr('name');
		//入力データの値を取得する
		var valueData = $(this).val();
		//ラジオボタンやチェックボックスの判定に使うため、type属性を取得する
		var typeAttr = $(this).attr('type');
		//ラジオボタンに対応する
		if (typeAttr == 'radio') {
			//ラジオボタンの値がチェックされているものだけ送信する
			if($(this).prop('checked')) {
				//ラジオボタンにチェックがついているものの値を送信する連想配列に入れる
				resultArray[name] = valueData;
			}
		} else {
			//入力データを結果の変数に、key名をクラス名にして保存する
			resultArray[name] = valueData;
		}
	});
	//結果を返す
	return resultArray;
}

/* 
 * 関数名:setValueDBdata()
 * 概要  :連想配列から値を読み込んで、テキストボックスのvalue属性に値を入れる。
 		会員ページのプロフィール変更で、ユーザの情報をテキストボックスに入れるのに用いる。
 		テキストボックスのname属性値がDBの列名と対応している。
 * 引数  :object setArray:テキストボックスに値を挿入するための値が入った連想配列名
 		setDomParent:取得したvalueをセットするためのdomの親要素セレクター名
 		targetArrayType:第一引数の連想配列がテーブルから取り出した値なのか、DBのtextキーに入れた値なのかを区別するための引数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setValueDBdata(setArray, setDomParent, targetArrayType) {
	//ループで連想配列を全てループする
	for (var key in setArray) {
		//第二引数の値がkeyTableであるなら、テーブルから取り出した値を対象とするのでその値を変数に入れる
		if (targetArrayType == 'keyTable') {
			//テーブルから取り出した値をキーにして値を取得する
			var resultValue = setArray[key]
		//テーブルの置換済みの値からデータを読み込む場合の処理
		} else if (targetArrayType == 'keyValue') {
			//テーブルの置換済みの値を読み込む
			var resultValue = setArray[key].value;
		//テーブルから取り出した値でないときはtextがキーとなって値を取り出しているのでその値を取得する
		} else {
			//値を挿入する結果のvalueを変数に入れる
			var resultValue = setArray[key]['text'];
		}
		//対象の要素がテキストエリアのときにtextで値を入れる
		if ($(setDomParent + ' [name="' + key + '"]').prop("tagName") == 'TEXTAREA') {
			//name属性がkeyのものに対して属性をDBから読み出した値にする
			$(setDomParent + ' [name=' + key + ']').text(resultValue);
		//値をセットする対象のdomがラジオボタンのときに対象の値に対してチェックを入れる処理をする
		} else if($(setDomParent + ' [name=' + key + ']').attr('type') == 'radio') {
			//値が当てはまるチェックボックスに対してチェックを入れる
			$(setDomParent + ' [name=' + key + '][value="' + resultValue + '"]').prop('checked', true);
		//値をセットする対象のdomがテキストボックスであるならばループ中の値をテキストボックスのデフォルト値に設定する
		} else {
			//name属性がkeyのものに対してvalue属性をDBから読み出した値にする
			$(setDomParent + ' [name=' + key + ']').val(resultValue);
		}
	}
}

/* 
 * 関数名:insertTextboxToTable
 * 概要  :テーブルにテキストボックスを挿入する。
		受講承認テーブルなどでセルの内容をテキストボックスにする時に使う
 * 引数  :string tableClassName 対象テーブルのクラス名
 		string appendDom 追加するdom名
 		string appendTo 追加先セレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function insertTextboxToTable (tableClassName, appendDom, appendTo) {
	//テキストボックスを挿入するために表示しているセルのテキストを削除する
	$(DOT + tableClassName + ' tr:eq(0) td').removeClass(appendTo);
	//テキストボックス追加先のdomに表示している文字列を空白で初期化する
	$(DOT + appendTo).text('');
	//テキストボックスを追加する
	creator.outputTag(appendDom, 'replaceTextbox', DOT + appendTo);
}

/* 
 * 関数名:setInputValueToLecturePermitListInfoTable
 * 概要  :受講者一覧テーブルのテキストボックスにデフォルトで値を入れる。
 		使い方はsetTableTextboxValuefromDB関数で引数として呼ばれるときのみ使う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function setInputValueToLecturePermitListInfoTable() {
	//DBから取得した料金の値を取得する
	resultValueCost = recordData['cost'];
	//DBから取得した使用ptの値を取得する
	resultValueUsePoint = recordData['use_point'];
	//テーブルの料金のテキストボックスに対してデフォルトでDBから読込んだ値を入れる
	$('[name=user_classwork_cost]').eq(counter).attr('value', resultValueCost);
	//テーブルの料金の使用ptに対してデフォルトでDBから読込んだ値を入れる
	$('.replaceTextboxUsePointCell [name=use_point]').eq(counter).attr('value', resultValueUsePoint);
	//データが授業でーたでなく備品データのとき備品データをデフォルトでセットする
	if(recordData['lesson_name'] == "" && recordData['content'] != "") {
		//DBから取得した日備品の値を取得する
		resultValueCommodityName = recordData['content'];
		//備品名セレクトボックスにデフォルト値をDBから読込んだ値で設定する。
		$('.lecturePermitListInfoTable tr:eq(' + rowNumber + ') [name="content"]').val(resultValueCommodityName);
	}
}

/* 
 * 関数名:setTableTextboxValuefromDB
 * 概要 :テーブルのテキストボックスにDBから読込んだ値をデフォルトでセットする
 * 引数 :tableArray:DBから読込んだテーブルのデータが入っている連想配列:例(受講者一覧テーブル) creator.json.LecturePermitListInfoTable.table
		:setTablefunc:テーブルのテキストボックスに値をセットするための関数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function setTableTextboxValuefromDB(tableArray, setTablefunc) {
	//DBから読込んだ値を取り出すためにカウンターを初期値0で作る
	counter = 0;
	//テーブルに値をセットするために行番号を初期値1で作る(0は見出しであるため、1から数え始める)
	rowNumber = 1;
	//DBから取り出したテーブルの行数分ループしてテキストボックスにデフォルト値をセットする
	$.each(tableArray, function(){
		//DBから読込んだ値を取り出すためにループのカウンターに対応した行の値を指定する
		recordData = tableArray[counter];
		//テキストボックスにDBから読込んだ値を入れる
		setTablefunc();
		//行番号をインクリメントする
		rowNumber++;
		//カウンタ変数をインクリメントする
		counter++;
	});
}

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
	$('.updateButton').click(function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = getInputData('memberInfo');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = creator.json.memberHeader.user_key.value;
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
		erroeMesseageInput(checkInputName, 'user_name', '名前に数字や記号が入っています');
		//カナの入力された文字をチェックする
		erroeMesseageInput(checkInputName, 'name_kana', '名前(カナ)に数字や記号が入っています');
		//電話番号の入力された文字をチェックする
		erroeMesseageInput(checkInputPhone, 'telephone', '電話番号に文字や記号が入っています');

		//入力内容エラーがあったときにメッセージを表示する
		if(updateError.length) {
			//配列を結合してエラーメッセージのアラートを出す
			alert(updateError.join(','))
		//入力内容にエラーがなかった時の処理
		} else {
			//データべベースにクエリを発行してデータを更新する
			setDBdata(creator.json.updateUserInf, queryReplaceData, MESSAGE_SUCCESS_PROFILE_UPDATE);
		}
	})
}

/* 
 * 関数名:updatePassword
 * 概要  :パスワード変更画面で更新ボタンを押されたときにテキストボックスに
 		 入っている値をDBに送信してデータを更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function setPasswordUpdate() {
	//更新ボタンが押された時の処理
	$('.updateButton').click(function(){
		//ユーザが入力した値を取得する
		var queryReplaceData = getInputData('postPass');
		//ユーザ番号を追加する
		queryReplaceData['userId'] = creator.json.memberHeader.user_key.value;
		//新しいパスワードと確認のパスワードが一致すれば登録する
		if(queryReplaceData.newPass === queryReplaceData.password) {
			//データべベースにクエリを発行してデータを更新する
			setDBdata(creator.json.updatePassword, queryReplaceData, MESSAGE_SUCCESS_PASSWORD_UPDATE);
		} else {
			alert('パスワードが確認と異なります');
		}
		
	});
}

/* 
 * 関数名:addCheckbox
 * 概要  :チェックボックスを追加する
 * 引数  :selector : チェックボックスをappendするセレクター名
 		 attrName : チェックボックスのクラス名とname属性名(共通)
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.02
 */
function addCheckbox(selector, attrName) {
	$('.' + selector).html('<input class="' + attrName + '" type="checkbox" name="' + attrName + '">');
}

//リプレイステーブル連想配列
var replaceTableOption = {};
//予約中授業テーブル
replaceTableOption['reservedLessonTable'] = {
	//クエリを置換する置換フラグ、クエリを置換する
	replaceFlag:'replace',
	//テーブルのafterでの追加先
	addDomPlace:'#alreadyReserved .selectTheme',
	//テーブルのリロードが終わった時に行のクラス名を付ける処理とメルマガ内容列を指定文字数以内にする関数を呼び出す関数名を定義しておく
	afterReloadFunc:afterReloadReservedLessonTable,
	//置換のvalueが入ったdom名
	replaceValueDom:'#alreadyReserved .selectThemebox',
	//置換するkey名
	replaceQueryKey:'lesson_name',
	//テーブルの値を置換する関数名
	replaceTableValuefunction:'callMemberLessonValue',
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'予約中の授業が見つかりませんでした。'
}
//受講済み授業テーブル
replaceTableOption['finishedLessonTable'] = {
	//クエリを置換する置換フラグ、クエリを置換する
	replaceFlag:'replace',
	//テーブルのafterでの追加先
	addDomPlace:'#finishedLesson .selectTheme',
	//置換のvalueが入ったdom名
	replaceValueDom:'#finishedLesson .selectThemebox',
	//置換するkey名
	replaceQueryKey:'lesson_name',
	//テーブルの値を置換する関数名
	replaceTableValuefunction:'callMemberLessonValue',
	//ページングの追加先
	addPagingPlace:'.tabLink[href="#finishedLesson"]',
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'受講済みの授業が見つかりませんでした。'
}
//管理者画面、日ごと授業一覧
replaceTableOption['eachDayReservedInfoTable'] = {
	//クエリを置換する置換フラグ、クエリを置換する
	replaceFlag:'replace',
	//テーブルのafterでの追加先
	addDomPlace:'.dateSelect',
	//置換のvalueが入ったdom名
	replaceValueDom:'.dateInput',
	//置換するkey名
	replaceQueryKey:'lesson_date',
	//テーブルの値を置換する関数名
	replaceTableValuefunction:'callEachDayReservedValue',
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'この日の予約者はいません'
}

//管理者画面、ユーザ一覧
replaceTableOption['userListInfoTable'] = {
	//クエリを置換する置換フラグ、クエリを置換する
	replaceFlag:'add',
	//テーブルのafterでの追加先
	addDomPlace:'.searchUserList',
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'検索結果が見つかりませんでした。',
	//ページングの追加先
	addPagingPlace:'.tabLink[href="#userList"]'
}

//メルマガテーブル
replaceTableOption['mailMagaTable'] = {
	//クエリを置換する置換フラグ、クエリを追加する(検索機能で使う)
	replaceFlag:'add',
	//テーブルのafterでの追加先
	addDomPlace:'.mailMagaSearchArea',
	//テーブルのリロードが終わった時に行のクラス名を付ける処理とメルマガ内容列を指定文字数以内にする関数を呼び出す関数名を定義しておく
	afterReloadFunc:afterReloadMailMagaTable,
	//置換のvalueが入ったdom名
//	replaceValueDom:'#finishedLesson .selectThemebox',
	//置換するkey名
//	replaceQueryKey:'lesson_name',
	//テーブルの値を置換する関数名
	//replaceTableValuefunction:'',
	//ページングの追加先
	addPagingPlace:'.tabLink[href="#mailMagaAndAnnounce"]',
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'メルマガが見つかりませんでした。'
}

//受講承認一覧テーブル
replaceTableOption['lecturePermitListInfoTable']  = {
	//テーブルのafterでの追加先
	addDomPlace:'.permitListSearch',
	//テーブルのリロードが終わった時に処理を行う関数をまとめてコールしてテーブルを編集する
	afterReloadFunc:afterReloadPermitListInfoTable,
	//検索結果がなかった時のエラーメッセージ
	errorMessage:'受講承認一覧が見つかりませんでした。'
}

/*
 * 関数名 :addQueryExtractionCondition
 * 概要  　:ボタンがクリックされた時にテーブルの中身を入れ替える時に発行するクエリに抽出条件を追加する
 * 引数  　:element inputDataParent:テキストボックスが入っているdom名
 * 　　　　:string query:テーブル作成のためにDBに送信するクエリ文字列
 * 戻り値　:なし
 * 作成日　:2015.07.03
 * 作成者　:T.Yamamoto
 */
function addQueryExtractionCondition(inputDataParent, queryArrayKey) {
	var counter = 0;
	//inputタグの数ループする
	$('.' + inputDataParent + ' input[type="text"]').each(function(){
		//入力された値が空白でなければ
		if($(this).val() != "") {
				//入力値を取得する
				var inputData = $(this).val();
				//name属性を所得する
				var attrName = $(this).attr('name');
			//カウンターが0でなければ
			if(counter != 0){
				//追加する変数を作る
				var addString = ' AND ' + attrName + " LIKE '%" + inputData + "%' ";
			} else {
				//追加する変数を作る
				var addString = ' WHERE ' + attrName + " LIKE '%" + inputData + "%' ";
				counter++;
			}
			//クエリに文字を付け加える
			creator.json[queryArrayKey].db_getQuery += addString;
		}
	});
}

/*
 * 関数名 :replaceTableQuery
 * 概要  　:ボタンがクリックされた時にテーブルの中身を入れ替える時に発行するクエリに抽出条件を追加する
 * 引数  　:element inputDataParent:テキストボックスが入っているdom名
 * 　　　　:string query:テーブル作成のためにDBに送信するクエリ文字列
 * 戻り値　:なし
 * 作成日　:2015.07.03
 * 作成者　:T.Yamamoto
 */
function replaceTableQuery(queryArrayKey) {
	//置換するための値を取得する
	var replaceValue = $(replaceTableOption[queryArrayKey]['replaceValueDom']).val();
	//置換するものが「全て以外であれば置換する」
	if (replaceValue != '全て') {
		//置換するためのkey名を取得する
		var replaceKey = replaceTableOption[queryArrayKey]['replaceQueryKey'];
		//取得した値をjsonの反映させる
		creator.json[queryArrayKey][replaceKey]['value'] = replaceValue;
		//クエリをテーマ検索用のものと入れ替える
		creator.json[queryArrayKey].db_getQuery = creator.json[queryArrayKey].replace_query;
	//絞込ボタンで「全て」が選択されたときに全ての値を検索するためのクエリを入れる
	} else {
		//全ての値を検索するためのクエリをセットする
		creator.json[queryArrayKey].db_getQuery = creator.json[queryArrayKey].allSearch_query;
	}
}


/* 
 * 関数名:reloadTableTriggerEvent
 * 概要  :クエリにテキストボックスから受け取った値を抽出条件に加える
   ユーザが入力した内容でDBからデータを検索したいときにクエリをセットするために使う関数
 * 引数  :eventSelector 			: イベントが始まる検索ボタンの親要素
         eventName 				: どのイベントを行うかの名前
         reloadTableClassName 	: リロードするテーブルクラス名
         inputDataParent 		: クエリがaddのときクエリにデータを加えるためのテキストボックスの親要素のセレクター名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.03
 */
function reloadTableTriggerEvent(eventSelector, eventName, reloadTableClassName, inputDataParent) {
		//対象のボタンがクリックされた時テーブルをリロードするイベントを登録する
		$(STR_BODY).on(eventName, eventSelector, function(){
			//テーブルをリロードして最新のデータを表示する
			eventTableReload(reloadTableClassName, inputDataParent);
		});
}

/* 
 * 関数名:eventTableReload
 * 概要  :クリックやチェンジイベントで発生するテーブル再読み込み処理をまとめたもの。
		reloadTableTriggerEvent関数内で使い、用途に合わせてテーブルを更新する
 * 引数  :eventButtonParent: イベントが始まる検索ボタンの親要素
         queryArrayKey : クエリが入っている連想配列のkey
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.03
 */
function eventTableReload(reloadTableClassName, inputDataParent) {
	//クエリ初期状態を保存する
	var queryDefault = creator.json[reloadTableClassName].db_getQuery;
	//クエリの置換フラグが追記のとき
	if (replaceTableOption[reloadTableClassName].replaceFlag == 'add') {
		//クエリに追記を行う関数を実行する
		addQueryExtractionCondition(inputDataParent, reloadTableClassName);
	//置換フラグが置換のとき
	} else if (replaceTableOption[reloadTableClassName].replaceFlag == 'replace') {
		//クエリの置換を行う関数を実行する
		replaceTableQuery(reloadTableClassName);
		//ページング機能が実装されているのであればページング処理を行う
		if(replaceTableOption[reloadTableClassName].addPagingPlace) {
			//重複してクリックイベントを登録しないためにテーブルのクリックした時のイベントを削除する
			$(DOT + PAGING).parent().off(CLICK);
			//テーブルページング領域を消す
			$(DOT + PAGING_AREA).remove();
			//テーブルページングを実装する(1ページに15行表示し、5ページが最大表示)
			tablePaging(reloadTableClassName, 15, 6);
			//処理を終わらせるためにreturnで終える
			return;
		}
	}
	//テーブルをリロードする
	tableReload(reloadTableClassName);
	// クエリを最初の状態に戻す
	creator.json[reloadTableClassName].db_getQuery = queryDefault;
}

/* 
 * 関数名:tableReload
 * 概要  :テーブルをリロードする
 * 引数  :reloadTableClassName:リロードする対象のテーブルのクラス名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function tableReload(reloadTableClassName) {
	//テーブルのjsonの値が既にあれば
	if(creator.json[reloadTableClassName].table){
		//テーブルのjsonを初期化する
		creator.json[reloadTableClassName].table = {};
	}
	//テーブルを作るためのjsonをDBから持ってきた値で作る
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json[reloadTableClassName], reloadTableClassName);
	//すでにテーブルがあるならテーブルを消す
	if ($(DOT + reloadTableClassName)) {
		//テーブルを消す
		$(DOT + reloadTableClassName).remove();
	}
	//DBから取得した値があった時の処理
	if(creator.json[reloadTableClassName].table[0]){
		//テーブルを作り直す
		creator.outputTagTable(reloadTableClassName,reloadTableClassName,STR_BODY);
		//テーブルの値の置換が必要な場合は置換を行う
		if(replaceTableOption[reloadTableClassName].replaceTableValuefunction) {
			//変更の必要があるテーブルの配列を変数に入れる
			var targetTableArray = creator.json[reloadTableClassName][TAG_TABLE];
			// 予約中テーブルのテーブルの値をしかるべき値にする
			lessonTableValueInput(DOT + reloadTableClassName, targetTableArray, replaceTableOption[reloadTableClassName].replaceTableValuefunction);
		}
		//テーブルのリロード後にテーブルに対して必要な処理が必要であるならばその処理を行う
		if(replaceTableOption[reloadTableClassName].afterReloadFunc) {
			//リロード後に処理をする関数をコールする
			replaceTableOption[reloadTableClassName].afterReloadFunc();
		}
	//DBから検索結果が見つからなかった時の処理
	} else {
		//見つからなかったことを表示するためのdivを作る
		$(STR_BODY).append('<div class="' + reloadTableClassName + '"><div>');
		//作ったdivに検索結果が見つからなかったメッセージを表示する
		$(DOT + reloadTableClassName).text(replaceTableOption[reloadTableClassName].errorMessage);
	}
	//作ったテーブルをしかるべき場所に移動する
	$(replaceTableOption[reloadTableClassName].addDomPlace).after($(DOT + reloadTableClassName));
}

/* 
 * 関数名:getDateFormatDB
 * 概要  :日付オブジェクトからフォーマットをyyyy-mm-dd方式に変換してその文字列を返す(DBに適したフォーマットにする)
 * 引数  :date:日付型オブジェクト
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function getDateFormatDB(date) {
	var year = date.getFullYear();		//年
	var month = date.getMonth() + 1;	//月
	var date = date.getDate();			//日
	//月が1月から9月のとき先頭に0を足す
	if (month < 10) { month = "0" + month; }
	//日が1日から9日のとき先頭に0を足す
	if (date < 10) {  date = "0" + date; }
	//現在の日付を返す
	var nowDate = year + "-" + month + "-" + date;
	//現在日付を返す。
	return nowDate;
}

/* 
 * 関数名:nowDatePaging
 * 概要  :現在の日付からページング機能を実装する
 * 引数  :clickSelectorParent:クリックボタンのセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function nowDatePaging(clickSelectorParent) {
	//現在時刻のオブジェクトを作る
	var nowDateObject = new Date();
	//日付の文字列を取得する
	var nowDateString = getDateFormatDB(nowDateObject);
	//日付をタイトルに入れる
	$(DOT + clickSelectorParent + ' p').text(nowDateString);
	//jsonに日付の値を入れる
	creator.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//対象の要素がクリックされたときに日付を進退する
	$(DOT + clickSelectorParent + ' a').click(function(){
		//クリックされた番号を取得する
		var className = $(this).attr('class');
		//取得したクラスの名前によって処理を分ける
		switch(className) {
			//クリックされたのが2日前の時、日付を2日前にする
			case 'twoDaysBefore':
			nowDateObject.setDate(nowDateObject.getDate() - 2);
			break;
			//クリックされたのが1日前の時、日付を1日前にする
			case 'oneDayBefore':
			nowDateObject.setDate(nowDateObject.getDate() - 1);
			break;
			//クリックされたのが1日後の時、日付を1日後にする
			case 'oneDayAfter':
			nowDateObject.setDate(nowDateObject.getDate() + 1);
			break;
			//クリックされたのが2日後の時、日付を2日後にする
			case 'twoDayAfter':
			nowDateObject.setDate(nowDateObject.getDate() + 2);
			break;
		}
		//日付を更新する
		nowDateString = getDateFormatDB(nowDateObject);
		//jsonに日付の値を入れる
		creator.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
		//テーブルをリロードする
		tableReload('eachDayReservedInfoTable');
		//日付をタイトルに入れる
		$(DOT + clickSelectorParent + ' p').text(nowDateString);
	});
	//検索ボタンがクリックされた時の処理
	$(DOT + 'dateSelect .searchButton').click(function(){
		//表示されている日付を更新するために検索する日付のデータを取得する。
		var changeDate = $('.dateInput').val();
		//現在表示されている日付を入力された日付で更新する
		$(DOT + clickSelectorParent + ' p').text(changeDate)
		//日付オブジェクトを検索された値で更新し、ページングの基準となる値にする
		nowDateObject = new Date(changeDate);
	});
}


/* 
 * 関数名:getPagingCount
 * 概要  :ページングの個数を取得する
 * 引数  :pagingTargetTable:ページング対象となるテーブル名
 *       displayNumber:１つのページングで表示するレコードの件数
 *       pagingDisplayCount:ページングを最大何ページまで表示するのかの件数
 * 返却値  :pagingCounter:ページングの最大値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function getPagingCount(pagingTargetTable, displayNumber, pagingDisplayCount) {
	//DBからレコードのページングにしたいテーブルを取得する
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json[pagingTargetTable], pagingTargetTable);
	//テーブルの行数を取得する
	var recordCount = creator.json[pagingTargetTable].table.length;
	//表示件数の変数を作る
	var displayCount = displayNumber;
	//ページングの初期値を1にして変数に入れる
	var pagingCounter = 1;
	//ページングの値を求めるための結果変数
	var resultPaging = recordCount - (displayCount * pagingCounter);
	//ページング領域を作る
	$(replaceTableOption[pagingTargetTable].addDomPlace).after('<div class="pagingArea textCenter"></div>');
	//ページングした結果が0以上の時
	if(resultPaging >= 0) {
		//ループでページングを作る
		while(resultPaging = recordCount - (displayCount * pagingCounter) >= 0){
			//ページングが1以上5以下の時
			if (pagingCounter >= 1 && pagingCounter < pagingDisplayCount) {
				//ページングボタンを指定要素の先に追加する
				$(DOT + PAGING_AREA).append('<a class="paging inlineBlock"> ' + pagingCounter + ' </a>');
			//ページ数が6以上の時にページングを作らなくする
			} else if (pagingCounter == pagingDisplayCount) {
				//ページングの最後に次ページ記号を入れる
				$(DOT + PAGING_AREA).append('<a class="paging inlineBlock">>></a>');
			}
			//ページングボタンが初回の時は
			if(pagingCounter == 1) {
				//現在のページを表すクラスを付ける
				$(DOT + PAGING).eq(0).addClass(NOW_PAGE);
			}
			//カウンタをインクリメントする
			pagingCounter++;
		}
	} else {
		//ページングボタンを指定要素の先に追加する
		$(DOT + PAGING_AREA).append('<a class="paging inlineBlock"> ' + pagingCounter + ' </a>');
		//現在のページを表すクラスを付ける
		$(DOT + PAGING).eq(0).addClass(NOW_PAGE);
	}
	//ページングの最大値を返す
	return Number(pagingCounter)-1;
}

/* 
 * 関数名:setTableReloadExecute
 * 概要  :テーブルページング機能を実装する
 * 引数  :tableClassName:テーブルのクラス名
 		:addQueryString:クエリに追加する文字列
 *       defaultQuery:デフォルトのクエリ
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function setTableReloadExecute(tableClassName, addQueryString, defaultQuery) {
	//クエリに文字列を追加する
	creator.json[tableClassName].db_getQuery += addQueryString;
	//クエリからテーブルを作る
	tableReload(tableClassName);
	//クエリを追加前に戻す
	creator.json[tableClassName].db_getQuery = defaultQuery;
}

/* 
 * 関数名:getPagingMax
 * 概要  :ページングの最大値を取得し、次のページングに行く
 * 引数  :paging:ページングのクラス名
 		maxPaging:最大のページ番号
 *       pagingDisplayCount:ページング領域で表示するページングの件数
 * 返却値  :max : 次のページングの値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function getPagingMax(paging, maxPaging, pagingDisplayCount) {
	//最大値を0とする
	var max = 0;
	//現在のページのクラスをとる
	$(paging).removeClass(NOW_PAGE);
	// 要素から最大値を走査する
	$(paging).each(function(){
		//現在の値を取得する
		var current = $(this).text();
		//数字にだけ処理をする
		if(current.match(/\d/g)) {
			//現在の値を数字に変換する
			current = Number(current);
			//現在のテキストに1を足す
			$(this).text(current + 1);
			//現在の値がmaxより大きく、かつ数字の場合はmaxに現在の値を代入する
			if (current > max) {
				//現在の値が最大値になる
				max = current;
			}
		}
	});
	//最大値に1を足す
	max = Number(max) + 1;
	//現在の最大値のクラスを付ける
	$(paging + ':contains(' + max + ')' ).addClass(NOW_PAGE);
	//最初に次のページへの記号をクリックされたとき
	if(max == pagingDisplayCount) {
		//前ページの記号を付け足す
		$(DOT + PAGING_AREA).prepend('<a class="paging inlineBlock"><<</a>');
	
	}
	//ページングが最大値まで来たとき 
	if(max >= maxPaging) {
		//次ページの記号を取り除く
		$(paging + ':contains(">>")').remove();
	}
	//最大値に1を足したものを返す
	return max;
}

/* 
 * 関数名:getPagingMin
 * 概要  :ページングの最小値を取得し、前のページングに行く
 * 引数  :paging:ページングのクラス名
 		maxPaging:最大のページ番号
 *       pagingDisplayCount:ページング領域で表示するページングの件数
 * 返却値  :min : 前のページングの値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function getPagingMin(paging, maxPaging, pagingDisplayCount) {
	//最小値を1000とする
	var min = 1000;
	//現在のページのクラスをとる
	$(paging).removeClass(NOW_PAGE);
	// 要素から最大値を走査する
	$(paging).each(function(){
		//現在の値を取得する
		var current = $(this).text();
		//数字にだけ処理をする
		if(current.match(/\d/g)) {
			//現在の値を数字に変換する
			current = Number(current);
			//現在のテキストに1を引く
			$(this).text(current - 1);
			//現在の値がminより小さい
			if (current < min) {
				//現在の値が最小値になる
				min = current;
			}
		}
	});
	//最小値に1を引く
	min = Number(min) - 1;
	//現在の最小値にクラスを付ける
	$(paging + ':contains(' + min + ')' ).addClass(NOW_PAGE);
	//ページングが最小値まで来たとき 
	if(min == 1) {
		//次ページの記号を取り除く
		$(paging + ':contains("<<")').remove();
	}
	//最大のページでない時に次のページの記号を出す
	if((min+4) != maxPaging) {
		//クラス名を取得し、なかったときに次のページの記号を作る
		if (!($(paging + ':contains(">>")').attr('class'))) {
			//次ページの記号を付け足す
			$(DOT + PAGING_AREA).append('<a class="paging inlineBlock">>></a>');
		}
	}
	//最小値を返す
	return min;
}

/* 
 * 関数名:tablePaging
 * 概要  :テーブルページング機能を実装する
 * 引数  :pagingTargetTable:ページング対象となるテーブル名
 *       displayNumber:ページングで表示する件数
 *       pagingDisplayCount:ページング領域で表示するページングの件数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.07
 */
function tablePaging(pagingTargetTable, displayNumber, pagingDisplayCount) {
	//ページング領域を作る
	var maxPaging = getPagingCount(pagingTargetTable, displayNumber, pagingDisplayCount);
	//デフォルトのクエリを取得する
	var defaultQuery = creator.json[pagingTargetTable].db_getQuery;
	//最大の表示数
	var maxRecord = displayNumber;
	//最初の表示数
	var minRecord = 0;
	//追加するクエリ
	var addQuery = ' LIMIT ' + minRecord + ',' + maxRecord;
	//クエリを実行してテーブルを作る
	setTableReloadExecute(pagingTargetTable, addQuery, defaultQuery);
	//ページングがクリックされた時の処理
	$(DOT + PAGING).parent().on('click', DOT + PAGING, function(){
		//全てのページングからnowPageクラスを取り除く
		$(DOT + PAGING).removeClass(NOW_PAGE);
		//クリックされた要素の番号を取得する
		var nowPaging = $(this).text();
		//クリックされた要素が次のページ記号だった場合
		if (nowPaging == '>>') {
			//次のページの値を取得する
			nowPaging = getPagingMax(DOT + PAGING, maxPaging, pagingDisplayCount);
		//クリックされた要素が前のページ記号だった場合
		} else if (nowPaging == '<<') {
			//前のページの値を取得する
			nowPaging = getPagingMin(DOT + PAGING, maxPaging, pagingDisplayCount);
		} else {
			//クリックされたのが数字であるならば1を引いて正しいページングを行うようにする
			nowPaging = Number($(this).text())-1;
			//クリックされた要素にnowPageクラスを追加する
			$(this).addClass(NOW_PAGE);
		}
		//クエリにLIMITを追加する
		var pagingAddQuery = ' LIMIT ' + (minRecord + maxRecord * nowPaging ) + ',' + maxRecord;
		//クエリを実行してテーブルを作る
		setTableReloadExecute(pagingTargetTable, pagingAddQuery, defaultQuery);
		//今何件目まで表示しているしているかを取得する
		// var nowDisplayRecordCount = getPagingRecordCount(recordCount, nowPaging, maxRecord, minRecord);
		// console.log(nowDisplayRecordCount);
	});

	//加える文字列を返す
	// return nowDisplayRecordCount;
}

/* 
 * 関数名:getPagingRecordCount
 * 概要  :取得したテーブルの件数と今何件目まで表示しているかの値を求めて返す
 * 引数  :maxResultRecord	:テーブルの最大の表示件数
 		:nowPaging 			:ページングが今何ページ目にいるかの値
 		:nowMaxRecord	:現在表示している最大の表示件数
 		:nowMinRecord	:現在表示している最少の表示件数
 * 返却値  :resultDisplayRecord:現在表示している結果の値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.27
 */
function getPagingRecordCount(maxResultRecord, nowPaging, nowMaxRecord, nowMinRecord) {
	//現在表示している結果の値を入れる変数を作る
	var resultDisplayRecord;
	//現在表示している最少の値を求め、今何件目から表示しているかを表すのに使う
	displayMinRecord = nowMinRecord + nowMaxRecord * nowPaging;
	//現在表示している最大の値を求め、今何件目まで表示しているかを表すのに使う
	displayMaxRecord = nowMinRecord + nowMaxRecord * (nowPaging + 1) - 1;
	//表示している件数が最大件数よりも大きい時は
	if(displayMaxRecord > maxResultRecord) {
		//最大件数を表示最大件数とする
		displayMaxRecord = maxResultRecord;
	}
	//今何件目から何件目まで表示しているのかを返す
	resultDisplayRecord = displayMinRecord + '~' + displayMaxRecord + '/' + maxResultRecord;
	//今何件目まで表示しているかを返す
	return resultDisplayRecord;
}

/* 
 * 関数名:accordionSetting
 * 概要  :アコーディオン機能を実装する
 * 引数  :clickSelector:クリックされたときにアコーディオンを表示するためのきっかけとなるdom要素のセレクター名
 *       accordionDomSelector:アコーディオンの中身のdomセレクター名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.09
 */
function accordionSetting(clickSelector, accordionDomSelector) {
	//第一引数のセレクター要素がクリックされたときにアコーディオンを表示するためのイベントが発生する
	$(STR_BODY).on(CLICK, clickSelector, function(){
		//第二引数のセレクター要素が非表示状態なら表示状態に、表示状態なら非表示状態にする
		$(accordionDomSelector).slideToggle();
	});
}

/* 
 * 関数名:accordionSettingToTable
 * 概要  :テーブルの行用にアコーディオン機能を実装する
 * 引数  :clickSelector:クリックされたときにアコーディオンを表示するためのきっかけとなるdom要素のセレクター名
 *       accordionDomSelector:アコーディオンの中身のdomセレクター名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.16
 */
function accordionSettingToTable(clickSelector, accordionDomSelector) {
	//第一引数のセレクター要素がクリックされたときにアコーディオンを表示するためのイベントが発生する
	$(STR_BODY).on(CLICK, clickSelector + ' td', function(){
		//どのレコードを開くのか判別するためにレコードの番号を取得する
		var rowNumber = $(this).parent().index(clickSelector);
		//チェックボックスをクリックしてもアコーディオンが反応しないようにする
		if($(this).attr('class') != 'permitCheckboxArea') {
			//第二引数のセレクター要素が非表示状態なら表示状態に、表示状態なら非表示状態にする
			$(accordionDomSelector).eq(rowNumber).toggle();
		}
	});
}

/* 
 * 関数名:enterKeyButtonClick
 * 概要  :エンターが押された時に第二引数のボタンをクリックしたイベントを発生させる
		ログインダイアログのテキストボックスでエンターキーを押してログイン処理を開始するときや
		ユーザ一覧の検索でテキストボックスからエンターキーで検索処理を開始するときなどに使う
 * 引数  :enterTarget:エンターキーを押したときに対象となるセレクター名
 *       buttonText:クリックイベントを起こすボタンに表示されているテキスト
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.10
 */
function enterKeyButtonClick(enterTarget, buttonSelector) {
	//第一引数の要素にフォーカスしているときにエンターボタンを押すとクリックイベントを発生する
	$(enterTarget).keypress(function (e) {
		//エンターボタンが押された時の処理
		if (e.which == 13) {
			//ボタンを自動でクリックし、クリックイベントを起こす
			$(buttonSelector).click();
		}
	});
}

/* 
 * 関数名:checkInputName
 * 概要  :テキストボックスに入力された値が文字列のときはtrue、違うならfalseを返し、データ送信の入力チェックに使う
 * 引数  :checkString:チェックする文字列
 * 返却値  :resultbool:第一引数の文字列が数字や記号が入っているかどうかの判定結果
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function checkInputName (checkString) {
	//結果の変数をデフォルト値trueで作る
	var resultbool = true;
	//名前をチェックするために、第一引数の文字列に記号や数字が入っているとfalseを返す
	if(checkString.match(/[!-\/:-@≠\[-`{-~0-9]/)) {
		//名前の入力に適していないことを返す
		resultbool = false;
	}
	//名前の入力に適していたかどうかの結果を返す
	return resultbool;
}


/* 
 * 関数名:checkInputPhone
 * 概要  :テキストボックスに入力された値が数字かハイフンのときはtrue、違うならfalseを返し、データ送信の入力チェックに使う
 * 引数  :checkString:チェックする文字列
 * 返却値  :resultbool:数字かハイフンであったかどうかの判定結果
 * 作成者:T.Yamamoto
 * 作成日:2015.07.11
 */
function checkInputPhone (checkString) {
	//結果の変数をデフォルト値trueで作る
	var resultbool = true;
	//電話番号をチェックするために、第一引数の文字列にハイフンを除く記号や文字が入っているとfalseを返す
	if(checkString.match(/[\/\^\:\[\]\;\@\!\"\#\\%\&\'\(\)\=\~\<\>a-zA-Z]/)) {
		//電話番号の入力に適していないことを返す
		resultbool = false;
	}
	//電話番号に適していたかどうかの結果を返す
	return resultbool;
}

/* 
 * 関数名:loginInsteadOfMember
 * 概要  :管理者ページから会員に為り変わって会員ページにログインする
 * 引数  :memberId: なり代わりを行うための会員番号
 		:clickSelector クリックしてなり代わりを行うセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function loginInsteadOfMember (memberId) {
		//会員のヘッダー連想配列に会員番号を入れてログインの準備をする
		creator.json.memberHeader.user_key.value = memberId;
		//会員の告知連想配列に会員番号を入れてログインの準備をする
		creator.json.advertise.user_key.value = memberId;
		//会員の予約中授業テーブル連想配列に会員番号を入れてログインの準備をする
		creator.json.reservedLessonTable.user_key.value = memberId;
		//会員の受講済み授業テーブル連想配列に会員番号を入れてログインの準備をする
		creator.json.finishedLessonTable.user_key.value = memberId;
		//会員番号をグローバルな連想配列に入れ、日ごと授業予約やキャンセルで渡せるようにする
		memberInfo = memberId;
		//会員ページを呼び出す
		callPage('memberPage.html')
}

/* 
 * 関数名:setPermitListFromToDate
 * 概要  :受講承認一覧の検索する日付の範囲をデフォルトでは月の初日から末日に設定する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function setPermitListFromToDate() {
	//今日の日付を取得する
	var today = new Date();
	//今月の初日オブジェクトを取得する
	var monthStartday = new Date(today.getFullYear(), today.getMonth(), 1);
	//今月の初日の日付を取得して、受講承認一覧のfromの部分で使う
	monthStartday = getDateFormatDB(monthStartday);
	//今月の末日オブジェクトを取得する
	var monthEndday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	//今月の末日の日付を取得して、受講承認一覧のtoの部分で使う
	monthEndday = getDateFormatDB(monthEndday);
	//受講承認一覧に今月の初日を入れて一覧テーブルを検索するようにする
	creator.json.lecturePermitListInfoTable.FromDate.value = monthStartday;
	//受講承認一覧に今月の末日を入れて一覧テーブルを検索するようにする
	creator.json.lecturePermitListInfoTable.toDate.value = monthEndday;
	//デフォルトの検索値を分かりやすくするためにfromテキストボックスに月の初日の値を入れる
	$('[name=fromSearach]').val(monthStartday);
	//デフォルトの検索値を分かりやすくするためにtoテキストボックスに月の末日の値を入れる
	$('[name=toSearach]').val(monthEndday);
}

/* 
 * 関数名:searchPermitListInfoTable
 * 概要  :受講承認一覧の検索機能を実装する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function searchPermitListInfoTable () {
	//受講承認の検索ボタンをクリックした時のイベント
	$('.permitListSearch .searchButton').click(function(){
		//検索初めの値を取得する
		var fromDate = $('[name=fromSearach]').val();
		//検索終わりの値を取得する
		var toDate = $('[name=toSearach]').val();
		//受講承認一覧の連想配列に検索初めの値を入れる
		creator.json.lecturePermitListInfoTable.FromDate.value = fromDate;
		//受講承認一覧の連想配列に検索終わりの値を入れる
		creator.json.lecturePermitListInfoTable.toDate.value = toDate;
		//テーブルを更新する
		tableReload('lecturePermitListInfoTable');
	});
}

/* 
 * 関数名:logoutMemberPage
 * 概要  :ログアウトボタンを押したときに会員ページからログアウトして通常ページに遷移する
 		:管理者ページからログインした時は管理者のtopページに遷移する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.15
 */
function logoutMemberPage() {
	//ログアウトボタンがクリックされた時に処理を行うイベントを登録する
	$(STR_BODY).on(CLICK, '.logoutLink', function(){
		//管理者としてログインしていたなら管理者ページに遷移する
		if (creator.json.adminHeader) {
			//管理者ページを呼び出し、続けて管理者としての処理をできるようにする
			callPage('adminPage.html');
		//管理者としてログインしていなければ通常ページのトップページに戻る
		} else {
			//通常ページを使いやすくするためにヘッダーを表示するようにする
			$('header').css('display', 'block');
			//通常ページに遷移する(creatorがリセットされる問題があるかも？)
			callPage('index.php');
		}
	});
}

/* 
 * 関数名:setTableRecordClass
 * 概要  :テーブルの最初の行を除くtrタグに対してクラス属性を付ける
 		これによってアコーディオン機能を実装するための行がどの行なのかを
 		識別できるようになる
 * 引数  :tableClassName: 行にクラス属性を付けたいテーブル名
 		:tableRecordClasssName: 行に新しくつけるクラス名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.16
 */
function setTableRecordClass(tableClassName, tableRecordClasssName) {
	//第一引数のテーブルの1行目を除くtrタグに対して第2引数の名前のクラス属性を付け、行に対する対象を当てやすくする
	$(DOT + tableClassName + TAG_TR).eq(0).siblings().addClass(tableRecordClasssName);
}

/* 
 * 関数名:insertTableRecord
 * 概要  :テーブルに行を追加する。
 		受講承認のアコーディオン機能実装のために新しく行を挿入するために使う。
 		挿入するdom要素は最初はtdの代わりにdivで構成されていないといけない
 * 引数  :tableRecordClasssName:行に新しくつけるクラス名
 		:addDomClassName:挿入するdom要素のクラス属性名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.16
 */
function insertTableRecord(tableRecordClasssName, addDomClassName) {
	//追加するDOMをとりあえずbodyに作る
	creator.outputTag(addDomClassName, addDomClassName, STR_BODY);
	//後でテーブルの中にdomを移動させるために追加するDOMの子要素を全て取得する
	var addDomChild = $(DOT + addDomClassName).html();
	//取得したDOMのうち、テーブルのセルに適応させるため「div」を「td」に置換する
	addDomChild = addDomChild.replace(/div/g, 'td');
	//とりあえず作っておいたdomをテーブルのtrの後に移動させる。
	$(DOT + tableRecordClasssName).after($(DOT + addDomClassName));
	//追加したDOMのタグをテーブルに適応させるためtrタグに変換する
	$(DOT + addDomClassName).replaceWith('<tr class="' + addDomClassName + '"></tr>');
	//移動させたdomに対して取得していたセルを入れていき、アコーディオン用のテーブル行を完成させる
	$(DOT + addDomClassName).html(addDomChild);
}

/* 
 * 関数名:getCommodityCostPrice
 * 概要  :受講承認テーブルで個数テキストボックスと備品代テキストボックスの値を掛け合わせた合計を返す
 		:会計テキストボックスの値を自動で変更するために値を取得するための関数
 * 引数  :rowNumber:行の何番目にあるテキストボックスが対象なのかを示す番号
 * 返却値  :commodityCostPrice:備品代の会計テキストボックスに入る値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function getCommodityCostPrice(rowNumber) {
	//備品代の合計を求めるために購入した備品の価格を取得する
	var sellingPrice = $('.sellingPriceTextbox').eq(rowNumber).val();
	//備品代の合計を求めるために購入した個数を取得する
	var sellNumber = $('.sellNumberTextbox').eq(rowNumber).val();
	//取得した値から備品の合計金額を求める
	var commodityCostPrice = sellingPrice * sellNumber;
	//求めた金額を他でも使えるようにするため、返り値として返す
	return commodityCostPrice;
}

/* 
 * 関数名:setDefaultCommodityCostPrice
 * 概要  :ページの初期読み込み時に会計のデフォルト値を設定する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultCommodityCostPrice() {
	//会計のデフォルト値を設定するために会計の値を取得する
	var commodityCostPrice = getCommodityCostPrice(0);
	//会計の連想配列にデフォルト値を設定する
	$('.payCashTextbox').val(commodityCostPrice);
}

/* 
 * 関数名:setCommodityCostPrice
 * 概要  :受講承認テーブル会計の値を設定する
 * 引数  :changeSelector:changeイベントを当てるセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setCommodityCostPrice(changeSelector) {
	//備品名、または個数が変化した時に会計の値をセットするイベントを登録する
	$(STR_BODY).on('change', changeSelector, function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(changeSelector).index(this);
		//会計のデフォルト値を設定するために会計の値を取得する
		var commodityCostPrice = getCommodityCostPrice(contentSelectNumber);
		//会計のテキストボックスの値を設定する
		$('.payCashTextbox').eq(contentSelectNumber).val(commodityCostPrice);
	});
}

/* 
 * 関数名:setSellingPrice
 * 概要  :受講承認テーブルの備品代を自動でセットする。
 		備品によって値段が異なるので備品名のセレクトボックスの値が変わったときに
 		備品名に対応した値段をテキストボックスに入れる
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setSellingPrice(selectboxParentSelector, textboxParentSelector) {
	//備品名セレクトボックスの値が変更されたときに備品代を変えるイベントを開始する
	//イベントをonで登録しているのは違うページを読み込むときにイベントをoffにしやすくするため
	$(STR_BODY).on('change', selectboxParentSelector + ' .contentSelect', function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(selectboxParentSelector + ' .contentSelect').index(this);
		//選択されているテキストを取得し、備品名を取り出すための値を取り出すために使う
		var contentName = $(selectboxParentSelector + ' .contentSelect').eq(contentSelectNumber).val();
		//備品代の値を取得するための変数を作る
		var sellingPrice;
		//備品idを取り出すための変数を作る
		var commodityKey;
		//取り出した行のデータを数えるためにカウンターを変数を作る
		var counter = 0;
		//行データを変数に入れる
		var rowData = creator.json.selectCommodityInf.table
		//取り出したデータの数だけループし、価格を取り出す
		$.each(rowData, function(){
			//取得した備品名と比較するためにループしている備品名を取得する
			var commodityName = rowData[counter].commodity_name;
			//取得した備品名とセレクトボックスの中にあるタグの名前が同じときにその番号を取得する
			if (contentName == commodityName) {
				//備品代をテキストボックスに入れるための番号を取得する
				sellingPrice = creator.json.selectCommodityInf.table[counter].selling_price;
				//備品idをテキストボックスに入れるための番号を取得する
				commodityKey = creator.json.selectCommodityInf.table[counter].commodity_key;
			}
			counter++;
		});
		//備品代テキストボックスに備品名に対応した値段を入れる
		$('.sellingPriceTextbox').eq(contentSelectNumber).val(sellingPrice);
		//備品idテキストボックスに備品名に対応した値段を入れる
		$(textboxParentSelector + ' .commodityKeyBox').eq(contentSelectNumber).val(commodityKey);
	});
}

/* 
 * 関数名:setDefaultSellingPrice
 * 概要  :受講承認テーブルの備品代をページ読み込み時に自動でセットする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultSellingPrice() {
	//備品代のデフォルト値を設定するために備品代の最初値を取得する
	var sellingPrice = creator.json.selectCommodityInf.table[0].selling_price;
	//備品代の連想配列にデフォルト値を設定する
	creator.json.accordionContent.sellingPrice.sellingPriceTextbox.value = sellingPrice;
	//備品代のid値を設定するために備品代idの最初値を取得する
	var commodityKey = creator.json.selectCommodityInf.table[0].commodity_key;
	//備品idの連想配列にデフォルト値を設定する
	creator.json.commodityKeyBox.value = commodityKey;
}

/* 
 * 関数名:getSendReplaceArray
 * 概要  :可変テーブルで取得した連想配列とユーザがテキストボックスで入力した値の連想配列を結合する。
 		:これによってdb_setQueryで値を置換するときの連想配列が取得できる
 * 引数  :tableClassName:可変テーブルクラス名
 		rowNumber:可変テーブルで取り出す行番号
 		inputDataSelector:ユーザが入力した値を取得するためにinputタグなどの親のセレクター名
 * 返却値  :sendReplaceArray:テーブルと入力データを結合した結果の連想配列
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function getSendReplaceArray(tableClassName, rowNumber, inputDataSelector) {
	//可変テーブルから連想配列を取得する
	var resultTableArray = creator.json[tableClassName].table[rowNumber]
	//ユーザが入力した値をDBのクエリに対応したkey名で連想配列で取得する
	var inputDataArray = getInputData(inputDataSelector);
	//取得した連想配列を結合する
	var sendReplaceArray = $.extend(true, {}, resultTableArray, inputDataArray);
	//結合した結果の連想配列を返す
	return sendReplaceArray;
}

/* 
 * 関数名:isBuyCommodity
 * 概要  :受講承認の承認ボタンがクリックされた時に備品を購入したかどうかを判定する
 * 引数  :sendReplaceArray
 * 返却値  :resultBool:判定結果
 * 作成者:T.Yamamoto
 * 作成日:2015.07.21
 */
function isBuyCommodity(sendReplaceArray) {
	//備品を購入していたらtrueにする
	var resultBool = true;
	//備品を購入していないときにfalseにする
	if(sendReplaceArray.pay_cash <= 1) {
		resultBool = false;
	}
	return resultBool
}

/* 
 * 関数名:choiceSendQueryArray
 * 概要  :JSONDBManagerに送信するためのjsonを分岐する
 		:受講一覧の承認ボタンで使うクエリが受講情報のクエリか備品情報のクエリかを振り分けるときに使う
 * 引数  :boolRule:分岐させるための値が入った変数
 		trueQuery:条件がtrueのときに取得するクエリ
 		falseQuery:条件がfalseのときに取得するクエリ
 * 返却値  :resultSendQuery:選択した結果のクエリが入った連想配列
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function choiceSendQueryArray(boolRule, trueQueryArray, falseQueryArray) {
	//送信するクエリを入れるための変数を作る
	var resultSendQueryArray = {};
	//条件分岐を設定するための値があるかどうかでクエリを決める
	if (boolRule) {
		//trueだった時のクエリを取得する
		resultSendQueryArray = creator.json[trueQueryArray];
	//条件が合わなかったときに別のクエリを入れる
	} else {
		//falseのときのクエリを取得する
		resultSendQueryArray = creator.json[falseQueryArray];
	}
	//取得したクエリの結果を返す
	return resultSendQueryArray;
}

/* 
 * 関数名:addUsePointQuery
 * 概要  :既にあるクエリに対して、クエリを付け足す。
 		受講承認でユーザがポイントを使用したときにポイントしようクエリを付け足す
 * 引数  :sendQueryArray:jsondbManagerに渡すためのクエリが入った連想配列
 		sendReplaceArray:DBに更新で渡す値が入った連想配列
 * 返却値  :resultSendQueryArray
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function addUsePointQuery(sendQueryArray, sendReplaceArray) {
	//置換するクエリに使用ポイントの値が1以上のとき、ポイントを使うということなのでクエリにポイントしようクエリを付け足す
	if (sendReplaceArray.use_point >= 1) {
		//現状のクエリに使用ポイントのクエリを付け足す
		sendQueryArray.db_setQuery += creator.json.updateUsePoint.db_setQuery;
	}
	//クエリの結果を返す
	return sendQueryArray;
}

/* 
 * 関数名:executeDBUpdate
 * 概要  :置換連想配列とクエリ連想配列を取得し、jsonDBManagerを使ってデータベースを更新する
 * 引数  :counter:カウンタ変数
 		tableClassName:テーブルのクラス名
 		inputDataSelector:テキストボックスなど値の親のセレクター名
 		boolRule:条件分岐するための正否判定
 		trueQueryArray:条件が正の時に代入するクエリが入った連想配列
 		falseQueryArray:条件が否の時に代入するクエリが入った連想配列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function executeDBUpdate(counter, tableClassName, inputDataSelector, boolRule, trueQueryArray, falseQueryArray) {
	//jsonDBManagerに送信する置換の値が入った連想配列を作る(対象のテーブルの連想配列とテキストボックスなどの入力された連想配列を結合して取得する)
	var sendReplaceArray = getSendReplaceArray(tableClassName, counter, inputDataSelector);
	//jsonDBManagerに送信するクエリの入った連想配列を作る(受講料の値があるかどうかで受講料のクエリと備品のクエリのどちらを実行するか分岐する)
	var sendQueryArray = choiceSendQueryArray(boolRule, trueQueryArray, falseQueryArray);
	//ユーザがポイントを使用したときにポイント使用のクエリを追加する
	sendQueryArray = addUsePointQuery(sendQueryArray, sendReplaceArray);
	//クエリを実行してテーブルの値1行ずつ更新していく
	setDBdata(sendQueryArray, sendReplaceArray, '');
	//ループで実行するので置換データ連想配列を初期化する
	sendReplaceArray = {};
	//ループで実行するので置換データ連想配列を初期化する
	sendQueryArray = {};
}

/* 
 * 関数名:loopUpdatePermitLesson
 * 概要  :受講承認テーブルの承認ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新してする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLesson() {
	//受講承認の承認ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '.doLecturePermit .normalButton', function(){
		//受講承認テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitAccordion').each(function() {
			//チェックボックスにチェックが入っているものだけを更新するように条件設定する
			if($('.permitCheckbox').eq(counter+1).prop('checked')) {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = getSendReplaceArray('doLecturePermitInfoTable', counter, 'accordionContent:eq(' + counter + ')');
				//加算ポイントレートを取得する
				var lessonPlusPointRate = getUserPlusPointRate('lecturePermitPlusPointRate', sendReplaceArray.students, sendReplaceArray.lesson_key);
				//受講料から加算ポイントを求める
				sendReplaceArray['lessonPlusPoint'] = getUserPlusPoint(sendReplaceArray['user_classwork_cost'], lessonPlusPointRate);
				//備品代から加算ポイントを求める
				sendReplaceArray['commodityPlusPoint'] = getCommodityPlusPoint('commodityPlusPoint', sendReplaceArray)
				//DBを更新するためのクエリが入った連想配列を取得して更新の準備をする
				var sendQueryArray = choiceSendQueryArray(isBuyCommodity(sendReplaceArray), 'permitLessonContainCommodity', 'permitLessonUpdate');
				//ユーザがポイントを使用したときにポイント使用のクエリを追加する
				sendQueryArray = addUsePointQuery(sendQueryArray, sendReplaceArray);
				//クエリを実行してテーブルの値1行ずつ更新していく
				setDBdata(sendQueryArray, sendReplaceArray, '');
				//ループで実行するので置換データ連想配列を初期化する
				sendReplaceArray = {};
				//ループで実行するので置換データ連想配列を初期化する
				sendQueryArray = {};
			}
			//カウンターをインクリメントする
			counter++;
		});
	});
}

/* 
 * 関数名:loopUpdatePermitLessonList
 * 概要  :受講承認一覧テーブルの更新ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLessonList() {
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '.lecturePermitList .normalButton', function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitListRecord').each(function() {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = getSendReplaceArray('lecturePermitListInfoTable', counter, 'lecturePermitListRecord:eq(' + counter + ')');
				//DBを更新するためのクエリを設定する。行の情報にセレクトボックスがあるなら備品情報更新クエリ、ないなら授業情報更新クエリを設定する
				var sendQueryArray = choiceSendQueryArray(sendReplaceArray.lesson_name == "", 'updatePermitListCommoditySell', 'updatePermitListLesson');
				//ユーザがポイントを使用したときにポイント使用のクエリを追加する
				sendQueryArray = addUsePointQuery(sendQueryArray, sendReplaceArray);
				//クエリを実行してテーブルの値1行ずつ更新していく
				setDBdata(sendQueryArray, sendReplaceArray, '');
				//ループで実行するので置換データ連想配列を初期化する
				sendReplaceArray = {};
				//ループで実行するので置換データ連想配列を初期化する
				sendQueryArray = {};
			//カウンターをインクリメントする
			counter++;
		});
	});
}

/* 
 * 関数名:createMemberPageHeader()
 * 概要  :会員ページからブログページやギャラリーページに遷移するときに通常ページのヘッダーでなく会員ページのヘッダーを表示する。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function createMemberPageHeader() {
	//会員ページヘッダーのjsonがあるときに会員ページのヘッダーを作る
	if(creator.json.memberHeader) {
		// パーツのテンプレートのDOMを取得する。
		creator.getDomFile('template/memberCommon.html');
		//ユーザ情報のテキストをDBから取得する
		creator.getJsonFile('php/GetJSONString.php', creator.json['memberHeader'], 'memberHeader');
		// 会員ページヘッダーを作る
		creator.outputTag('memberHeader');
		// バナー領域を作る
		creator.outputTag('userBanner');
	}
}

/* 
 * 関数名:createMemberFinishedLessonContent
 * 概要  :会員ページの受講済み授業タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createMemberFinishedLessonContent() {
	//受講済み授業の絞り込み領域を作る
	creator.outputTag('selectTheme', 'selectTheme', '#finishedLesson');

	//受講済みテーブルページングの一番外側となる領域を作る
	creator.outputTag('finishedLessonPagingArea', 'divArea', '#finishedLesson');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('finishedLessonTableOutside', 'divArea', '.finishedLessonPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter','numberingOuter','.finishedLessonPagingArea');
	//メルマガのデータを取り出す
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json['finishedLessonTable'], 'finishedLessonTable');
	//ページング機能付きで受講済み授業テーブルを作る
	creator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	//予約中テーブルのテーブルの値をしかるべき値にする
	lessonTableValueInput('.finishedLessonTable', creator.json.finishedLessonTable.table, 'callMemberLessonValue');
	//セレクトボックスのvalueを画面に表示されている値にする
	setSelectboxValue('.selectThemebox');
	//テーマ絞り込みボタンがクリックされたときに受講済みテーブルを作り直す
	finshedLessonTableThemeSelect();
}

/* 
 * 関数名:createAdminPermitLessonContent
 * 概要  :管理者ページの受講承認タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonContent() {
	//受講承認タブのコンテンツ
	//タブ
	creator.outputTag('lecturePermitTab', 'tabContainer', '#lecturePermit' );
	//受講承認タブ
	creator.outputTag('doLecturePermit','tabInContent', '.lecturePermitTab');
	//受講承認一覧タブ
	creator.outputTag('lecturePermitList','tabInContent', '.lecturePermitTab');

	// 受講承認テーブル用のJSON配列を取得する
	creator.getJsonFile('php/GetJSONArray.php', creator.json['doLecturePermitInfoTable'], 'doLecturePermitInfoTable');
	//受講承認タブのリストテーブル
	creator.outputTagTable('doLecturePermitInfoTable', 'doLecturePermitInfoTable', '#doLecturePermit');
	//受講承認のボタン
	creator.outputTag('doLecturePermitButton', 'normalButton', '#doLecturePermit');
	//アコーディオンのセレクトボックスにいれるため受講承認の備品名JSON配列を取得する
	creator.getJsonFile('php/GetJSONArray.php', creator.json['selectCommodityInf'], 'selectCommodityInf');
	//タブを作る
	createTab('.lecturePermitTab');

	//受講承認のテーブルにチェックボックスを追加する
	addCheckbox('permitCheckboxArea', 'permitCheckbox');
	//受講承認に連番を入れる
	lessonTableValueInput('.doLecturePermitInfoTable', creator.json.doLecturePermitInfoTable.table, 'callLecturePermitValue');

	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	setSelectboxText(creator.json.selectCommodityInf.table, creator.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	//備品代の連想配列にDBから取り出した最初の値をデフォルトで入れる
	setDefaultSellingPrice();
	//受講承認テーブルでアコーディオン機能を実装するために可変テーブルの行にクラス属性を付ける
	setTableRecordClass('doLecturePermitInfoTable', 'lecturePermitAccordion');
	//受講承認テーブルのアコーディオン機能の中身の行をテーブルに挿入する
	insertTableRecord('lecturePermitAccordion', 'accordionContent');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	creator.outputTag('commodityKeyBox','commodityKeyBox', '.accordionContent');
	//受講承認テーブルのアコーディオン機能の概要の行をテーブルに挿入する
	insertTableRecord('lecturePermitAccordion', 'accordionSummary');
	//受講承認テーブルがクリックされた時にアコーディオン機能を実装する
	accordionSettingToTable('.lecturePermitAccordion', '.accordionSummary');
	accordionSettingToTable('.lecturePermitAccordion', '.accordionContent');
	//受講承認テーブルのチェックボックスですべてのチェックボックスにチェックを入れる関数を実行する
	allCheckbox('.permitCheckbox:eq(0)', '.permitCheckbox');
	//受講承認の備品名セレクトボックスにvalueを入れる
	setSelectboxValue('.contentSelect');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.contentCell', '.accordionContent');
	//受講承認テーブルアコーディオンの会計のテキストボックスにデフォルト値を設定する
	setDefaultCommodityCostPrice();
	//受講承認テーブルの会計列を備品名が変化した時に自動でセットする
	setCommodityCostPrice('.contentSelect');
	//受講承認テーブルの会計列を個数が変化した時に自動でセットする
	setCommodityCostPrice('.sellNumberTextbox');
	//受講承認一覧タブをクリックしたときに受講承認一覧の内容を表示する
	createContentTriggerClick('.tabLink[href="#lecturePermitList"]', createAdminPermitLessonListContent);
	//承認ボタンクリックでデータを更新する
	loopUpdatePermitLesson();
}

/* 
 * 関数名:createAdminPermitLessonListContent
 * 概要  :管理者ページの受講承認一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonListContent() {
	//受講承認一覧の検索領域を作る
	creator.outputTag('permitListSearch', 'permitListSearch', '#lecturePermitList');
	//受講承認一覧で今月の初日から末日を検索するのをデフォルトにする
	setPermitListFromToDate();
	//受講承認一覧テーブルを作る
	tableReload('lecturePermitListInfoTable')
	//受講承認一覧のリスト更新ボタン
	creator.outputTag('lecturePermitListUpdateButton', 'normalButton', '#lecturePermitList');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('fromSearach');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('toSearach');
	//受講承認一覧の検索機能を実装する
	searchPermitListInfoTable();
	//受講承認一覧の備品名にセレクトボックスの値をDBから取り出した値で追加する
	setSelectboxText(creator.json.selectCommodityInf.table, creator.json.contentSelect.contentOption, 'commodity_name');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.lecturePermitListRecord', '.lecturePermitListRecord');
	//更新ボタンがクリックされたときにデータを更新するイベントを登録する
	loopUpdatePermitLessonList();
}

/* 
 * 関数名:createAdminUserListContent
 * 概要  :管理者ページのユーザ一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminUserListContent() {
	// creator.getJsonFile('php/GetJSONArray.php', creator.json['userListInfoTable'], 'userListInfoTable');
	// ユーザ検索テキストボックス
	creator.outputTag('searchUserList', 'searchUserList', '#userList');
	//ユーザ一覧ページングの一番外側となる領域を作る
	creator.outputTag('userListPagingArea', 'divArea', '#userList');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('userListTableOutside', 'divArea', '.userListPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter','numberingOuter','.userListPagingArea');
	//会員一覧のデータを取り出す
	creator.getJsonFile('php/GetJSONArray.php', creator.json['userListInfoTable'], 'userListInfoTable');
	//ページング機能付きでユーザ情報一覧テーブルを作る
	creator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside');
	//会員一覧タブのボタン群れ
	creator.outputTag('userListButtons', 'userListButtons', '#userList');
	//会員一覧タブのユーザ検索機能を実装する
	// reloadTableTriggerEvent('.searchUserButton', CLICK, 'userListInfoTable', 'searchUserList');
	//会員一覧の検索の中にあるテキストボックスにフォーカスしているときにエンターキー押下で検索ボタンを自動でクリックする
	enterKeyButtonClick('.adminUserSearch', '.searchUserButton');
	//会員になり替わってログインするために、ユーザ一覧テーブルの会員の行をクリックしたときにクリックした会員で会員ページにログインする
	//loginInsteadOfMember('#userList', '.userListInfoTable tr');
	//会員一覧テーブルがクリックされた時にuserSelectクラスをがなければ追加しあるなら消去する
	$(STR_BODY).on(CLICK, '.userListInfoTable tr', function(){
		//userSelectクラスを追加したり消したりする。このクラスがあればユーザが選択されているとみなしてボタン処理を行うことができる
		$(this).toggleClass('selectRecord');
	});
	//検索ボタンをクリックしたときにテーブルの内容を更新する
	$(STR_BODY).on(CLICK, '.searchUserButton', function() {
		//ページングを作り直すためにページングの設定をリセットする
		pagingReset('userListInfoTable');
		//クエリを変数に入れてクエリ発行の準備をする
		var sendQuery = {db_getQuery:new adminUserSearcher().execute()}
		//クエリのデフォルトを取得する
		var defaultQuery = creator.json.userListInfoTable.db_getQuery;
		//会員一覧のデータを取り出す
		creator.getJsonFile('php/GetJSONArray.php', sendQuery, 'userListInfoTable');
		//クエリをデフォルトに戻す
		creator.json.userListInfoTable.db_getQuery = defaultQuery;
		//取得した値が0の時のテーブルを作らない
		if(creator.json.userListInfoTable.table.length != 0) {
			//ページング機能付きでユーザ情報一覧テーブルを作る
			creator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside');
		}
	});

	//詳細設定ボタンがクリックされたときになり代わりログインを行うかアラートを表示するかのイベントを登録する
	$(STR_BODY).on(CLICK, '.userDetail', function(){
		//選択されているユーザの数を変数に入れ、なり代わりログインで選択されている人が1人であるかを判定するのに使う
		var selected = $('.selectRecord').length;
		//詳細設定ボタンがクリックされた時に選択されている会員の人数が一人の時だけなりかわりログイン処理を行うイベントを登録する
		if(selected == 0 || selected > 1) {
			//選択している
			alert('ユーザを1人だけ選択してください');
		} else {
			//クリックした人でログインするために会員番号を取得する
			var memberId = $('.selectRecord').children('.id').text();
			//クリックした人でなり代わりログインを行う
			loginInsteadOfMember(memberId);
		}
	});
	
	// メール送信ボタンのクリック
	var doSendMail = function(){
		// TODO 個々にメール送信処理をたす
		alert("送信したつもり");
	};
	$(".createMail").click(function(e) {
		var sd = new SimpleConfirmDialog(
				doSendMail
				,"メールを送信します。よろしいですか?"
		);
		sd._showDialog();
	});
}

/* 
 * 関数名:createAdminLessonDetailContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminLessonDetailContent() {
	//授業詳細タブ内にカレンダ-作る
	creator.outputTag('adminCalendar', 'adminCalendar', '#lessonDetail');
	// 講座のカレンダーを作り、クリックでダイアログ作成を作る
	var lessonCalendar = new adminCalendar('.adminCalendar');
	lessonCalendar.create();	//カレンダーを実際に作成する
}

/* 
 * 関数名:createAdminMailMagaAnnounceContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminMailMagaAnnounceContent() {
	//メルマガ＆アナウンスタブのコンテンツ
	//過去のメルマガを検索するための領域を作る
	creator.outputTag('mailMagaSearchArea', 'mailMagaSearchArea', '#mailMagaAndAnnounce');
	//メルマガページングの一番外側となる領域を作る
	creator.outputTag('mailMagaPagingArea', 'divArea', '#mailMagaAndAnnounce');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('mailMagaTableOutside', 'divArea', '.mailMagaPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter','numberingOuter','.mailMagaPagingArea');
	//メルマガのデータを取り出す
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json['mailMagaTable'], 'mailMagaTable');
	//ページング機能付きでメルマガテーブルを作る
	creator.outputNumberingTag('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside');


	//メルマガテーブルに検索機能を対応させる
//	replaceTableTriggerClick('mailMagaSearchArea', 'mailMagaTable');
	//メルマガ検索ボタンがクリックされた時に検索機能を行うイベントを開始する
	$(STR_BODY).on(CLICK, '.mailMagaSearchButton', function() {
		//クエリのデフォルトを取得し、編集した後でも戻せるようにする
		var queryDefault = creator.json.mailMagaTable.db_getQuery;
		//クエリの文字列の長さを取得してORDER以降の文字列の取得に使う
		var queryStringLength = creator.json.mailMagaTable.db_getQuery.length;
		//ORDER BY以降の文字列を取得するため、ORDER 以降の文字列を取得する
		var cutString = creator.json.mailMagaTable.db_getQuery.substring(creator.json.mailMagaTable.db_getQuery.indexOf("ORDER"),queryStringLength);
		//現在のクエリからORDER BYを取り除き、検索の条件を入れることができるようにする
		creator.json.mailMagaTable.db_getQuery = creator.json.mailMagaTable.db_getQuery.substring(0,creator.json.mailMagaTable.db_getQuery.indexOf("ORDER"));
		//検索の条件をクエリに入れる
		addQueryExtractionCondition('mailMagaSearchArea', 'mailMagaTable');
		//クエリに切り取ったORDER BYを付け足す
		creator.json.mailMagaTable.db_getQuery += cutString;
		//テーブルをリロードする
		tableReload('mailMagaTable');
		//クエリをデフォルトに戻す
		creator.json.mailMagaTable.db_getQuery = queryDefault;
	});

	//クリック対象となっているメルマガテーブルの行をクリックしたときにタイトルや内容を自動でセットするイベントを登録する
	$('.mailMagaAndAnnounce').on(CLICK, '.targetMailMagazine', function() {
		//クリックされたのが何番目の行であるかを取得し、メルマガのタイトルや内容を取り出すのに使う
		var targetNumber = $('.targetMailMagazine').index(this);
		//取得した番号をもとにメルマガのタイトルや内容などの情報を取得し、連想配列に入れる
		var targetInf = creator.json.mailMagaTable.table[targetNumber];
		//取得した連想配列をテキストボックスにセットする
		setValueDBdata(targetInf, '.mailMagaAndAnnounceArea', 'keyTable');
	});

	// //メルマガの情報テーブルを取得するためのjsonをDBから取得する
	// creator.getJsonFile('php/GetJSONArray.php', creator.json['mailMagaTable'], 'mailMagaTable');
	// //メルマガテーブルを作る
	// creator.outputTagTable('mailMagaTable', 'mailMagaTable', '#mailMagaAndAnnounce');
	//メルマガ・アナウンス入力領域を作る
	creator.outputTag('mailMagaAndAnnounceArea', 'mailMagaAndAnnounceArea', '#mailMagaAndAnnounce');

	//送信ボタンがクリックされたときにメール送信イベントを開始する
	$(STR_BODY).on(CLICK, '.messageButtonArea .sendButton', function() {
		var doSend = function() {
			//メルマガ送信にチェックが入っていたらメルマガを送信する
			if($('[name="messegeType"]').val() == "0") {
				//メルマガを送信するための値をテキストボックスから取得する
				var sendData = getInputData('mailMagaAndAnnounceArea');
				//メルマガをDBに新規登録する
				setDBdata(creator.json.insertMailMagazine, sendData, '');
				// メルマガ送信処理
				sendMailmagazine(sendData['magazine_title'],sendData['magazine_content']);
			}
		};
		var sd = new SimpleConfirmDialog(
				doSend,
				"メルマガの送信を行います。よろしいですか?"
		);
		sd._showDialog();
	});

	//削除ボタンがクリックされたとき、テキストボックスの中身も空白にする
	$(STR_BODY).on(CLICK, ".messageButtonArea .deleteButton", function(){
		//メッセージ内容テキストエリアの中身を空にする
		$('.mailMagaAndAnnounceArea textarea').text('');
	});

	//メルマガ検索領域の内容テキストボックスでエンターキーを押すと検索のイベントを開始する
	enterKeyButtonClick('.mailMagaContentSearchTextbox', '.mailMagaSearchButton');
}

/* 
 * 関数名:cutString
 * 概要  :すでに画面に表示されている文字を指定文字数で切り取る。
 * 引数  :cutTargetSelector:文字を切り取る対象となる文字列を持ったセレクター名
 		cutCount:何文字以上であるなら文字に対して切り取りを行うかの設定の数字
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function cutString(cutTargetSelector, cutCount) {
	//文字数カット対象となるセレクター、メルマガの内容列
	var $setElm = $(cutTargetSelector);
	// カットする文字数
	var cutFigure = cutCount;
	// 文字カット後に表示するテキスト
	var afterTxt = ' …';

	//ループですべてのメルマガ内容列について処理をする
	$setElm.each(function(){
		//対象の列の文字数を取得してカットする文字数と比較するのに使う
		var textLength = $(this).text().length;
		//カットした後の文字列を取得する
		var textTrim = $(this).text().substr(0,(cutFigure))
		//対象の列の文字数がカットする文字数より多い時に文字をカットする
		if(cutFigure < textLength) {
			//対象の列に対して文字をカットして表示する
			$(this).html(textTrim + afterTxt).css({visibility:'visible'});
		//対象の列がカットする文字数より少なかった場合、カットはせずにそのまま表示する
		} else if(cutFigure >= textLength) {
			//そのまま表示するように設定する
			$(this).css({visibility:'visible'});
		}
	});
}

/* 
 * 関数名:sendMail
 * 概要  :mailSend.phpにデータを渡してメールの送信処理を行う
 * 引数  :object mailInfoArray:送信先アドレスなどの情報が入った連想配列
 		string mailSubject:送信メールのタイトル文字列
 		string mailContent:送信メール内容
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function sendMail(mailInfoArray, mailSubject, mailContent) {
		//Ajax通信を行う
}
function sendSuggest(from, type, mailSubject, mailContent) {
	
	var resulwork = null;
	
	$.ajax({
		url:'php/mailSendEntrySuggest.php'
		,data:{
				from:from
				,type:type
				,subject:mailSubject
				,content:mailContent
		}
		,dataType:"json"
		,type:"POST"
		,success:function(result){
			resulwork = result;
		}
		,error:function(xhr, status, error){
			throw new Error(status + ":" + MESSAGE_FAILED_CONNECT);
		}
	});
	
	// @TODO 結果をどうしいのかはまだ未定
	//return resulwork
}

function sendMemberMail(from, mailSubject, mailContent) {
	
	var resulwork = null;
	
	$.ajax({
		url:'php/mailSendEntryMemberMail.php'
		,data:{
				from:from
				,subject:mailSubject
				,content:mailContent
		}
		,dataType:"json"
		,type:"POST"
		,success:function(result){
			resulwork = result;
		}
		,error:function(xhr, status, error){
			throw new (status + ":" + MESSAGE_FAILED_CONNECT);
		}
	});
	
	// @TODO 結果をどうしいのかはまだ未定
	//return resulwork
}

function sendMailmagazine(mailSubject, mailContent) {
	
	var resulwork = null;
}
/* 
 * 関数名:sendMail
 * 概要  :mailSend.phpにデータを渡してメールの送信処理を行う
 * 引数  :object mailInfoArray:送信先アドレスなどの情報が入った連想配列
 		string mailSubject:送信メールのタイトル文字列
 		string mailContent:送信メール内容
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function sendMail(mailInfoArray, mailSubject, mailContent) {
	//Ajax通信を行う
	$.ajax({
		url:'php/mailSendEntryMagazine.php'
		,data:{
				subject:mailSubject
				,content:mailContent
		}
		,dataType:"json"
		,type:"POST"
		,success:function(result){
			resulwork = result;
		}
		,error:function(xhr, status, error){
			throw new (status + ":" + MESSAGE_FAILED_CONNECT);
		}
	});
	// @TODO 結果をどうしいのかはまだ未定
	//return resulwork
}

/* 
 * 関数名:afterReloadReservedLessonTable
 * 概要  :予約中授業がリロードした後に行う関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.23
 */
function afterReloadReservedLessonTable() {
	//予約中授業テーブルのクリック範囲レコードにクラス属性を付ける
	setTableRecordClass('reservedLessonTable', 'targetCancelReservedLesson'); 
}

/* 
 * 関数名:afterReloadPermitListInfoTable
 * 概要  :受講承認一覧がリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.23
 */
function afterReloadPermitListInfoTable() {
	//受講承認一覧テーブルの取り出した行にクラス名を付ける
	setTableRecordClass('lecturePermitListInfoTable', 'lecturePermitListRecord');

	//受講承認一覧テーブルの列内を編集する
	lessonTableValueInput('.lecturePermitListInfoTable', creator.json.lecturePermitListInfoTable.table, 'callPermitLessonListValue');
	//受講承認一覧テーブルの料金列をテキストボックスにする
	insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxCost', 'replaceTextboxCostCell');
	//受講承認一覧テーブルの使用pt列をテキストボックスにする
	insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxUsePoint', 'replaceTextboxUsePointCell');
	//セレクトボックスを列にアウトプットする
	creator.outputTag('contentSelect', 'contentSelect', '.appendSelectbox');
	//セレクトボックスのvalueを画面に表示されている値にする
	setSelectboxValue('.contentSelect');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	creator.outputTag('commodityKeyBox','commodityKeyBox', '.appendSelectbox');
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	setTableTextboxValuefromDB(creator.json['lecturePermitListInfoTable']['table'], setInputValueToLecturePermitListInfoTable);
}

/* 
 * 関数名:afterReloadMailMagaTable
 * 概要  :メルマガテーブルがリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function afterReloadMailMagaTable() {
	//メルマガの内容列に対して150文字以上の内容は画面には表示しないようにする。テキストボックスにはすべての値が反映される
	cutString('.mailMagaContent', '150');
	//メルマガテーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	setTableRecordClass('mailMagaTable', 'targetMailMagazine');
}

/* 
 * 関数名:createContentTriggerClick
 * 概要  :管理者ページでタブがクリックされたときにコンテンツを呼び出すための関数。
 * 引数  :clickSelector:クリックされたときにイベントを開始する対象のセレクター名
 		callContentFunc:タブがクリックされたときにcreateTagによって要素を作るための関数をコールするための関数名
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createContentTriggerClick(clickSelector, callContentFunc) {
	//イベントを重複して登録しないためにイベントフラグ属性を作る
	$(clickSelector).attr('data-eventFlag', 0);
	//対象の要素がクリックされたらcreateTagによって要素を作る関数をコールする
	$(clickSelector).on(CLICK, function(){
		//イベントフラグが初期状態のときのみ関数を実行するようにして重複した実行を行わないようにする
		if ($(clickSelector).attr('data-eventFlag') == 0) {
			//関数をコールしてdom要素を作る
			callContentFunc();
			// ボタンの見た目をjqueryuiのものにしてデザインを整える
			$('button, .searchButton, input[type="button"],[type="reset"]').button();
			//イベントフラグ属性を変更することで重複してdomを作る処理をなくす
			$(clickSelector).attr('data-eventFlag', 1);
		}
	});
}

/* 
 * 関数名:setBlogUpdateQueryReplace
 * 概要  :ブログを更新するための置換の値をjsonに入れる
 * 引数  :getContentKey:ブログのデータを取得するための連想配列key名
 		:userKeyParrentKey:会員番号が入っている親のkey名
 		:updateQueryKey:テキストボックスの親のセレクター。クエリを置換するために使う
 		:number:更新記事対象のidの値
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.27
 */
function setBlogUpdateQueryReplace(getContentKey, userKeyParrentKey, updateQueryKey, number) {
	//DBから編集する対象となるブログ記事のデータを取得するために会員番号をセットする
	creator.json[getContentKey].user_key.value = creator.json[userKeyParrentKey].user_key.value;
	//DBから編集する対象となるブログ記事のデータを取得するため記事番号をセットする
	creator.json[getContentKey].id.value = number;
	//DBからブログ記事を読み込む
	creator.getJsonFile('php/GetJSONString.php', creator.json[getContentKey], getContentKey);
	//ブログタイトルテキストボックスにDBから読込んだデータを入れる
	$('[name=blogTitle]').val(creator.json[getContentKey].title.text);
	//ブログ内容テキストエリアにDBから読込んだデータを入れる
	$('[name="blogContent"]').text(creator.json[getContentKey].content.text);
	//クエリを更新するのか新規登録をするのかを決めるために更新クエリのjsonに値を入れて更新クエリを使うようにする
	creator.json[updateQueryKey].id.value = number;
}

/* 
 * 関数名:deleteBlogArticle
 * 概要  :ブログの記事を削除する
 * 引数  :deleteQueryKey:ブログのデータを削除するためのクエリが入った連想配列key名
 		:deleteArticleNumberArray:ブログデータ記事削除のための番号が入った配列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.27
 */
function deleteBlogArticle(deleteQueryKey, deleteArticleNumberArray) {
	//記事を削除する個数をカウントし、ループさせる回数として使う
	var deleteRoopCount = deleteArticleNumberArray.length;
	//ループで記事削除処理を行う
	for(var roopStartCount = 0; roopStartCount < deleteRoopCount; roopStartCount++) {
		//削除するid番号を取得して削除するレコードを識別する
		var deleteRowId = deleteArticleNumberArray[roopStartCount];
		//削除クエリを実行するために削除対象記事の連想配列を作る
		var sendReplaceArray = {id:{value:deleteRowId}};
		//記事を削除しDBを更新する
		setDBdata(creator.json[deleteQueryKey], sendReplaceArray, '');
	}
}

/* 
 * 関数名:getUserPlusPointRate
 * 概要  :管理者　受講承認画面でユーザが加算するポイントを取得する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function getUserPlusPointRate(plusPointQueryKey, lessonStudents, lessonKey) {
	//レッスンの加算ポイントを取得するために加算ポイント取得クエリの置換する値となるlesson_keyの値を入れる
	creator.json[plusPointQueryKey].lesson_key.value = lessonKey;
	//受講ポイントの一覧を取得しどのポイントがユーザに加算されるポイント化を取得する
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json[plusPointQueryKey], plusPointQueryKey);
	//加算ポイントについてループして値を走査するためにループの値を取得する
	var loopMaxCount = creator.json[plusPointQueryKey].table.length;
	//加算ポイントのレートを返すための変数を作る
	var userPlusPointRate;
	//ループでポイントのレートを求める
	for(var loopCount=0; loopCount<loopMaxCount; loopCount++) {
		//テーブルの生徒の数を取得して加算ポイントレートを求めるために使う
		var studentsCount = creator.json[plusPointQueryKey].table[loopCount].students;
		//受講した生徒の数が加算ポイント以下であるとき、加算ポイントのレートを決める
		if (lessonStudents < studentsCount || lessonStudents == studentsCount || loopCount == (loopMaxCount-1)) {
			//加算ポイントのレートを決定しループを終わらせる
			userPlusPointRate = creator.json[plusPointQueryKey].table[loopCount].point_rate;
			break;
		}
	}
	return userPlusPointRate;
}

/* 
 * 関数名:getUserPlusPoint
 * 概要  :ユーザが加算するポイントを求める
 * 引数  :cost 		:加算ポイントを指定するための授業料や備品代の値
 		:pointRate 	: 加算ポイントのレート
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function getUserPlusPoint(cost, pointRate) {
	//加算ポイントを計算式で求める(授業料×レート÷100を小数点切り捨て)
	var userPlusPoint = Math.ceil(Number(cost) * pointRate / 100);
	//加算ポイントを返す
	return userPlusPoint;
}

/* 
 * 関数名:getCommodityPlusPoint
 * 概要  :管理者　受講承認画面でユーザが加算するポイントを取得する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function getCommodityPlusPoint(plusPointQueryKey, sendReplaceArray) {
	//DBからデータを取得するために備品のidを連想配列に入れてデータ取得のための準備をする
	creator.json[plusPointQueryKey].commodity_key.value = sendReplaceArray['commodity_key'];
	//備品の加算ポイントレートを取得するためにDBからデータを取得する
	creator.getJsonFile(URL_GET_JSON_STRING_PHP, creator.json[plusPointQueryKey], plusPointQueryKey);
	//備品の加算ポイントレートを変数に入れる
	var commodityPlusPointRate = creator.json[plusPointQueryKey].get_point.text;
	//加算ポイントを求める
	var plusPoint = getUserPlusPoint(sendReplaceArray['pay_cash'], commodityPlusPointRate);
	//加算ポイントを返す
	return plusPoint;
}

/* 
 * 関数名:deleteMyGalleryPhoto
 * 概要  :会員マイギャラリー画面でチェックボックスにチェックが入っているコンテンツを削除する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function deleteMyGalleryPhoto() {
	$(STR_BODY).on(CLICK, '.myGalleryEditButtons .deleteButton', function() {
		//チェックが入っているコンテンツの数を取得し、削除するコンテンツがあるかどうかやループの回数として使う
		var checkContentCount = $('.myPhotoCheck:checked').length;
		//チェックが入っている値が0であるならアラートを出して削除処理を行わない
		if(checkContentCount == 0) {
			//アラートでメッセージをだす
			alert('画像を1つ以上選択してください');
		} else {
			if(confirm('選択した写真を削除しますか')) {
				//ループで画像を削除する処理を開始する
				for(var loopCount=0; loopCount<checkContentCount; loopCount++) {
					//削除するのがどのコンテンツなのかの番号を取得する
					var deleteContentNumber = $('.myPhotoCheck:checked').eq(loopCount).parent().index('.myPhoto');
					//削除対象要素のid列の値を取得し、DBの値を削除できるようにする
					//var deleteId =  $('ここにid列のセレクタ').eq(deleteParentNumber).text();
					//クエリに渡すために取得した値を連想配列に入れる
					//var sendReplaceArray = {id:{value:deleteId}};
					//dbを更新する関数を走らせてDBデータを更新する
					//setDBdata(creator.json[ここにクエリのkey名],sendReplaceArray, '');
					//削除対象のコンテンツをクライアントから削除する
					$('.myPhoto').eq(deleteContentNumber).remove();
					// console.log(deleteContentNumber);
				}
			}
		}
	});
}

/* 
 * 関数名:updateMyGalleryPhotoData
 * 概要  :会員マイギャラリー画面でチェックボックスにチェックが入っているコンテンツのデータを更新する
 * 引数  :plusPointQueryKey	:加算ポイントを発行するためのクエリが入ったkey
 		:lessonStudents		:授業に出席した生徒様の人数
 		:lessonKey			:授業のテーマを表すためのテーマの値(DBのlesson_infテーブルのlesson_key列の値)
 * 返却値  :userPlusPointRate 	:ユーザにプラスポイントの数
 * 作成者:T.Yamamoto
 * 作成日:2015.07.28
 */
function updateMyGalleryPhotoData() {
	$(STR_BODY).on(CLICK, '.myGalleryEditButtons .updateButton', function() {
		//チェックが入っているコンテンツの数を取得し、削除するコンテンツがあるかどうかやループの回数として使う
		var checkContentCount = $('.myPhotoCheck:checked').length;
		//チェックが入っている値が0であるならアラートを出して削除処理を行わない
		if(checkContentCount == 0) {
			//アラートでメッセージをだす
			alert('画像を1つ以上選択してください');
		} else {
			if(confirm('選択した写真を削除しますか')) {
				//ループで画像を削除する処理を開始する
				for(var loopCount=0; loopCount<checkContentCount; loopCount++) {
					//更新するのがどのコンテンツなのかの番号を取得する
					var updateContentNumber = $('.myPhotoCheck:checked').eq(loopCount).parent().index('.myPhoto');
					//更新対象要素のid列の値を取得し、DBの値を更新できるようにする
					//var updateId =  $('ここにid列のセレクタ').eq(deleteParentNumber).text();
					//データを更新するための値が入った連想配列を作っておく
					// var sendReplaceArray = {};
					// //写真についてのコメントを取得する
					// sendReplaceArray['photo_summary'] = $('.myPhotoComment').eq(updateId).text();
					//クエリに渡すために取得した値を連想配列に入れる
					//var sendReplaceArray['id'] = deleteId;
					//dbを更新する関数を走らせてDBデータを更新する
					//setDBdata(creator.json[ここにクエリのkey名],sendReplaceArray, '');
				}
			}
		}
	});
}

/* 
 * 関数名:myGalleryDbUpdate
 * 概要  :会員マイギャラリー画面でチェックボックスにチェックが入っているコンテンツについてdbデータを更新する(updateまたはdeleteを行う)
 * 引数  :sendQueryKey		:DBを更新するときに使うクエリが入ったkey名
 		 checkContentCount	:舞マイギャラリ画面のチェックボックスにチェックが入っている数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function myGalleryDbUpdate(sendQueryKey, checkContentCount) {
	//ループで画像を削除する処理を開始する
	for(var loopCount=0; loopCount<checkContentCount; loopCount++) {
		//削除するのがどのコンテンツなのかの番号を取得する
		var deleteContentNumber = $('.myPhotoCheck:checked').eq(loopCount).parent().index('.myPhoto');
		//削除対象要素のid列の値を取得し、DBの値を削除できるようにする
		//var deleteId =  $('ここにid列のセレクタ').eq(deleteParentNumber).text();
		//クエリに渡すために取得した値を連想配列に入れる
		//var sendReplaceArray = {id:{value:deleteId}};
		//dbを更新する関数を走らせてDBデータを更新する
		//setDBdata(creator.json[sendQueryKey],sendReplaceArray, '');
		//削除対象のコンテンツをクライアントから削除する
		$('.myPhoto').eq(deleteContentNumber).remove();
		// console.log(deleteContentNumber);
	}
}

/* 
 * 関数名:createMyBlogImages
 * 概要  :マイブログの記事の画像列セルから画像タグを作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.08.03
 */
function createMyBlogImages(){
	//ブログの各行を走査する
	$('.myBlogTable tr:not(:first)').each(function(){
		console.log($('.myBlogTable tbody tr'));
		var $row = $(this);	//行そのものへの参照を変数に入れておく
		//画像の列を走査する
		$('.blogImage', $row).each(function(){
			console.log($(this));
			//テキストを画像パスにして、新たに生成する画像のパスにする
			$('.blogImage', $row).eq(0).append($('<img>').attr('src', IMAGE_PATH + $(this).text()));
		});
	});
}

/* 
 * 関数名:createMyGalleryImages
 * 概要  :マイギャラリーの記事の画像列セルから画像タグを作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Masuda
 * 作成日:2015.08.03
 */
function createMyGalleryImages(){
	//各記事を処理する
	$('.myGalleryTable tr').each(function(){
		//画像列にaタグに入ったspanタグを用意する
		$('.myPhotoImage', this).append($('<a></a>')
				.attr({
						href: IMAGE_PATH + $('.myPhotoImage', this).text(),
						rel: "gallery"		
				})	//aのhref属性をセット
				.append($('<span></span>')
							//背景画像をセット
							.attr('style','background-image:url("'+IMAGE_PATH + $('.myPhotoImage', this).text() + '")')
							)
				);
	});
}

/*
 * 関数名:finshedLessonTableAfterPaging
 * 概要  :会員トップ、受講済みテーブルでページングボタンがクリックされた時にテーブルの値を置換する処理を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableAfterPaging() {
	//受講済みテーブルを編集が終わるまで表示しなくする
	$('.finishedLessonTable').hide();
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		//ページングの処理を行う件数を取得するためにページングの現在のページを取得する
		var nowPageNumber = Number($('.select').text() - 1);
		//テーブルのデータを取得する
		var tableRow = creator.json.finishedLessonTable.table;
		//テーブルの値を編集するループを開始する値を取得する
		var loopStartCount = nowPageNumber * 10;
		//テーブルのレコード数を取得する
		var recordCount = Number(creator.json.finishedLessonTable.table.length);
		//テーブルの値を編集するループを終了する値を取得する
		var loopEndCount = nowPageNumber * 10 + 9;
		//テーブルのレコード数よりループ最終数の方が大きければレコード数をループ最終数にする
		if (loopEndCount >= recordCount) {
			//ループの回数をテーブルの行数を超えないようにする
			loopEndCount = recordCount-1;
		}
		//テーブルのループのための行番号を取得する
		var rowNumber = 1;
		//ループで受講済みテーブルを編集する
		for(loopStartCount; loopStartCount<=loopEndCount; loopStartCount++) {
			//テーブルの値を置換する
			callMemberLessonValue('.finishedLessonTable', tableRow, loopStartCount, rowNumber);
			//行番号をインクリメントして次の行についてのループに備える
			rowNumber++;
		}
		//受講済みテーブルを表示する
		$('.finishedLessonTable').show();
	},1);
}

/*
 * 関数名:finshedLessonTableThemeSelect
 * 概要  :会員top、受講済み授業一覧のテーブルをテーマのセレクトボックスが変更されたときに変換するイベントを登録する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableThemeSelect() {
	//ページングがクリックされた時のイベントを登録する
	$(STR_BODY).on(CHANGE, '#finishedLesson .selectThemebox', function() {
		//デフォルトのクエリを保存して変化後のクエリを基に戻せるようにする
		var defaultQuery = creator.json.finishedLessonTable.db_getQuery;
		//テーブルの値を置換する
		replaceTableQuery('finishedLessonTable');
		//ページングに使うものを初期化し、ページングを作り直すために備える
		pagingReset('finishedLessonTable');
		//クエリを発行してDBから対象のデータの受講済み授業一覧のデータを取り出す
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json.finishedLessonTable, 'finishedLessonTable');
		//ページング機能付きで受講済みテーブルを作り直す
		creator.outputNumberingTag('finishedLessonTable', 1, 4, 1, 10, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
		//予約中テーブルのテーブルの値をしかるべき値にする
		lessonTableValueInput('.finishedLessonTable', creator.json.finishedLessonTable.table, 'callMemberLessonValue');
	});
}

/*
 * 関数名:pagingReset
 * 概要  :ページング機能をリセットし、再びページングを作り直す時に使う
 * 引数  :targetPagingClassName:ページング対象となる領域のクラス名。
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function pagingReset(targetPagingClassName) {
	//ユーザ一覧テーブルを削除する
	$(DOT + targetPagingClassName).remove();
	//会員一覧テーブルをリセットして検索に備える
	creator.json[targetPagingClassName].table = {};
	//ナンバリングのdomを初期化する
	$('.numbering').remove();
	//新しくページングを作り直すためにページングの番号一覧をリセットする
	creator.json.numbering = {};
}