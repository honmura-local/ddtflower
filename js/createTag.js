//JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

//createTagコール時の引数として使う定数。
CREATETAG_FIRST = -1;

function createTag(){
	//JSONデータを格納する変数。
	this.json = null;
	//ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	
	/*
	 * 関数名:this.getJsonFile = function((jsonPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getJsonFile = function(jsonPath){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;

		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: jsonPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'JSON',
			//同期通信を行う。
			async: false,
			//通信完了時の処理を記述する。
			success: function(json){
				//クラスのメンバjsonに取得したjsonの連想配列を格納する。
				tmp = json;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});

		//フィールドのメンバのjsonが空であれば
		if(this.json == null){
			//クラスのメンバのjsonにtmpの連想配列を格納する。
			this.json = tmp;
		//既にJSONが格納されていたら
		} else {
			//連想配列を連結する。
			this.json = $.extend(tmp,this.json);
		}
	};

	/* 
	 * 関数名:this.getDomFile = function((domPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getDomFile = function(htmlPath){
		//一時的に値を保存する変数tmpを宣言する。
		var tmp;
		
		//Ajax通信でjsonファイルを取得する。
		$.ajax({
			//jsonファイルのURLを指定する。
			url: htmlPath,
			//取得するファイルの形式をJSONに指定する。
			dataType: 'HTML',
			//同期通信を行う。
			async: false,
			//通信完了時の処理を記述する。
			success: function(html){
				//クラスのメンバdomに取得したDOMのオブジェクトを格納する。
				tmp = html;
			},
			//通信失敗時の処理。
			error:function(){
				//エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});
		
		//クラスのメンバのdomにtmpのHTML文字列をオブジェクトに変換して格納する。
		this.dom = $(tmp);
	};

	/* 
	 * 関数名:this.outputTag = function(key, domNodeName, appendTo)
	 * 概要  :キーからパーツを。
	 * 引数  :String key, String domNodeName, String appendTo
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.20
	 * 変更者:T.Masuda
	 * 変更日:2015.03.10
	 * 内容　:第三引数appendToを追加しました。指定した先にタグを挿入します。
	 */
	this.outputTag = function(key, domNodeName, appendTo){
		//domNodeNameがundefined(未入力)であれば、キー名をdomNodeNameにする。
		domNodeName = domNodeName === undefined ? key : domNodeName;
			
		//JSONの先頭のキーの連想配列と、DOMの先頭を取得する。
		mapNode = this.getMapNode(key);			//マップの先頭を取得する。
		domNode = this.getDomNode(domNodeName);	//DOMの先頭を取得する。

		// createTagでキーに対応したHTMLのパーツを作成し、変数tagに格納する。
		var tag = this.createTag(mapNode, domNode);
		// パーツの作成に成功したならば
		if(tag != null){
			//@mod 2015.03.10 T.Masuda 第三引数appendToに対応しました。
			//appendToが入力されていれば
			if(appendTo != null){
				//appendで、作成したタグをappendToに追加する。
				$(appendTo).append(tag);
			//appendToが空であれば	
			} else {
				//appendで作成したタグをmainに追加する。
				$('.main').append(tag);
			}
			//@mod 2015.03.10 T.Masuda ここまで変更しました。
		// パーツの作成に失敗したならば
		} else{
			//失敗のメッセージダイアログを出す。
			console.log(key + 'の作成に失敗しました。');
		}
	}	
	
	/* 
	 * 関数名:this.createTag = function(curMapNode, curDomNode)
	 * 概要  :JSON連想配列のキーからタグに値を格納する。
	 * 引数  :Object curMapNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 修正者:T.Masuda
	 * 修正日:2015.02.19
	 * 内容　:2015.03.05
	 */
	this.createTag = function(curMapNode, curDomNode){
		
		//マップ、DOMが取得できていなかったら
		if(curMapNode == null || curDomNode == null){
			//処理を終える。
			return null;
		}
				
		//連想配列に子がいる限りループする。
		for(key in curMapNode){
			var mapNode = curMapNode[key];	//mapNodeの内容をcurMapNode内のmapNodeの参照に切り替える。
			var attribute = false;				//属性値を格納する変数
			
			//キーがtextであれば
			if(key == 'text'){
				//curDomにテキストtextメソッドで追加する。
				curDomNode.text(mapNode);
			//キーがHTMLであれば
			} else if(key == 'html'){
				//curDomにテキストをhtmlメソッドで追加する。
				curDomNode.html(mapNode);
			//mapNodeが配列であれば
			} else if($.isArray(mapNode)){
				//キー名でタグを作成し、そのテキストにキー値をセットする。
				this.createTagArray(key, mapNode, curDomNode);
			//mapNodeが子であれば
			} else if(typeof mapNode == 'object'){
				//カレントの子DOMノードからkeyを持つDOMノードを取得する。
				var domNode = this.getDomChild(key, curDomNode);
				//domNodeがnullでなければ
				if(domNode){
					//子ノードへ再帰する。
					this.createTag(mapNode, domNode);
				}
			//curDomNodeのAttribute配列からmapNodeのキー値を持つノードを取得する。
			} else if(attribute = curDomNode[0].getAttributeNode(key)){
				//取得したノードにmapNodeの値をセットする。
				attribute.value = mapNode;
			}
		}
		
		//curDomNodeを返す。
		return curDomNode;
	};
	
	/* 
	 * 関数名:this.getMapNode = function(key)
	 * 概要  :JSON連想配列の最上階層からキーに対応した値を取り出す。
	 * 引数  :String key
	 * 返却値  :Object
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 */
	this.getMapNode = function(key){
		//クラスメンバの連想配列からキーに応じた連想配列を返す。
		return this.json[key];
	};

	/* 
	 * 関数名:this.getDomNode = function(key)
	 * 概要  :キーに対応するHTMLのパーツを返す。
	 * 引数  :String key
	 * 返却値  :jQuery
	 * 作成者:T.Masuda
	 * 作成日:2015.02.12
	 * 変更者:T.Masuda
	 * 変更日:2015.03.04
	 * 内容  :テンプレートのHTMLそのものではなく、コピーを返す様に変更しました。
	 */
	this.getDomNode = function(key){
		//メンバのHTMLからキーに対応した要素をコピーして返す。
		return $($('[class="' + key +'"]', this.dom).clone(false));
	};
	
	/* 
	 * 関数名:this.createTagArray = function(mapNode, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 変更者:T.Masuda
	 * 変更日:2015.03.06
	 * 内容　:本来想定されていた動作に修正されました。
	 */
	this.createTagArray = function(key, mapNode, domNode){
		//domNodeのキーの要素を取得する。
		domNode = this.getDomChild(key, domNode); 
		
		//引数にnullがあれば
		if(key == null || mapNode == null || domNode == null){
			//処理をやめる。
			return;
		}
		
		//不足しているタグの個数を算出する。
		var clones = mapNode.length - 1;
		//domNodeを必要な分コピーする。
		for(var i = 0; i < clones; i++){
			//1個目のmapNodeの後ろに自身のコピーを追加する。
			$(domNode[0]).after($(domNode[0]).clone(false));
		}

		//domNodeの兄弟要素を全て取得する。
		
		
		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//keyでタグを生成する。
			$(domNode).text(mapNode[i]);
			//domNodeを次に移動する。
			domNode = $(domNode).next();
		}
	}

	/* 
	 * 関数名:this.getDomChild = function(key, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, jQuery domNode
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.02.19
	 * 変更者:T.Masuda
	 * 変更日:2015.03.06
	 * 内容　:タグに対応しました。
	 */
	this.getDomChild = function(key, domNode){
		var domNodeReturn;							//domNodeの返却用変数を作る。
		var domNodeReturn = $('.' + key, domNode);	//domNodeの子の階層からkeyのクラスを持つノードを取得する。
		//DOMの取得に失敗したら
		if(domNodeReturn[0] == null){
			//domNodeの子の階層からkeyのタグ名を持つノードを取得する。
			domNodeReturn = $(key, domNode);
		}
		
		//domNodeReturnを返す。
		return domNodeReturn;
	}

	
	/* 
	 * 関数名:this.createNumbering = function(jsonName, startPage, displayNum)
	 * 概要  :ブログページのナンバリング(ページャ)を作る。
	 * 引数  :String jsonName, int startPage, int displayNum
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.createNumbering = function(jsonName, startPage, displayNum, displayPage){
		//ページ数を取得する。
		var num = this.getJsonObjectNum(jsonName);
		
		//ページ数が1以下ならナンバリングを作成せずに終了する。
		if(pageNum <= 1){
			return;
		}
		
		//ナンバリングオブジェクトを作成する。preをキーとした連想配列を作成し、格納する。
		var numbering = {
									'pre':{				
										'text':'<<', 	//textを左の矢にし
										//clickイベントを設定する。
										'onclick':'outputNumberingTag(' + startPage +','+ displayNum + ',' + displayPage +')' 
										}
								};
		// <<ボタンを作る。
		createNumberingAround(numbering, 'pre', startPage, num);
		
		//ナンバリングの中の最後の数字を算出して変数に格納する。
		var lastNum = startPage + displayNum;
		
		//for文でナンバリングを必要なだけ作る。
		for(var i = startPage; i < lastNum; i++){
			var iText = i.toString();//iの数値を文字列にする。
			var map = {iText:{}};	//ページ数をキーとしたオブジェクトを生成する。
			
			//"text"キーにページ数を設定する。
			map[iText]['text'] = i;
			//関数実行属性にoutputTagを設定する。
			map[iText]['onclick'] = 'outputTag(' + i +')';
			//numberingオブジェクトの中に、作成したオブジェクトを追加する。
			numbering[iText] = map[iText];
		}
		
		// <<ボタンを作る。
		createNumberingAround(numbering, 'next', startPage, num);
		
		//メンバjsonオブジェクトにnumberingオブジェクトを追加する。
		this.json['numbering'] = numbering;
		//numberingオブジェクトを返す。
		return numbering;
	}
	
	/* 
	 * 関数名:this.outputNumbering = function(startPage, displayNum, displayPage)
	 * 概要  :ナンバリングと、それに応じたブログのページを作る。
	 * 引数  :int startPage, int displayNum, int displaiedPage
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.outputNumbering = function(startPage, displayNum, displayPage){
		//ナンバリング用のJSONを作る。
		this.createNumbering(jsonName, startPage, displayNum, displayPage);
		
		//コンテンツ表示
		this.outputTag(displayPage);
		
		//ナンバリング用Tagを表示する。
		this.outputTag('numbering');
	}

	/* 
	 * 関数名:this.createNumberingAround = function(numbering, key, startPage, num)
	 * 概要  :ナンバリングの<<、>>を作る。
	 * 引数  :object numbering, string key, int startPage, int num
	 * 返却値  :なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.03.12
	 */
	this.createNumberingAround = function(numbering, key, startPage, num){
		//numが1以下であれば
		if(num){
			return;	//処理を行わない。
		}
		
		var keyObj = {key:{}};	//keyオブジェクトを生成する。
		//有効属性をONにする。
		keyobj[key]['enable'] = 'on';
		
		//関数実行属性をoutputNumberingTagに設定する。
		keyobj[key]['onclick'] = 'outputNumberingTag(' + startPage +','+ num + ',' + num +')';
		
		//numberingオブジェクトの中に追加する。
		numbering[key] = keyobj[key];
	}
}