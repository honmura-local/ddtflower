// 画面遷移を操作する関数を中心にまとめたJSファイル。

currentLocation = '';	//現在選択中のページの変数

/*
 * 関数名:isSupportPushState()
 * 引数  :なし
 * 戻り値:boolean
 * 概要  :ブラウザがpushStateに対応しているかをbooleanで返す。
 * 作成日:2015.03.10
 * 作成者:T.M
 */
function isSupportPushState(){
	// 返却値を格納する変数returnsを宣言し、falseで初期化する。
	var returns = false;
	//ブラウザがpushStateに対応していれば
	if(window.history && window.history.pushState){
		//trueを返す様にする。
		returns = true;
	}
	
	//returnsを返す。
	return returns;
}

/*
 * イベント:ready
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :ドキュメント読み込み後のイベント
 * 作成日 :2015.03.10
 * 作成者 :T.M
 */
$(document).ready(function(){
	// リンクをクリックしたら
	$(document).on('click', 'a[href$=".html"]', function(event){
		//pushState対応ブラウザであれば
//		if(isSupportPushState()){
			//URLを引数にしてページを切り替える関数をコールする。
			callPage($(this).attr('href'));
			//通常の画面遷移をキャンセルする。		
			event.preventDefault();
//		}
	});
});

/*
 * 関数名:overwrightContent(target, data)
 * 引数  :String target, Object state
 * 戻り値:なし
 * 概要  :既存のコンテンツを消して、新たなコンテンツを書き出す。
 * 作成日:2015.03.09
 * 作成者:T.M
 */
function overwrightContent(target, data){
	var dat = $(data);
	//mainのタグを空にする。
	$(target).empty();
	//linkタグを収集する。
//	var links = $(data).filter('link');
	var links = $('link', data);
	//コードが書かれているscriptタグを収集する。
//	var scripts = $(data).filter('script:not(:empty)');
	var scripts = $('script:not(:empty)', data);
	//linkタグを展開する。
	links.each(function(){
		//headタグ内にlinkタグを順次追加していく。
		$(target).append($(this));
	});
	//scriptタグを展開する。
	scripts.each(function(){
		//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
		$(target).append($(this));
	});
}

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
	//urlから#を抜き取り、有効なURLを形成する。
	url = url.replace(/#/g, '');
	//cgiなら
	if(url.indexOf('.cgi') > -1){
		//フォーム用の処理を行う。
		postForm($('<form></form>').attr({action: url,method:'post'}));
		return;	//処理を終える。
	}
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
			//JSONデータを格納する変数を初期化する。
			creator.json = null;
			//ひな形のHTMLのDOMを格納する変数を初期化する。
			creator.dom = '';
			//既存のコンテンツを上書きする。
			overwrightContent('.main', html);
			//カレントのURLを更新する。
			currentLocation = url;

			//ログインダイアログが出ていれば
			if($('.loginDialog').length){
				//ログインダイアログを直ちに消す。
				$('.loginDialog').dialog('close').dialog('destroy').remove();
			}

			//第二引数が入力されていなければ、また、pushStateに対応していれば
			if(state === void(0) && isSupportPushState()){
				//画面遷移の履歴を追加する。
				history.pushState({'url':'#' + currentLocation}, '', location.href);
			}
		}
	});
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

/*
 * イベント:ready
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :ローディング画面の作成。
 * 作成日 :2015.03.10
 * 作成者 :T.M
 */
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

/*
 * 関数名:createFormData(form)
 * 引数  :jQuery form
 * 戻り値:Object
 * 概要  :フォームの投稿データを作る。
 * 作成日:2015.03.09
 * 作成者:T.Masuda
 */
function createFormData(form){
	//返却するデータを格納する変数を宣言する。
	var formDataReturn = {};
	
	//フォーム内の入力要素を走査する。無効化されている要素は走査対象から外す。
	$('input:text, input[type="email"], textarea, input:radio:checked, input:checkbox:checked, input:hidden,input[type="number"], input[type="search"], input[type="tel"]', form)
		.not('[disabled]').each(function(){
		//値を取得する。
		var val = $(this).val();
		//name属性の値を取得する。
		var name = $(this).attr('name');
		
		//name属性で括られた最初のチェックボックスなら
		if($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]:checked') == 0){
			//valを配列として扱う。
			val = [];
			//name属性で括られたチェックボックスを走査していく。
			$('input:checkbox[name="' + name + '"]:checked').each(function(i){
				//配列にチェックボックスの値を格納していく。
				val[i] = $(this).val();
			});
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		//チェックが入った2番目以降のチェックボックスであるか、name属性がない入力要素であれば
		} else if(($(this).attr('type') == 'checkbox' 
			&& $(this).index('[name="' + name + '"]') != 0) || name === void(0)){
			//何もしない。
		//それ以外であれば
		} else {
			//name属性がnameであれば
			//送信確認と送信時に文字列追加が行われてしまうため、一時凍結しました。
//			if(name == 'name'){		
//				val = val + ' 様';
//			}
			//formDataを連想配列として扱い、keyとvalueを追加していく。
			formDataReturn[name] = val;
		}
	});
	
	//フォームデータを返す。
	return formDataReturn;
}

/*
 * イベント:submit
 * 引数   :なし
 * 戻り値 :なし
 * 概要   :フォームがsubmitされたときのイベント。
 * 作成日 :2015.03.10
 * 作成者 :T.M
 * 変更日 :2015.03.31
 * 変更者 :T.M
 * 内容 　:.mainの中のフォームに限定しました。
 * 変更日 :2015.04.14
 * 変更者 :T.M
 * 内容 　:jQuery.Uploadで生成されたformタグを除外する記述を追加しました。
 * 変更日 :2015.04.17
 * 変更者 :T.M
 * 内容 　:処理内容を関数化しました。
 */
$(document).on('submit', '.main form:not([target^="jquery_upload"])', function(event){
	afterSubmitForm(this, event);	//フォームをsubmitした後の処理を行う。
});

/*
 * 関数名:afterSubmitForm
 * 引数   :element form:submitを行ったフォームのタグ。
 * 　　   :event event:イベントオブジェクト。
 * 戻り値 :なし
 * 概要   :フォームがsubmitされたときの処理の関数。
 * 作成日 :2015.04.16
 * 作成者 :T.M
 */
function afterSubmitForm(form, event){
	var $this = $(form);		//処理高速化のためthisのjQueryオブジェクトを変数に入れる。
	//イベントオブジェクトがあれば
	if(event !== void(0)){
		//submitイベントをキャンセルする。
		event.preventDefault();
	}
	
	//submitボタンにconfirm属性が指定してありかつ、trueであれば
	if($(('input:submit[confirm="true"]'), $this).length){
		//formタグにメッセージが書いてあれば、取得してダイアログに渡す準備をする。
		var message = $this.attr("value") !== void(0)? $this.attr("value"):"";
		//同様にタイトルも準備する。
		var title = $this.attr("title") !== void(0)? $this.attr("title"):"";
		//OKボタン、キャンセルボタンでtrue、falseを返すダイアログを表示する。
		chooseOKBeforeCallFunc(message, title, postForm, $this);
	} else {
		//チェックの必要がなければ通常通りフォームをsubmitする。
		postForm($this);
	}
}


/*
 * 関数名:function postForm(form)
 * 引数  :element form:フォームの要素。
 * 戻り値:なし
 * 概要  :フォームを送信する。
 * 作成日:2015.04.13
 * 作成者:T.Y
 */
function postForm(form){
	$form = $(form);	//高速化のため、フォームの要素をjQueryオブジェクトにして変数に格納する。
	//フォームのaction属性から送信URLを取得する。
	var url = $form.attr('action').split(',');
	//送信するデータを格納する連想配列を作成する。
	var formData = createFormData($form);
	//creatorのメンバにフォームデータを保存する。
	creator.formData['formData'] = formData;
	
	//postメソッドでフォームの送信を行う。
	$.post(url[0], formData,
	// 成功時の処理を記述する。
	 function(data){
		//お問い合わせフォームであったら
		if($('.main .confirmSendMail').length > 0){
			//送信完了のメッセージを出す。
			alert('お問い合わせのメールの送信が完了しました。\n追ってメールでの連絡をいたします。\n返信のメールがしばらく経っても届かない場合は、入力されたメールアドレスに誤りがある可能性がございます。\nもう一度メールアドレスを入力してお問い合わせの操作を行ってください。');
		}
	
		var $target = $('.main');	//書き込み先を指定する。
		
		//URLが二つあれば
		if(url.length > 1){
			alert('更新に成功しました。');	//返ってきたデータをダイアログに出す。
//			alert(data);	//返ってきたデータをダイアログに出す。
			//タブがあれば
			if($target.has('.tabContainer').length){
				$target = $('.tabPanel.active:last');	//タブパネル内を書き換える。
				callPageInTab(url[1], $target);			//タブにページを書き込む。
				//タブでなかったら
			} else {
				callPage(url[1]); //画面を切り替える。
			}			
		} else {
			//タブがあれば
			if($target.has('.tabContainer').length){
				$target = $('.tabPanel.active:last');	//タブパネル内を書き換える。
				callPageInTab(url[0], $target);			//タブにページを書き込む。
				//タブでなかったら
			} else {
				//mainのタグを空にする。
				$target.empty();
				//取得したページのmainタグ直下の要素をを取得し、mainのタグに格納する。
				$target.append($('.main > *', data));
				//linkタグを収集する。
				var links = $(data).filter('link');
				//scriptタグを収集する。
				var scripts = $(data).filter('script:parent');
				//linkタグを展開する。
				links.each(function(){
					//headタグ内にlinkタグを順次追加していく。
					$target.append($(this));
				});
				//scriptタグを展開する。
				scripts.each(function(){
					//mainのタグの中にscriptタグを展開し、JavaScriptのコードを順次実行する。
					$target.append($(this));
				});
				
				//カレントのURLを更新する。
				currentLocation = url;
				//pushstateに対応していたら
				if(isSupportPushState()){
					//画面遷移の履歴を追加する。
					history.pushState({'url':'#' + currentLocation}, '', location.href);
				}
			}
		}
	});
}


/* 
 * 関数名:function chooseOKBeforeCallFunc(message, title, func, arg3, arg2, arg3)
 * 概要  :関数を実行するかどうか確認するダイアログを出す。
 * 引数  :String message:ダイアログに書き出すテキスト。
 * 		:String title:ダイアログのタイトル。
 * 		:function func:OKボタンを押した後にコールされる関数。
 * 		:?	arg1~3:関数の引数。
 * 返却値  :なし
 * 作成者:T.M
 * 作成日:2015.04.13
 * 変更者:T.M
 */
function chooseOKBeforeCallFunc(message, title, func, arg1, arg2, arg3){
	//共通コンテンツのJSONを取得する。
	creator.getJsonFile('source/commonJson.json');
	// ダイアログの本体となるdivタグを生成する。
	creator.outputTag('funcConfirmDialog', 'funcConfirmDialog', 'body');
	$('.funcConfirmDialog:last').text(message);	//ダイアログにテキストを書き込む。
	// 生成したdivタグをjQuery UIのダイアログにする。
	$('.funcConfirmDialog:last').dialog({
		// 幅を設定する。
		width			: '300px',
		// ダイアログを生成と同時に開く。
		autoOpen		: true,
		// Escキーを押してもダイアログが閉じないようにする。
		closeOnEscape	: false,
		//タイトルをつける。
		title:title,
		//ダイアログにクラスを設定する。
		dialogClass		:'confirmDialog',
		// モーダルダイアログとして生成する。
		modal			: true,
		// リサイズしない。
		resizable		: false, 
		// 作成完了時のコールバック関数。
		create:function(event, ui){
			// タイトルバーを見えなくする。
			$('.confirmDialog .ui-dialog-titlebar-close').css('display', 'none');
		},
		// 位置を指定する。
		position:{
			// ダイアログ自身の位置合わせの基準を、X座標をダイアログ中央、Y座標をダイアログ上部に設定する。
			my:'center center',
			// 位置の基準となる要素(ウィンドウ)の中心部分に配置する。
			at:'center center',
			// ウィンドウをダイアログを配置する位置の基準に指定する。
			of:window
		},
		buttons:[	//ボタンを配置する。
		         {
		        	 text:"OK",	//OKボタン
		        	 click:function(event, ui){	//クリック時のコールバック
		        		 func(arg1, arg2, arg3);	//関数をコールする。
		        		 //ダイアログを消す。
		        		 $(this).dialog("close").dialog("destroy").remove()
		        	 }
		         },
		         {
		        	 text:"キャンセル",	//キャンセルボタン
		        	 click:function(event, ui){	//クリック時のコールバック
		        		 //ダイアログを消す。
		        		 $(this).dialog("close").dialog("destroy").remove()
		        	 }
		         }
		]
	});
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
  // jqueryの記述の始まり
	//現在表示中のページのボタン以外に対して
    $(document)
        .on('mouseenter', filterTarget, function() {	// 引数の要素にマウスを乗せた時の処理
            $(this).addClass('active');   				 // 引数の要素にactiveクラスを付与する。
        })
        .on('mouseleave', filterTarget, function() {	// 引数の要素からマウスが離れたときの処理
            $(this).removeClass('active');  			// 引数の要素からactiveクラスを除去する。
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
	//一旦全てのactive,currentクラスを剥奪する。	
	$(filterTarget).removeClass('active');
	$(filterTarget).removeClass('current');
	// 現在のページのボタンの枠に対して、currentクラスを付与する。
	$(filterTarget, document).filter(':has(a[href$="' + currentLocation + '"])').addClass('current');
}

/*
 * イベント名:ajaxStart
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信を開始した後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
//Ajax通信が始まったら
$(document).ajaxStart( function(){
	//ローディング画面を出す。
	callLoadingScreen();
});


/*
 * イベント名:ajaxStop
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :Ajax通信を終えた後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
//Ajax通信が全て終了したら
$(document).ajaxStop( function(){
	//ローディング画面を隠す。
	hideLoadingScreen();
	//選択されたトップメニューの色を変える。
	changeSelectedButtonColor('.topMenu li');
});
/* 以上、ローディング画面呼び出しのイベント登録。 */

/*
 * 関数名:なし
 * 引数  :なし
 * 戻り値:なし
 * 概要  :Ajax通信でのページ読み込みを行っていても、ブラウザバック等の履歴機能を有効にする。
 * 作成日:2015.03.09
 * 作成者:T.Masuda
 */
//popStateに対応できているブラウザであれば
if (isSupportPushState()){
	//popStateのイベントを定義する。
    $(window).on("popstate",function(event){
        //初回アクセスであれば何もしない。
    	if (!event.originalEvent.state){
    		return; // 処理を終える。
    	}
        var state = event.originalEvent.state; 	//stateオブジェクトを取得する。
        currentLocation = state['url'];			//stateから現在のURLを取り出し保存する。
        callPage(state['url'], state);			//履歴からページを読み込む。
  });
}

/*
 * イベント名:load
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :ページの読み込みを終えた後の処理。
 * 作成日　　:2015.03.09
 * 作成者　　:T.Masuda
 */
$(window).on('load', function(){
	//pushStateに対応していれば、pushStateで更新のイベント
	if (isSupportPushState()){
		//初回ロードでなければ
		if (window.history.state){
			//履歴からURLを引き出す
			var currentUrl = window.history.state.url;
			//ページを読み込む。更新なので履歴を積まないために第二引数を入力する。
			callPage(currentUrl, window.history.state);
		}
	//pushStateに対応していなければhashchangeのイベントで更新を行う。
	}else{
		//ハッシュ切り替えイベント発生時の処理
		$(window).bind("hashchange", function(ev){
			//ハッシュが変わっていれば
			if(location.hash) {
				//URLからハッシュを取り出し、変数に格納する。
				var hash = location.hash;
				//該当するページを読み込む。
				callPage(hash);
				//そうでなければ
			} else {
				//画面を更新する。
				location.reload();
			}
		});
		
		//画面遷移でのページ読み込み時点でハッシュがあれば
		if(location.hash) {
			//URLからハッシュを取り出し、変数に格納する。
			var hash = location.hash;
			//該当するページを読み込む。
			callPage(hash);
		//そうでなければ
		}
	}
});

/*
 * 関数名:callPageInTab(url, tabPanel)
 * 概要  :タブパネル内でページを切り替える。
 * 引数  :String url:読み込むhtmlファイルのURL
 * 		 element tabPanel:タブパネルのDOM要素
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function callPageInTab(url, tabPanel){
	//ajax通信を行う
	$.ajax({
		url:url,				//読み込むファイルのURLを指定する。
		dataType:'html',		//htmlのデータを返してもらう。
		async:false,			//同期通信を行う。
		success:function(html, dataType){	//通信に成功したら
			//タブパネル内を書き換える。
			overwrightContent(tabPanel,html);
			creator.json = '';	/* JSONをクリアする。 */
		},
		//通信エラーであれば
		error:function(XMLHttpRequest, textStatus, errorThrown){
			//エラーを通知する。
			alert('通信に失敗しました。時間をあけて試してください。');
		}
	})
}

/*
 * イベント名:$(document).on('click')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :タブパネル内でリンクをクリックしたときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
//表示中のタブパネル内でリンク付きのボタンがクリックされたら
$(document).on('click', '.tabPanel.active button[href]', function(){
	//タブ内でのページの切り替えを行う。
	callPageInTab($(this).attr('href'), $('.tabPanel').has(this));
});


/*
 * 関数名:submitImitateForm(form)
 * 概要  :疑似フォームを送信して画面を切り替える。
 * 引数  :element tabPanel:疑似フォームのDOM要素
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function submitImitateForm(form){
	//フォームのデータを作る。
	var formData = createFormData(form);
	//現在のタブを取得する。
	var activeTabPanel = $('.tabPanel').has(form);
	
	//createTagのインスタンスの連想配列メンバにフォームデータを格納する。
	creator.json['formData'] = formData;
	
	//フォームを送信する先のページに切り替える。
	callPageInTab(form.attr('action'), activeTabPanel);
};

/*
 * 関数名:sendImitateForm()
 * 概要  :疑似フォームを送信して画面を切り替える。ボタンのonclick属性でコールする。
 * 引数  :なし
 * 戻り値:なし
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
function sendImitateForm(form){
	var $form = $(form);	//疑似フォームとなる要素を取得する。
	//フォームのデータを作る。
	var formData = createFormData($form);
	//createTagのフォームデータのメンバを初期化する。
	creator.formData = {};
	//createTagのインスタンスの連想配列メンバにフォームデータを格納する。
	creator.formData['formData'] = formData;

	//フォームを送信する先のページに切り替える。
	callPage($form.attr('action'));
};

/*
 * イベント名:$(document).on('submit', '.imitateForm')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :フォームをsubmitしたときのイベント。
 * 作成日　　:2015.03.26
 * 作成者　　:T.Masuda
 */
//$(document).on('submit', '.imitateForm', function(){
//	event.preventDefault();	//submitイベント本来の画面遷移をキャンセルする。
//	sendImitateForm(this);	//自己定義の関数でフォームの送信を行う。
//});

/*
 * イベント名:$(document).on('click')
 * 引数  　 :なし
 * 戻り値　 :なし
 * 概要  　 :タブパネル内で疑似フォームをサブミット(クリック)したときのイベント。
 * 作成日　　:2015.03.25
 * 作成者　　:T.Masuda
 */
//表示中のタブパネル内で疑似フォームがサブミットされたら
//$(document).on('click', '.imitateForm .submit', function(){
//	//疑似サブミットの処理の関数をコールする。
//	submitImitateForm($('.imitateForm').has(this));
//});

/*
 * イベント:$(document).on('submit', 'form.specialReservedDialog')
 * 引数   :String 'submit':submitイベントに対する処理
 * 　　　　:String 'form.specialReservedDialog':体験予約ダイアログのセレクタ。
 * 戻り値 :なし
 * 概要   :予約ダイアログのフォームがsubmitされたときのイベント。
 * 作成日 :2015.03.31
 * 作成者 :T.M
 */
$(document).on('submit', 'form.specialReservedDialog', function(event){
	//submitイベントをキャンセルする。
	event.preventDefault();
	//フォームのaction属性から送信URLを取得する。
	var url = $(this).attr('action');
	
	//送信するデータを格納する連想配列を作成する。
	var formData = createFormData($(this));
	
	//postメソッドでフォームの送信を行う。
	$.post(url, formData,
	// 成功時の処理を記述する。
	 function(data){
		//フォーム部分を切り出す。
		var $block = $(data).find('blockquote');
		$('link,script', data).remove();
		//取得したページのmainタグ直下の要素をを取得し、mainのタグに格納する。
		$('.specialReservedConfirmDialog').append($block);
		//ページのタイトル部分が不適切なので消しておく。
		$('strong.ttl').remove();
	});
});

/*
 * イベント:$(document).on('submit', '.specialReservedConfirmDialog form')
 * 引数   :String 'submit':フォームのsubmitイベントに対する処理。
 * 　　　　:String '.specialReservedConfirmDialog form':体験予約確認ダイアログのフォームのセレクタ。
 * 戻り値 :なし
 * 概要   :予約ダイアログのフォームがsubmitされたときのイベント。
 * 作成日 :2015.03.31
 * 作成者 :T.M
 */
$(document).on('submit', '.specialReservedConfirmDialog form', function(event){
	//submitイベントをキャンセルする。
	event.preventDefault();
	//フォームのaction属性から送信URLを取得する。
	var url = $(this).attr('action');
	
	//送信するデータを格納する連想配列を作成する。
	var formData = createFormData($(this));
	
	//postメソッドでフォームの送信を行う。
	$.post(url, formData,
		// 成功時の処理を記述する。
		function(){
			//ダイアログを消す。
			$('.specialReservedConfirmDialog').dialog('close').dialog('destroy').remove();
			$('.specialReservedDialog').dialog('close').dialog('destroy').remove();
			//送信完了のダイアログを出す。
			alert('以上の内容でご予約の希望を承りました。\n追ってメールでの連絡をいたします。\n確認のメールがしばらく経っても届かない場合は、入力されたメールアドレスに誤りがある可能性がございます。\nもう一度メールアドレスを入力してご予約の操作を行ってください。');
	});
});

/*
 * イベント:$(document).on('click', '.main .confBackButton')
 * 引数   :String 'click':クリックイベントを登録する。
 * 		 :String '.confBackButton':通常のページでのPostmailの送信確認ページにおけるバックボタン。
 * 戻り値 :なし
 * 概要   :送信確認ページの戻るボタンがクリックされたときのイベント。
 * 作成日 :2015.03.31
 * 作成者 :T.M
 */
$(document).on('click', '.main .confBackButton', function(){
	//戻る。
	history.back();
});

/*
 * イベント:$(document).on('click', '.specialReservedConfirmDialog .confBackButton')
 * 引数   :String 'click':クリックイベントを登録する。
 * 		 :String '.specialReservedConfirmDialog .confBackButton'
 * 　　　　:予約確認ダイアログでのPostmailの送信確認ページにおけるバックボタン。
 * 戻り値 :なし
 * 概要   :送信確認ページの戻るボタンがクリックされたときのイベント。
 * 作成日 :2015.03.31
 * 作成者 :T.M
 */
$(document).on('click', '.specialReservedConfirmDialog .confBackButton', function(){
	//ダイアログを消す。
	$('.specialReservedConfirmDialog').dialog('close').dialog('destroy').remove();
});

/*
 * イベント:$(document).on('click', '.back:not(.tabPanel button)')
 * 引数   :String 'click':クリックイベントを登録する。
 * 		 :String '.back:not(.tabPanel button)':タブパネル外のbackクラスのボタンのセレクタ。
 * 戻り値 :なし
 * 概要   :タブパネル外でbackクラスのボタンがクリックされたときのイベント。
 * 作成日 :2015.04.09
 * 作成者 :T.M
 */
$(document).on('click', '.back:not(.tabPanel button)', function(){
		history.back();	//ブラウザバックを行う。
});