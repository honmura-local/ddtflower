/* 
 * ファイル名:createLittleContent.js
 * 概要  :小規模の処理の関数を定義する
 * 作成者:T.M
 * 作成日:2015.
 * パス　:/js/createLittleContent.js
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
			// 講座一覧ダイアログを開く
			this.dialog.openTagTable({userId:this.userId,lessonDate:dateText.replace(/\//g,'-')}, 
					{url:URL_GET_JSON_STRING_PHP, key:STR_MEMBER_INFORMATION, domName:STR_MEMBER_INFORMATION, appendTo:SELECTOR_RESERVE_LESSON_LIST_DIALOG});
		}
//
//		maxDate:this.dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
//		minDate:1			//今日以前はクリックできなくする。
		//日付有効の設定を行う。配列を返し、添字が0の要素がtrueであれば日付が有効、falseなら無効になる
//		beforeShowDay:function(date){
//			return putDisableDate(date, this.dateArray);
//		}
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
 * 　　  :int dateRange:クリック可能な日付の期間
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
 * 　　  :int dateRange:クリック可能な日付の期間
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
 * 　　  :int dateRange:クリック可能な日付の期間
 * 　　  :int userId:ユーザID
 * 　　  :element dialog:ダイアログへの参照
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
 * クラス名:blogCalendar
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 　　  :int dateRange:クリック可能な日付の期間
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
 * 　　  :Array dateArray: 日付の配列
 * 戻り値:Array:DatepickerのbeforeShowDayで要求されるbooleanの配列を返す
 * 概要  :配列に該当する日付があるかのチェックを行い、判定を返す
 * 作成日:2015.06.04
 * 作成者:T.Masuda
 */
function putDisableDate(date, dateArray){
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
 * 　　  :Array target2: 比較対象2。
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
 * 　　  :element calendar:この関数をコールしたdatepicker。
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
 * 内容　:,を余計に書いてあった部分とコメント抜けを修正しました。
 */
function toolTip() {
  $(function() {
    //　要素を追加する処理
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
 * 　　　 :jQuery calendar:カレンダーの要素
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.M
 * 修正日:2015.04.17
 * 修正者:T.M
 * 内容　:カレンダーのタグからコンテンツ名を取得するようにしました。
 */
function callReservedDialog(dateText, calendar){
	// カレンダーからコンテンツ名を取得する。
	var contentName = calendar.attr('name');
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	
	// 予約希望ダイアログを作成する
	 var reservedDialog = new specialReservedDialog(null, null, {autoOpen:true}, contentName, date);
	reservedDialog.open();	//ダイアログを開く
}

/*
 * 関数名:callMemberDialog
 * 引数  :String dateText:日付テキスト
 * 　　　 :jQuery calendar:カレンダーの要素
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
	// jqueryの記述の始まり
 	$(function() {
 		// 第一引数の要素がクリックされたときの処理
		$('body').on('click', checkboxTarget, function() {
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
 * 関数名:outputKeyNumberObject(json, domkey, target)
 * 概要  :整数値でナンバリングされた連想配列のキーを持つオブジェクトからパーツを作り追加する。
 * 引数  :Object json:走査対象のJSONの連想配列
 * 		 String domkey:DOMのキー
 * 		 String target:作成したDOMのappend先
 * 		 int showNum:生成するパーツの数。
 * 		 int page:ブログ等、ページャを使っているコンテンツのページ数。
 * 戻り値:なし
 * 作成日:2015.03.20
 * 作成者:T.Masuda
 * 変更日:2015.04.08
 * 変更者:T.Masuda
 * 内容　:ブログ記事に対応しました。
 */
function outputKeyNumberObject(json, domkey, target, showNum, page){
	//showNum、pageが未入力であれば初期化する。
	showNum = showNum === void(0)? 100: showNum;
	page = page === void(0)? 1: page;
	//表示開始のインデックスの数値を作る。
	var startIndex = showNum * (page - 1); 
	
	//取得したJSONを走査する。引数に入力された数だけループする。
	for(var i = 1; ((i + startIndex).toString() in json) && i <= showNum; i++){
			//キーを一時保存して利用する。
			var key = i + startIndex;
			//パーツを生成し、指定先に追加する。
			creator.outputTag(key, domkey, target);
	}
	
	//trタグを追加したなら
	if($('.recordWrapper').length > 0){
		//trタグを取得する
		var records = $('.recordWrapper tr');
		//tableタグを外す
		unwrapTable('.'+records.attr('class'));
	}
}

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
$(document).on('click', '.myGalleryEditButtons .deleteButton', function(){
	//チェックが入っている写真があれば
	if($('.myPhotoCheck:checked').length){
		//確認ダイアログを出して同意を得てから画像を消す。
		beforeConfirmButtonPush(deletePhoto, '選択した写真を削除しますか?', '');
	}
});

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
		
		//保存先を指定して画像のアップロードを行う。
	    $(this).upload(init['saveJSON'],{"dir":init['photoDirectory']}, function(xml) {
	//    	$(this).upload('uploadImage',{"dir":init['photoDirectory']}, function(xml) {
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
					blogText:'本文',
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
							//実際にはルート直下に各ブログ記事要素のテキストが配置されているという前提です。
							//ダミーのJSONでは記事番号をキーとしたオブジェクトの直下に各ブログ記事要素のテキストが配置されています。
							json = json[number];
							//jsonを走査する。
							for(key in json){
								var dom = $('.' + key);//値をセットする対象となるDOMを取得する。
								//domが画像タグならば
								if(dom[0].tagName == 'IMG'){
									//キーに対応したクラスの要素にテキストを追加していく。
									dom.attr('src',json[key]);
								//ラジオボタンなら
								} else if(dom.attr('type') == 'radio'){
									//対象となるラジオボタンにチェックを入れる。
									dom.filter('[value="' + json[key] + '"]').prop('checked', 'true');
								//日付テキストボックスなら
								} else if(dom.attr('type') == 'date'){
									//日付のフォーマットを整えてテキストボックスに値を入れる。
									dom.val(json[key].replace(/\//g, "-"));
									//単にテキストを入れるだけであれば
								} else {
									dom.val(json[key]);	//キーに対応したクラスの要素にテキストを追加していく。
								}
							}
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
function deleteRowData(form){
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
 * 関数名 :createAccordion
 * 引数  　:element targetClick:クリックするとアコーディオンを表示するボタン
 * 戻り値　:なし
 * 概要  　:アコーディオンパネルを実装する
 * 作成日　:2015.06.09
 * 作成者　:T.Yamamoto
 */
function createAccordion(targetClick) {
	// 第一引数がクリックされた時のイベント
	$(targetClick).on("click", function() {
		// クリックされた番号を取得する
		var accordNumber = $(".detailButton").index(this);
		// 番号に対応したアコーディオン部分を表示する
		var y = $('.accordion').eq(accordNumber).toggle();
	});
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