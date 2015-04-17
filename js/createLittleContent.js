/**
 * 小規模のパーツ、コンテンツを作るためのJSファイル。
 */

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

/*
 * 関数名:createCalendar(selector)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 戻り値:なし
 * 概要  :カレンダーを作る
 * 作成日:2015.02.06
 * 作成者:T.Y
 * 変更者:2015.02.10
 * 作成者:T.M
 * 概要  :カレンダーをクリックした時のコールバック関数を追加しました。
 * 変更者:2015.02.21
 * 作成者:T.M
 * 概要  :カレンダーのタグを作る記述を削除しました。
 */
function createCalendar (selector) {
  // jqueryの記述の始まり
    $(function() {
        $.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);

        $(selector).datepicker();
        // ここまで追加・修正しました。
    });// jqueryの記述の終わり
}

/*
 * 関数名:createReservedCalendar(selector, dateRange)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 　　  :int dateRange:本日を基準にした予約可能な日数
 * 戻り値:なし
 * 概要  :予約のカレンダーを作る。
 * 作成日:2015.03.18
 * 作成者:T.Masuda
 * 修正日:2015.04.10
 * 修正者:T.Masuda
 * 内容  :自身に予約用カレンダーのクラスを付加するように変更しました。
 */
function createReservedCalendar (selector, dateRange) {
	// jqueryの記述の始まり
	$(function() {
		$.datepicker.regional['ja'] = dpJpSetting;
		$.datepicker.setDefaults($.datepicker.regional['ja']);
		
		$(selector).datepicker({
			// カレンダーの日付を選択したら
			onSelect: function(dateText, inst){
				// 予約のダイアログを出す。
				callReservedDialog(dateText);
			},
			maxDate:dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
			minDate:0			//過去はクリックできなくする。
		});
		// ここまで追加・修正しました。
	});// jqueryの記述の終わり
}

/*
 * 関数名:createMyPageReservedCalendar(selector, dateRange)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 　　  :int dateRange:本日を基準にした予約可能な日数
 * 戻り値:なし
 * 概要  :マイページ予約のカレンダーを作る。
 * 作成日:2015.04.16
 * 作成者:T.Masuda
 */
function createMyPageReservedCalendar(selector, dateRange) {
	//datepickerのロケール設定を行う。
	$.datepicker.regional['ja'] = dpJpSetting;
	$.datepicker.setDefaults($.datepicker.regional['ja']);
		
	$(selector).datepicker({
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			// 開発中のメッセージを出す。
			alert('現在この機能は開発中となっています。');
		},
		maxDate:dateRange,	//今日の日付を基準にクリック可能な期間を設定する。
		minDate:0			//過去はクリックできなくする。
	});
}

/*
 * 関数名:createBlogCalendar(selector)
 * 引数  :string selector:カレンダーにするタグのセレクタ
 * 戻り値:なし
 * 概要  :ブログページのカレンダーを作る。
 * 作成日:2015.04.16
 * 作成者:T.Masuda
 */
function createBlogCalendar(selector) {
	//datepickerのロケール設定を行う。
	$.datepicker.regional['ja'] = dpJpSetting;
	$.datepicker.setDefaults($.datepicker.regional['ja']);
	
	$(selector).datepicker({
		// カレンダーの日付を選択したら
		onSelect: function(dateText, inst){
			// 開発中のメッセージを出す。
			alert('現在この機能は開発中となっています。');
		}
	});
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
 * 引数  :String dateText
 * 戻り値:なし
 * 概要  :ページに対応した予約ダイアログを生成する。
 * 作成日:2015.02.10
 * 作成者:T.M
 */
function callReservedDialog(dateText){
	// コンテンツ名を取得する。
	var contentName = getContentName();
	// 日付配列を取得する。
	var date = createDateArray(dateText)
	
	// コンテンツ名、レッスン予約のダイアログを生成する関数、日付の配列を引数にしてcreateText関数をコールする
	createSpecialReservedDialog(contentName, date);
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
	//該当する要素を取得する。
	var $gallery = $('.' + selector);
	//一旦ギャラリーを隠す。
	$gallery.hide();
	//時間をおいて関数を実行する。
	window.setTimeout(function(){
		//ギャラリーを見える様にする。
		$gallery.show();
		
		//SmoothDivScrollの関数をコールしてギャラリーを作る。
		$gallery.smoothDivScroll({
			//カーソル合わせでスクロールする領域を表示する。
			hotSpotScrolling: true,
			//タッチでのスクロールを有効にする。
			touchScrolling: true,
			manualContinuousScrolling: true,
			//マウスホイールによるスクロールを無効にする。
			mousewheelScrolling: false,
			visibleHotSpotBackgrounds:"always"
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
		updateHash:false,	//タブのインデックスをクリックしてもURLのハッシュが変わらないようにする。
		cache:false
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
	
	//mapを操作する。
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
	//画像ソースを格納する。
	retMap['src'] = $('.myPhotoLink', photo).attr('href');
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
				.val(currentText)							//テキストを引き継ぐ。
				.append(createOptions('publifications'))	//optionタグをセットする。
			);
		//選択済みにする。
		$('.' + className + 'Edit').val($(textElem).attr('value'));
	}else {
		//編集用のテキストエリアを配置する。
		$(textElem).after($('<input>')
				.addClass(className + 'Edit')	//編集テキストエリア用のクラスをセットする。
				.val(currentText)				//テキストを引き継ぐ。
				.attr('type', 'text')			//テキストボックスのtypeをセットする。	
		);
	}
	
	//追加した要素にフォーカスする。
	$('.' + className + 'Edit').focus();
	
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
 * イベント名:$(document).on('dblclick', '.myGallery .myPhotoTitle')
 * 引数  　 	:string 'dblclick':ダブルクリックイベントの文字列
 * 			:string '.myGallery .myPhotoTitle':写真のタイトルのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のタイトルをダブルクリックしたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('dblclick', '.myPhotoTitle,.myPhotoComment,.myPhotoPublication', function(){
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
$(document).on('blur', '.myPhotoTitleEdit,.myPhotoCommentEdit,.myPhotoPublicationEdit', function(){
	//自身を持つ写真要素のセレクタを取得する。
	var myphoto = $('.myPhoto').has(this);
	//編集モードを解除する。
	endEditText(this);
	//編集したデータを送信する。
	postPhoto(myphoto);
});

/*
 * イベント名:$(document).on('click', '.myGalleryEditButtons .createButton')
 * 引数  　 	:string 'click':クリックイベントの文字列
 * 			:string '.myGalleryEditButtons .createButton':新規ボタンのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のコメントの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('click', '.myGalleryEditButtons .createButton', function(){
	//画像アップローダーのタグをクリックする。
	$('.uploader').click();
});

/*
 * イベント名:$(document).on('change', '.uploader .createButton')
 * 引数  　 	:string 'change':値変化のイベントの文字列
 * 			:string '.myGalleryEditButtons .uploader':新規ボタンのセレクタ。
 * 戻り値　 :なし
 * 概要  　 :Myギャラリーの写真のコメントの編集を終えたときのイベント。
 * 作成日　　:2015.03.27
 * 作成者　　:T.Masuda
 */
$(document).on('change', '.myGalleryEditButtons .uploader', function(event){
	//保存先を指定して画像のアップロードを行う。
    $(this).upload(init['saveJSON'],{"dir":init['photoDirectory']}, function(xml) {
//    	$(this).upload('uploadImage',{"dir":init['photoDirectory']}, function(xml) {
    	//返ってきたデータから成否判定の値を取り出す。
    	//var issuccess = parseInt($(xml).find('issuccess').text());
    	//ローカルでのテスト用のxmlデータを作る。
    	var issuccess = 1;
    	xml = $('<root></root>')
    			.append($('<src></src>')
    					.text('photo/general/web/DSC_0682.jpg')
    			)
    			.append($('<message></message>')
    					.text('success')
    			);
    	if(issuccess){	//保存に成功していたら
    		var src = $(xml).find('src').text();	//画像の保存先を取得する。
    		//createTagで新たな写真を作成する。
    		creator.outputTag('blankPhoto', 'myPhoto', '.myGallery');
    		//新たな写真を初期化する。
    		createNewPhoto();
    		//画像拡大用のタグにソースをセットする。
    		$('.myPhotoLink:last').attr('href', src);
    		//画像サムネイルに使う要素の画像を設定する。
    		$('.myPhotoImage:last').css('background-image', 'url('  +  src + ')');
    	//保存に失敗していたら
    	} else {
    		alert($(xml).find('message').text());	//メッセージを取り出してアラートに出す。
    	}
    //サーバから返されたデータをXMLとして扱う。
    },"xml");
});
	
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
	$uploader.upload(init['saveJSON'],{"dir":init['photoDirectory']}, function(xml) {
		//返ってきたデータから成否判定の値を取り出す。
//		var issuccess = parseInt($(xml).find('issuccess').text());
		var issuccess = "true";
		if(issuccess == "true"){	//保存に成功していたら
//			var src = $(xml).find('src').text();	//画像の保存先を取得する。
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
		} else {
			alert($(xml).find('message').text());	//メッセージを取り出してアラートに出す。
		}
		//サーバから返されたデータをXMLとして扱う。
	},"xml");
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
		if($(this)[0].tagName == 'IMG'){
			$(this).attr('src', "");	//ソースパスを空にする。
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
		email:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ\b\r%\'½¾ÛÞ»¿ÀÝºâÜ",
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
	
	
	//押されたキーのコードを1文字に変換する。
	m = String.fromCharCode(keyCode);
	//指定されたキーコード以外であれば。tabキーのコードは許可する。
	if(limitInput[$(evt.target).attr('type')].indexOf(m, 0) < 0 && !(parseInt(keyCode) == 9)){
		return false;	//処理を途中終了する。
	}
	
	return true;	//処理を通常通りに行う。	
}

//テキストボックス等のname属性の日本語版を格納する連想配列。
var errorJpNames = {name:'氏名',
					eMail:'メールアドレス',
					sex:'性別',
					content:'お問い合わせ内容',
					tel:"電話番号",
					address:'住所',
					eMailConfirm:"メールアドレス(確認)",
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
					nameKana:'氏名(カナ)'
					};
//validate.jsでチェックした結果を表示する記述をまとめた連想配列。
var showAlert = {
		invalidHandler:function(form,error){	//チェックで弾かれたときのイベントを設定する。
			var errors = $(error.errorList);	//今回のチェックで追加されたエラーを取得する。
			//エラー文を表示する。
			alert(createErrorText(errors, errorJpNames));
		},
		rules:{	//ルールを設定する。
			eMailConfirm:{	//メールアドレス入力確認欄
				equalTo: '[name="eMail"]'	//メールアドレス入力欄と同じ値を要求する。
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
			).done(function(){
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
					//Ajax通信で該当する記事のJSONを取得する。
					$.ajax({
						//ブログ記事を1つだけ取得するサーバのファイルにアクセスする。
						url:url,
//					url:init['getSelectedBlog'],
						method:'post',	//postメソッドで送信する。
						//ユーザIDと記事番号とコンテンツ番号を送る。
						data:{'userId':userId, 'number':number, 'contentNum':contentNum},
						dataType:'JSON',	//JSONを返してもらう。
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
								} else if(dom.attr('type') == 'checkbox'){
									//対象となるラジオボタンにチェックを入れる。
									dom.filter('[value="' + json[key] + '"]').prop('check', 'true');
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
			//現在未定義。
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