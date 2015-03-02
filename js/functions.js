

/*
 * 関数名:createCalendar
 * 引数  :なし
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
function createCalendar () {
  // jqueryの記述の始まり
    $(function() {
        //@mod 2015.02.21 T.Masuda カレンダーのタグを作る記述を削除しました。
    	// カレンダーを表示するためのdivを作る
        //$('.specialGuide').after('<div class="calendar"></div>');
        // @mod 2015/02.10 T.M コールバック関数を追加しました。
        // カレンダーを表示する
        //$('.calendar').datepicker();
        // カレンダーを表示する

        $.datepicker.regional['ja'] = {
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
			$.datepicker.setDefaults($.datepicker.regional['ja']);

        $('.calendar').datepicker({
        	// カレンダーの日付を選択したら
        	onSelect: function(dateText, inst){
        		// 予約のダイアログを出す。
        		callReservedDialog(dateText);
        	}
        });
        // ここまで追加・修正しました。
    });// jqueryの記述の終わり
}



/*
 * 関数名:functionFilter
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :引数をセレクターにしてマウスオーバーしたときに透過率を0.5にする
 * 作成日:2015.02.05
 * 作成者:T.Y
 * 変更日:2015.02.22
 * 変更者:T.Masuda
 * 内容  :トップメニューにある表示中のページのボタンの背景色を変える。
 */
function functionFilter (filterTarget) {
  // URLからファイル名を取得する。
  currentLocation = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
  // jqueryの記述の始まり
  $(function() {
	//現在表示中のページのボタン以外に対して
    $(filterTarget).filter(':has(a:not([href$="' + currentLocation + '"]))')
        .mouseenter(function() {            // 引数の要素にマウスを乗せた時の処理
            $(this).addClass('active');    // 引数の要素にactiveクラスを付与する。
        })
        .mouseleave(function() {            // 引数の要素からマウスが離れたときの処理
            $(this).removeClass('active');  // 引数の要素からactiveクラスを除去する。
        });
  });// jqueryの記述の終わり
  
  // URLからファイル名を取得する。
	var contentName = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
  
	// 現在のページのボタンの枠に対して、activeクラスを付与する。
	$('.topMenu li:has(a[href$="' + currentLocation + '"])').addClass('active');
  
}


/*
 * 関数名:toolTip
 * 引数  :var targetElement
 * 戻り値:なし
 * 概要  :引数の要素に対してツールチップを表示する
 * 作成日:2015.02.06
 * 作成者:T.Y
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
            top: e.pageY,//現在マウスポインターがあるY座標
            left: e.pageX,//現在マウスポインターがあるX座標
            zIndex: 2,
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
 * 関数名:createGallery(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :カルーセルのギャラリーを生成する。
 * 作成日:2015.02.21
 * 作成者:T.M
 */
function createGallery(selector){

	// slickの画像の個数を用意する。
	var slickitems = 3;
	// 画面がスマホレイアウトであれば
	if(window.innerWidth <= 680){
		// 表示する個数を減らす。
		slickitems = 1;
	}
	
// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
	$('.' + selector).slick({
		// 矢印ボタンでの制御を有効にする。
		accessibility:false,
		// 矢印ボタンを使う。
		arrows:false,
		// レスポンシブレイアウトに対応する。
		responsive:true,
		//表示する画像の数を画面サイズに依存させる。
		slidesToShow:slickitems,
	    slidesToScroll: slickitems,
		//モバイル優先の設定を使う。
	    mobileFirst: true,
		//最初に表示しない画像は後から読み込む。
		lazyLoad:true,
		// 緩急をつけたアニメーションでスクロールする。
		easing:'swing',
	    //幅を可変にする。
		variableWidth:true,
		// 画像を中心に配置する。
		centerMode: true
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	}); 
	
	//ウィンドウの幅が変わったときのイベントを登録する。
	$(window).resize(function(){
		// 画面がスマホレイアウトであれば
		if(window.innerWidth <= 680){
			// 表示する個数を減らす。
			slickitems = 1;
		//PCレイアウトであれば
		} else{
			//表示する個数を多めにする。
			slickitems = 3;
		}
		$('.' + selector).unslick();
		//slickの設定を直す。
		$('.' + selector).slick({
			// 矢印ボタンでの制御を有効にする。
			accessibility:false,
			// 矢印ボタンを使う。
			arrows:false,
			//モバイル優先の設定を使う。
			mobileFirst: true,
			//最初に表示しない画像を後から読み込む。
			lazyLoad:true,
			// レスポンシブレイアウトに対応する。
			responsive:true,
			//表示する画像の数を画面サイズに依存させる。
			slidesToShow:slickitems,
		    slidesToScroll: slickitems,
		    //幅を可変にする。
			variableWidth:true,
			// 緩急をつけたアニメーションでスクロールする。
			easing:'swing',
			// 画像を中心に配置する。
			centerMode: true
		});
	});
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
 * 関数名:appearLoadingScreen(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :ページ読み込み時にローディング画面を表示する。
 * 作成日:2015.03.02
 * 作成者:T.Masuda
 */
function appearLoadingScreen(selector){
	// jQueryのコードを書く。
	$(function(){
		//指定した要素をを見えなくする。
		$(selector).attr('display', 'none');	
		//ローディング画面を追加する。
		$('body').prepend($('<div id="loading">')
					.attr({
						position:'absolute',	/* 絶対位置を指定する。 */
						left:'50%',				/* 画面中央 */
						top:'20%',				/* 上から20%の位置に置く */
						marginLeft:'-30px'		/* 自分の大きさの半分左にずらして中心に置く。 */
					})
					//ローディング画像を追加する。
					.append($('<img src="image/gif-load.gif">')
					)
			);
	});
	
	//ウィンドウのロードが終わったら
	window.onload = function(){
		//jQueryのコードを書く。
		$(function() {
			//ローディング画面をフェードアウトさせる。
			$("#loading").fadeOut();
			//指定した要素をフェードインさせる。
			$(selector).fadeIn();
		});
	};
}

/*
 * 関数名:callLoadingScreen(selector)
 * 引数  :String selector
 * 戻り値:なし
 * 概要  :ローディング画面を表示する。
 * 作成日:2015.03.02
 * 作成者:T.Masuda
 */
function callLoadingScreen(selector){
	// jQueryのコードを書く。
	$(function(){
		//指定した要素をを見えなくする。
		$(selector).fadeOut();	
		//ローディング画面を追加する。
		$('body').prepend($('<div id="loading">')
				.attr({
					position:'absolute',	/* 絶対位置を指定する。 */
					left:'50%',				/* 画面中央 */
					top:'20%',				/* 上から20%の位置に置く */
					marginLeft:'-30px',		/* 自分の大きさの半分左にずらして中心に置く。 */
					zIndex: 2000			/* 必ず見える様にする。 */
				})
				//ローディング画像を追加する。
				.append($('<img src="image/gif-load.gif">')
				)
		);
	});
	
//	//ウィンドウのロードが終わったら
//	window.onload = function(){
//		//jQueryのコードを書く。
//		$(function() {
//			//ローディング画面をフェードアウトさせる。
//			$("#loading").fadeOut();
//			//指定した要素をフェードインさせる。
//			$(selector).fadeIn();
//		});
//	};
}

/* リンクが押されたら */
$(document).on('click', 'a[href*=".html"]', function(){
	//ローディング画面を呼び出す。
	callLoadingScreen('#container');
});