// JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

function jsonToTag(){
	// JSONデータを格納する変数。
	this.json = null;
	// ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	// jsonの層を下る際に、親を記録していくための配列。
	this.parentKeyArray = [];
	// 取り扱うDOMの属性名の表の配列。コピーして何度も使うのでOriginalという名を付ける。
	this.argArrayOriginal = ['class', 'text', 'id', 'name', 'height', 'width',
	                 'colspan','rowspan','href','src','alt',
	                 'title','type','value'];
	// DOMの属性名の表の配列。確認するごとに対応する要素を消していく。
	this.argArray = argArrayOriginal.concat;

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
	 * 関数名:this.createTag = function(key)
	 * 概要  :JSON連想配列のキーからタグを作成する。
	 * 引数  :String key
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.createTag = function(key){
		
		// キーに対応するJSONの連想配列を取得する。
		var curdom = this.getDom(key);
		// カレントのDOMと開始時のDOMを同じにする。
		var startdom = curdom;
		// タグのルート部分をrootdomに保存する。
		var rootdom = curdom;
		
		// ループ開始時に連想配列を取得する。ループするごとに連想配列のポインタを次へ進め、全て走査し終えれば終了する。
		for(var curkey = this.getMap(key); curkey != null; curkey = this.getNextKey(curkey)){
			
			// 現在指すタグのクラスからDOMを取得し、curdomに代入する。
			curdom = $('.' + startdom.attr("class") +'[' + this.argArrayOriginal[this.argArrayOriginal.length 
			                                               		              - this.parentArgArray[this.parentArgArray.length - 1].length] + ']', this.dom);
			
			// DOMが取得できなかったら、またはキーがクラス名でなければ
			if(curdom.length <= 0 && $('.' + startdom.attr('class'), this.dom).has(':not(.' + this.argArrayOriginal[this.argArrayOriginal.length 
			                                                                                  		              - this.parentArgArray[this.parentArgArray.length - 1].length] + ')').length <= 0){
				// 異常値をrefに代入する。
				ref = 0;
				// ループを終える。
				break;
			}
			
			// 現在指すDOMがクラスであれば
			if(curdom.length <= 0){
				// テキストを追加する。
				this.setTagText(startdom, curkey[1]['text']);
				// DOMの位置を次に進める。
				this.traverseDom(startdom);
			// 現在指すDOMがクラス以外であれば
			} else {
				// 属性値をセットする。
				this.setAttrText(startdom, curkey);
			}
		}
		
		// タグをmainのタグに追加する。
		$(".main").append(rootdom);
	};
	
	/* 
	 * 関数名:this.getMap = function(key)
	 * 概要  :JSON連想配列の最上階層からキーに対応した値を取り出す。
	 * 引数  :String key
	 * 返却値  :Object
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getMap = function(key){
		// 返却値を格納する変数を宣言する。
		var retArray = null;
		// メンバのjson連想配列のトップの連想配列を走査する。
		for(var i = 0; i < this.json.length;i++){
			// クラスがキーと一致していれば
			if(this.json[i]["class"] == key){
				// retArrayに該当する連想配列を格納する。
				retArray = this.json[i];
				// ループを終了する。
				break;
			}
		}
		// retArrayを返す。
		return retArray;
	};
	
	/* 
	 * 関数名:this.getDom = function(key)
	 * 概要  :キーに対応するHTMLのパーツを返す。
	 * 引数  :String key
	 * 返却値  :jQuery
	 * 作成者:T.M
	 * 作成日:2015.02.12
	 */
	this.getDom = function(key){
		// メンバのHTMLからキーに対応した要素を取り出し返す。
		return $('[class="' + key +'"]', this.dom);
	};
	
	
	/* 
	 * 関数名:this.setTagText = function(startDom,text)
	 * 概要  :タグにテキストをセットする。
	 * 引数  :jQuery startdom, String text
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 */
	this.setTagText = function(startDom,text){
		// textがあれば
		if(text !== void(0)){
			// タグにテキストを書き込む。
			startDom.append(text);
		}
	};
	
	/* 
	 * 関数名:this.setAttrText(startdom, key)
	 * 概要  :指定したタグに属性を追加する。
	 * 引数  :jQuery startdom, String key
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 */
	this.setAttrText = function(startdom, key){
		// タグに現在指すDOMのノードの属性値をセットする。
		startdom.attr(this.argArrayOriginal[this.argArrayOriginal.length 
		              - this.parentArgArray[this.parentArgArray.length - 1].length],
		              key);
	};

	/* 
	 * 関数名:this.getKeyNext = function(key)
	 * 概要  :次のキーを取得する。。
	 * 引数  : Object key 
	 * 返却値  :Object or null
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 * 変更者:T.M
	 * 変更日:2015.02.16
	 * 内容  :構成を一新。
	 */
	this.getKeyNext = function(key){
		// 子か弟がいる限りループする
		for(;key;){
			// 子がいれば
			if('array' in key){
				// 子キーが配列であれば
				if(key["array"].length){
					// カレントkeyを親として保存する。
					this.parentKeyArray.put(key);
					//属性格納配列を初期値に戻す。
					this.parentArgArray.put(getYoungerFirst());
					// 子を取得する。
					key = key["array"][0];

					// 子の属性格納配列用意する。
					// argArrayを作る。
					
					
					// ループを抜ける。
					break;
				}
			}
			// 弟がいれば
			if(key = getKeyYoungerNext(key)){
				// ループを抜ける。
				break;
			}
			// 親がいれば
			if(this.parentKeyArray.length > 0){
				
				// 親のキーを取得する。その際に先頭のキーを走査済みのキーとして削除する。
				key = this.parentKeyArray.splice(-1,1);
				//親の属性値配列の末尾のものを消す。
				this.parentArgArray.splice(-1,1);
				
				// 弟がいるならば弟のキーを返し、無い場合はnullを返す。
				key = getKeyYoungerNext(key);
			}
		}
		
		// keyを返す。
		return key;
	}
	
	/* 
	 * 関数名:this.getYoungerFirst = function()
	 * 概要  :属性値格納配列を返す。
	 * 引数  :なし 
	 * 返却値  :Array
	 * 作成者:T.M
	 * 作成日:2015.02.16
	 */
	this.getYoungerFirst = function(){
		// argArrayOriginalを値渡しで返す。
		return this.argArrayOriginal.concat();
	};
	
	/* 
	 * 関数名:this.getYoungerNext = function(key)
	 * 概要  :弟のキーを取得する。できなければnullを返す。
	 * 引数  :Object key 
	 * 返却値  :String or null
	 * 作成者:T.M
	 * 作成日:2015.02.16
	 */
	this.getYoungerNext = function(key){
		// 返却値を格納する変数retkeyを宣言、nullで初期化する。
		var retKey = null;
		// 最後尾の親のargArrayの参照をargArrayに渡す。
		var argArray = this.parentArgArray[parentArgArray.length - 1];
		
		// 属性格納配列がある限りループ
		for(var i = 0; argArray.length; i++){
			// keyにargArrayに該当する値がある
			if(key[argArray[i]] !== void[0]){
				// keyを返す。
				retkey = key[argArray[i]];
				// argArrayから該当する要素を削除する。
				argArray.splice(i,1);
				// ループを抜ける
				break;
			}
		}
			
		// retKeyを返す。
		return retKey;
	}
	
	/* 
	 * 関数名:this.mapLength = function(map)
	 * 概要  :連想配列の要素数をカウントして返す。
	 * 引数  :Object map
	 * 返却値  :int
	 * 作成者:T.M
	 * 作成日:2015.02.16
	 */
	this.mapLength = function(map){
		// カウント用変数を用意する。
		var count = 0;
		// 引数に取った連想配列のキーを順次取り出す。
		for(key in map){
			// カウンターを1つ回す。
			count++; 
		}
		
		// カウントを返す。
		return count;
	}
	
	/* 
	 * 関数名:this.traverseDom = function(dom)
	 * 概要  :DOMを次に進める。
	 * 引数  :jQuery dom
	 * 返却値  :jQuery
	 * 作成者:T.M
	 * 作成日:2015.02.16
	 */
	this.traverseDom = function(dom){
		// 返却値となるdomの変数を宣言
		var retdom;
		
		// domが子要素を持っている
		if(dom.children().length > 0){
			// タグを子要素に移動する。
			retdom = $(':first-child', dom);
		// domに弟要素があれば
		} else if(dom.next() != null){
			// 処理対象のDOMを弟要素に切り替える。
			retdom = dom.next();
		// domの親に弟要素があれば
		} else if(dom.parent().next() != null){
			// domの親の弟要素に移る。
			retdom = dom.parent().next();
		// DOMがなくなったら
		} else {
			// domにnullを入れる。
			retdom = null;
		}
		
		// retdomを返す。
		return retdom;
	}

	/* 
	 * 関数名:this.mapLength = function(map)
	 * 概要  :parentKeyArrayを初期化する。
	 * 引数  :なし
	 * 返却値  なし
	 * 作成者:T.M
	 * 作成日:2015.02.16
	 */
	this.getKeyFirst = function(){
		// parentKeyArrayを初期化する。
		this.parentKeyArray = [];
	}
}
