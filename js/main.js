// 汎用的な処理をまとめたJSファイル。

// ドキュメント読み込み後の処理
$(document).ready(function(){
	// リンクをクリックしたら
	$(document).on('click', 'a[href$=".html"]', function(event){
		//URLを引数にしてページを切り替える関数をコールする。
		callPage($(this).attr('href'));
		//通常の画面遷移をキャンセルする。
		event.preventDefault();
	});
});

/*
 * 関数名:callPage(url, state)
 * 引数  :String url, Object state
 * 戻り値:なし
 * 概要  :新たにページを読み込む。
 * 作成日:2015.03.05
 * 作成者:T.M
 * 修正日:2015.03.06
 * 修正者:T.M
 * 内容　:戻るボタンに対応しました。
 */
function callPage(url, state){
	//Ajax通信を行う。
	$.ajax({
		//URLを指定する。
		url: url,
		//HTMLを返してもらう。
		dataType:'html',
		//同期通信を行う。
		async: false,
		//通信成功時の処理
		success:function(html){
			//mainのタグを空にする。
			$('.main').empty();
			//linkタグを収集する。
			var links = $(html).filter('link');
			//scriptタグを収集する。
			var scripts = $(html).filter('script:parent');
			//linkタグを展開する。
			links.each(function(){
				//headタグ内にlinkタグを順次追加していく。
				$('head').append($(this));
			});
			//scriptタグを展開する。
			scripts.each(function(){
				//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
				$('.main').append($(this));
			});
			//カレントのURLを更新する。
			currentLocation = url;
			//第二引数が入力されていなければ
			if(state === void(0)){
				//画面遷移の履歴を追加する。
				history.pushState({'url':currentLocation}, '', location.href);
			}
		}
	})
	//JSONデータを格納する変数を初期化する。
	creator.json = null;
	//ひな形のHTMLのDOMを格納する変数を初期化する。
	creator.dom = '';
}
/*
 * 関数名:callLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を表示する。
 * 作成日:2015.03.02
 * 作成者:T.Masuda
 */
function callLoadingScreen(){
		//ローディング画面を出す。
		$('.loading').css('display','block');
}

/*
 * 関数名:hideLoadingScreen()
 * 引数  :なし
 * 戻り値:なし
 * 概要  :ローディング画面を隠す。
 * 作成日:2015.03.05
 * 作成者:T.Masuda
 */
function hideLoadingScreen(){
	//ローディング画面を隠す。
	$('.loading').css('display','none');
}

/* ローディング画面呼び出しのイベント登録 */
/* ページが読み込まれたら */
$(document).ready(function(){
	//ローディング画面を追加する。
	$('body').prepend($('<div></div>')
			.addClass('loading')
			//ローディング画像を追加する。
			.append($('<img>')
					//ローディング画像のパスを追加する。
					.attr('src', 'image/loading.gif')
			)
			//Loadingの文字を表示する。
			.append($('<p></p>')
					//文字を追加する。
					.text('Loading...')
			)
	);
});


/* フォームがsubmitされたら */
$(document).on('submit', 'form', function(event){
	//submitイベントをキャンセルする。
	event.preventDefault();
	//Ajax通信を行う。
	$.ajax({
		//URLを指定する。
		url:$(this).attr('action'),
		//POSTする。
		method:'post',
		//HTML形式のデータを返してもらう。
		dataType:'html',
		//送信するフォームデータを書き出す。
		data:{
				'name':$('*[name="name"]',this).val(),
				'sex':$('*[name="sex"]:checked',this).val(),
				'eMail':$('*[name="eMail"]',this).val(),
				'content':$('*[name="content"]',this).val(),
			},
		//成功時の処理。
		success:function(html){
			alert('success');
		}
	});
});

//現在選択中のページ
currentLocation = '';

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
  // jqueryの記述の始まり
	//現在表示中のページのボタン以外に対して
    $(filterTarget, document).filter(':has(a:not([href$="' + currentLocation + '"]))')
        .mouseenter(function() {            // 引数の要素にマウスを乗せた時の処理
            $(this).addClass('active');    // 引数の要素にactiveクラスを付与する。
        })
        .mouseleave(function() {            // 引数の要素からマウスが離れたときの処理
            $(this).removeClass('active');  // 引数の要素からactiveクラスを除去する。
        });
}
	
/*
 * 関数名:changeSelectedButtonColor
 * 引数  :var filterTarget
 * 戻り値:なし
 * 概要  :選択した要素の色を変えるクラスを付与する。
 * 作成日:2015.03.06
 * 作成者:T.Masuda
 */
function changeSelectedButtonColor(filterTarget){
	//一旦全てのactiveクラスを剥奪する。	
	$(filterTarget).removeClass('active');
	// 現在のページのボタンの枠に対して、activeクラスを付与する。
	$(filterTarget, document).filter(':has(a[href$="' + currentLocation + '"])').addClass('active');
}

//Ajax通信が始まったら
$(document).ajaxStart( function(){
	//ローディング画面を出す。
	callLoadingScreen();
});
//Ajax通信が全て終了したら
$(document).ajaxStop( function(){
	//ローディング画面を隠す。
	hideLoadingScreen();
	//選択されたトップメニューの色を変える。
	changeSelectedButtonColor('.topMenu li');
});
/* 以上、ローディング画面呼び出しのイベント登録。 */

//popStateに対応できているブラウザであれば
if (window.history && window.history.pushState){
	//popStateのイベントを定義する。
    $(window).on("popstate",function(event){
        //初回アクセスであれば何もしない。
    	if (!event.originalEvent.state){
    		return; // 処理を終える。
    	}
        var state = event.originalEvent.state; 	//stateオブジェクトを取得する。
        callPage(state['url'], state);			//履歴からページを読み込む。
  });
}
