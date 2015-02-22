

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
    $(filterTarget).filter(':not([href$="' + currentLocation + '"])')
        .mouseenter(function() {            // 引数の要素にマウスを乗せた時の処理
            $(this).css("opacity", 0.5);    // 引数の要素の透過度を0.5にする
        })
        .mouseleave(function() {            // 引数の要素からマウスが離れたときの処理
            $(this).css("opacity", 1);      // 引数の要素の透過度を戻す
        });
  });// jqueryの記述の終わり
  
  // URLからファイル名を取得する。
	var contentName = location.href.substring(location.href.lastIndexOf("/")+1,location.href.length);
  
	// 現在のページのボタンの枠に対して
	$('.topMenu li:has(a[href$="' + currentLocation + '"])').css({
		background: "#EEE"   	/* ボタンの背景色を薄い灰色にする。 */
	});
	//現在のページのボタンに対して
	$('.topMenu a[href$="' + currentLocation + '"]').css({
		opacity: "0.5"   	/* 文字を透過する。 */
	});
  
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
// jQueryプラグイン「Slick」によりカルーセルのギャラリーを作成する。
	$('.' + selector).slick({
		// 矢印ボタンでの制御を有効にする。
		accessibility:true,
		// 矢印ボタンを使う。
		arrows:true,
		// レスポンシブレイアウトに対応する。
		responsive:true,
		// 一度に3個の画像をギャラリーに並べる。
		slidesToShow:3,
		// 緩急をつけたアニメーションでスクロールする。
		easing:'swing',
		// 画像を中心に配置する。
		centerMode: true
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
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
        // 用意されている画像の数だけ並べる。
        slidesToShow:$('.' + selector + ' img').length
	});
	
// フッター前のギャラリーをクリックしたらjQueryプラグイン「fancybox」により
// 拡大表示を行うようにする。
	$('.' + selector + ' a').fancybox({
		'hideOnContentClick': true
	}); 
}

