// JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

// createTagコール時の引数として使う定数。
const CREATETAG_FIRST = -1;

function jsonToTag(){
	// JSONデータを格納する変数。
	this.json = null;
	// ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	//パーツのルートのDOMを保存するメンバ
	this.domroot = '';
	/*
	 * 関数名:this.getJsonFile = function((jsonPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getJsonFile = function(jsonPath){
		// 一時的に値を保存する変数tmpを宣言する。
		var tmp;

		// Ajax通信でjsonファイルを取得する。
		$.ajax({
			// jsonファイルのURLを指定する。
			url: jsonPath,
			// 取得するファイルの形式をJSONに指定する。
			dataType: 'JSON',
			// 同期通信を行う。
			async: false,
			// 通信完了時の処理を記述する。
			success: function(json){
				// クラスのメンバjsonに取得したjsonの連想配列を格納する。
				tmp = json;
			},
			// 通信失敗時の処理。
			error:function(){
				// エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});

		// フィールドのメンバのjsonが空であれば
		if(this.json == null){
			// クラスのメンバのjsonにtmpの連想配列を格納する。
			this.json = tmp;
		// 既にJSONが格納されていたら
		} else {
			// 連想配列を連結する。
			this.json = $.extend(tmp,this.json);
		}
	};

	/* 
	 * 関数名:this.getDomFile = function((domPath))
	 * 概要  :JSONファイルを取得して返す。
	 * 引数  :String jsonPath
	 * 返却値  :Object
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getDomFile = function(htmlPath){
		// 一時的に値を保存する変数tmpを宣言する。
		var tmp;
		
		// Ajax通信でjsonファイルを取得する。
		$.ajax({
			// jsonファイルのURLを指定する。
			url: htmlPath,
			// 取得するファイルの形式をJSONに指定する。
			dataType: 'HTML',
			// 同期通信を行う。
			async: false,
			// 通信完了時の処理を記述する。
			success: function(html){
				// クラスのメンバdomに取得したDOMのオブジェクトを格納する。
				tmp = html;
			},
			// 通信失敗時の処理。
			error:function(){
				// エラーのダイアログを出す。
				alert('通信に失敗しました。');
			}
		});
		
		// クラスのメンバのdomにtmpのHTML文字列をオブジェクトに変換して格納する。
		this.dom = $(tmp);
	};

	/* 
	 * 関数名:this.createTag = function(curMapNode, curDomNode)
	 * 概要  :JSON連想配列のキーからタグに値を格納する。
	 * 引数  :Object curMapNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.19
	 */
	this.createTag = function(curMapNode, curDomNode){
		//curDomNodeが-1(初回コール時)であれば
		if(curDomNode == -1){
			var mapNodeKey = curMapNode;	// 次のステップでmapNodeの中身が変わってDOMが取得できなくなるので保存する。
			curMapNode = this.getMapNode(curMapNode);	// マップの先頭を取得する。
			curDomNode = this.getDomNode(mapNodeKey);	// DOMの先頭を取得する。
			this.domroot = curDomNode;					// DOMの先頭を保存する。
		}
		
		//マップ、DOMが取得できていなかったら
		if(curMapNode == null || curDomNode == null){
			// 処理を終える。
			return;
		}
				
		//連想配列に子がいる限りループする。
		for(key in curMapNode){
			var mapNode = curMapNode[key];	//mapNodeの内容をcurMapNode内のmapNodeの参照に切り替える。
			var attribute = false;				//属性値を格納する変数
			
			//mapNodeが配列であれば
			if($.isArray(mapNode)){
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
				curDomNode.attr(key, mapNode);
			}
		}
		
		//mainタグへ作成したパーツを追加する。
		this.domroot.appendTo('.main');
	};
	/* 
	 * 関数名:this.getMap = function(key)
	 * 概要  :JSON連想配列の最上階層からキーに対応した値を取り出す。
	 * 引数  :String key
	 * 返却値  :Object
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getMapNode = function(key){
		// クラスメンバの連想配列からキーに応じた連想配列を返す。
		return this.json[key];
	};

	/* 
	 * 関数名:this.getDom = function(key)
	 * 概要  :キーに対応するHTMLのパーツを返す。
	 * 引数  :String key
	 * 返却値  :jQuery
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getDomNode = function(key){
		// メンバのHTMLからキーに対応した要素を取り出し返す。
		return $('[class="' + key +'"]', this.dom);
	};
	
	/* 
	 * 関数名:this.createTagArray = function(mapNode, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.19
	 */
	this.createTagArray = function(key, mapNode, domNode){
		// 引数にnullがあれば
		if(key == null || mapNode == null || domNode == null){
			// 処理をやめる。
			return;
		}
		
		//keyがtextであれば
		if(key == 'text'){
				this.setTagText(mapNode, domNode);
		//keyが属性であれば
		} else if(key == 'src' || key == "href"){
			//指定された要素に属性値を書き込む。
			this.setTagAttribute(key, mapNode, domNode);
		//箇条書きであれば
		} else{
			//keyでタグを生成する。
			this.setTagText(key, mapNode, domNode);
		}
	}
	
	/* 
	 * 関数名:this.getDomChild = function(key, domNode)
	 * 概要  :リストタイプのタグを配置する。
	 * 引数  :String key, jQuery domNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.19
	 */
	this.getDomChild = function(key, domNode){
		//domNodeの子の階層からkeyを持つノードを取得する。
		domNode = $('.' + key, domNode);
		//DOMの取得に失敗したら
		if(domNode[0] == null){
			//domNodeにnullを入れる。
			domNode = null;
		}
		
		//domNodeを返す。
		return domNode;
	}
	
	/* 
	 * 関数名:this.setTagText = function(mapNode, domNode)
	 * 概要  :タグにテキストをセットする。
	 * 引数  :Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.20
	 */
	this.setTagText = function(mapNode, domNode){
		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//指定された要素にテキストを書き込む。
			$(domNode[i]).append(mapNode[i]);
		}
	}
	
	/* 
	 * 関数名:this.setTagAttribute = function(key, mapNode, domNode)
	 * 概要  :タグに属性値をセットする。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.20
	 */
	this.setTagAttribute = function(key, mapNode, domNode){
		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//指定された要素に属性値を書き込む。
			$(domNode[i]).attr(key, mapNode[i]);
		}
	}
	
	/* 
	 * 関数名:this.setTagText = function(mapNode, domNode)
	 * 概要  :タグにテキストをセットする。
	 * 引数  :String key, Object mapNode, jQuery domNode
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.20
	 */
	this.setTagText = function(key, mapNode, domNode){
		//mapNodeの配列分ループする。
		for(var i = 0; i < mapNode.length; i++){
			//keyでタグを生成する。
			$(domNode[i]).append($('<'+ key +'></'+key+'>').text(mapNode[i]));
		}
	}
	
}
