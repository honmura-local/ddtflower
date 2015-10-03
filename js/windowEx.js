/** ファイル名:windowEx.js
 * 概要　　　:ダイアログ内コンテンツ作成、要素操作のためのクラスのための基底クラスの定義ファイル
 * 設計者　:H.Kaneko
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:dialog/js/windowEx.js
 */

/** クラス名:windowEx
 * 概要　:ウィンドウ(ページ)を示すクラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */
function windowEx(url, argumentObj, returnObj){

	//親クラスのコンストラクタを起動する
	baseWindow.call(this, url, argumentObj, returnObj);
	
	/* 関数名:load
	 * 概要　:URLのHTMLファイルを取得してメンバに保存する。
	 * 引数　:String: domUrl:取得するHTMLファイルのパス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.load = function(domUrl){
		//クラスインスタンスへの参照を変数に格納しておく。
		var tmpThis = this;
		
		//Ajax通信でURLからHTMLを取得する。
		$.ajax({
			url:domUrl,				//URLを設定する
			dataType:'HTML',		//HTMLデータを取得する
			async: false,			//同期通信を行う
			cache: true,			//通信結果をキャッシュする
			success:function(html){	//通信成功時
				//DOMをクリアする
				tmpThis.dom = EMPTY_STRING;	
				//取得したhtmlデータをメンバに格納する。
				tmpThis.dom = html;
			},
			error:function(xhr, status, e){	//通信失敗時
				throw e;			//例外を投げる。エラーオブジェクトを渡す。
			}
		});
	}

	/* 関数名:run
	 * 概要　:ウィンドウを生成して表示する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.run = function(){
		var dirArray = this.url.split('/');	//URLをディレクトリ、ファイルに分解する
		//ウィンドウ名(windowフォルダ直下のディレクトリ名)を格納する変数を用意する
		var windowName;						
		//通常ページでなければ
		if(dirArray.length > 1){
			//ディレクトリ名を取得する
			windowName = dirArray[dirArray.length - 3];
		//通常ページであれば
		} else {
			//通常ページウィンドウとなる
			windowName = 'usuall';
		}
		
		//各トップページのURLを取得する
		var topUrl = TOP_PAGES[windowName];

		//argumentObj、returnObjが空であればデフォルトのものを使う
		this.argumentObj = Object.keys(this.argumentObj).length? this.argumentObj: this.defaultArgumentObj;
		this.returnObj = Object.keys(this.returnObj).length? this.defaultReturnObj: this.defaultReturnObj;
		
		this.load(topUrl);					//HTMLファイルをロードする
		//ウィンドウのDOMを追加する
		$(STR_BODY).append(this.dom);
		this.runInit();						//run後の初期化処理を行う
	}

	/* 関数名:runInit
	 * 概要　:run後の初期化処理
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0921
	 * 作成者　:T.Masuda
	 */
	this.runInit = function(){
		this.dom = $('.window:last')[0];	//クラスインスタンスにウィンドウのDOMへの参照を持たせる
		this.dom.instance = this;			//DOM側にもクラスインスタンスへの参照を持たせる
		this.bindAnchor();					//同ウィンドウ内のaタグのコールバックの対象を同ウィンドウ内のものにしぼる
		
		//ログインダイアログが出ていなければ
		if(!$('.inputArea').length){
			this.callPage(this.url);			//URLを読み込む
		}
		this.setWindowZIndex();				//ウィンドウの重なりを整理する
		commonFuncs.showCurrentWindow();	//最前部のウィンドウのみ表示する
	}
	
	
	
	/* 関数名:setWindowZIndex
	 * 概要　:ウィンドウの重なりを整理する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0921
	 * 作成者　:T.Masuda
	 */
	this.setWindowZIndex = function(url){
		var windows = $('.window');	//全てのウィンドウを取得する
		//ウィンドウの数を取得する
		var windowsLength = windows.length;
		
		//全ウィンドウを走査する
		for(var i = 0; i < windowsLength; i++){
			//ウィンドウをのZ座標を指定していく
			$(windows[i]).css('z-index', (i + 1) * 500);
		}
	}
	
	/* 関数名:destroy
	 * 概要　:ウィンドウをを破棄する。
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0729
	 * 作成者　:T.Masuda
	 */
	this.destroy = function(){
		$(this.dom).remove();	//自身のDOMを消す
	}


	/* 関数名:callPage
	 * 概要　:自身のウィンドウにDOMをロードする
	 * 引数　:String url:DOMのURL
	 * 返却値:なし
	 * 作成日　:015.08.17
	 * 作成者　:T.Masuda
	 */
	/*
	 * 関数名:callPage(url, state)
	 * 引数  :String url, Object state
	 * 戻り値:なし
	 * 概要  :新たにページを読み込む。
	 * 作成日:2015.09.21
	 * 作成者:T.M
	 */
	this.callPage = function(url, state){
		//urlから#を抜き取り、有効なURLを形成する。
		url = url.replace(/#/g, '');

		var splited = url.split('/');	//URLを/区切りで配列にする。
		//通常ページに重なるページが読み込まれるなら(会員・管理者画面)
		if(splited.length > 2
				//既に該当するウィンドウがあるなら生成しない
				&& $('.window').filter('[name="'+ splited[splited.length - 3] +'"]').length == 0){
			//新たなウィンドウのクラスインスタンスを生成する
			var newWindow = new windowEx(url);
			newWindow.run();	//新たなウィンドウを表示する
			return;
		}
		
		//cgiなら
		if(url.indexOf('.cgi') > -1){
			//フォーム用の処理を行う。
			postForm($('<form></form>').attr({action: url,method:'post',state:url}));
			return;	//処理を終える。
		}
		
		var self = this;	//コールバック内でクラスインスタンスを参照するために変数に保存しておく
		
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
				//既存のコンテンツを上書きする。
				overwrightContent($('.main', self.dom), html);
				//カレントのURLを更新する。
				currentLocation = url;

				//第二引数が入力されていなければ、また、pushStateに対応していれば
				//@mod 2015.0604 T.Masuda 1つ目の条件式のtrue条件に || state == null を追加しました
				//@mod 2015.0922 T.Masuda argumentObjの初回実行フラグの状態・存在を条件に追加しました。
				if(((state === void(0) || state == null) && commonFuncs.isSupportPushState()) && !commonFuncs.checkEmpty(self.argumentObj.config.firstExec)){
					//画面遷移の履歴を追加する。
					history.pushState({'url':'#' + currentLocation}, '', location.href);
				}
				
				self.argumentObj.config.firstExec = null;	//初回実行フラグをオフにする

				//スクロール位置をトップに戻す。
				window.scroll(0, 0);
			}
		});
	}
	
	/* 関数名:bindAnchor
	 * 概要　:aタグクリック時のイベントコールバックを自身のダイアログにバインドする
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.09.21
	 * 作成者　:T.Masuda
	 */
	this.bindAnchor = function(){
		//自身の配下のaタグクリックイベントコールバックを定義する

		// リンクをクリックした後のイベント。新規タブを開くリンクについては処理しない。
		$(this.dom).on('click', 'a[href$=".html"][target!="_blank"]', function(event){
			//URLを引数にしてページを切り替える関数をコールする。
			$(this).closest('.window')[0].instance.callPage($(this).attr('href'));
			//pushState対応ブラウザであれば
			if(commonFuncs.isSupportPushState()){
				//通常の画面遷移をキャンセルする。		
				event.preventDefault();
			}
		});

		// リンクをクリックした後のイベント。新規タブを開くリンクについては処理しない。
		$(this.dom).on('click', 'a[href$=".php"][target!="_blank"]', function(event){
			//URLを引数にしてページを切り替える関数をコールする。
			$(this).closest('.window')[0].instance.callPage($(this).attr('href'));
			//pushState対応ブラウザであれば
			if(commonFuncs.isSupportPushState()){
				//通常の画面遷移をキャンセルする。		
				event.preventDefault();
			}
		});
	}

}

//baseWindowクラスを継承する
windowEx.prototype = new baseWindow();
//サブクラスのコンストラクタを有効にする
windowEx.prototype.constructor = baseWindow;
