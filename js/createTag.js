// JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

function jsonToTag(){
	// JSONデータを格納する変数。
	this.json = null;
	// ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	// jsonの層を下る際に、親を記録していくための配列。
	this.parentKeyArray = [];
	// 取り扱うDOMの属性名の表の配列。コピーして何度も使うのでOriginalという名を付ける。
	this.argArrayOriginal = ['class', 'id', 'name', 'src','height', 'width',
	                 'colspan','rowspan','href','alt', 'action', 'method',
	                 'title','type','value', 'action', 'cols', 'rows', 'required', 'checked'];
	// DOMの属性名の表の配列を格納する配列。確認するごとに対応する配列の要素を消していく。
	this.parentArgArray = [];
	
	// 

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
		var curAttribute = this.getDom(key);
		// DOMの先頭をセットする。
		var startdom = curAttribute;
		// タグのルート部分をrootdomに保存する。作成したHTMLのパーツを実際に追加するのに使う。
		var rootdom = curAttribute;
		// parentArgArrayを初期化する。
		this.getKeyFirst();
		
		// ループ開始時に連想配列を取得する。ループするごとに連想配列のポインタを次へ進め、全て走査し終えれば終了する。
		for(var curkey = this.getMap(key); curkey != null; curkey = this.getKeyNext(curkey)){
			
			// 始めのキー名を保存する変数を宣言する。
			var keyname = "";
			
			// for文で先頭のキーの文字列を取得する。
			for(keyname in curkey){
				
				// キーを配列に順次格納する。
				if(keyname != null){
					// ループを抜ける。
					break;
				}
			}
			
			// 現在指すタグのクラスからDOMを取得し、curAttributeに代入する。
			curAttribute = $(startdom).getAttributeNode(keyname);
			
			// DOMが取得できなかったら
			if(curAttribute.length <= 0){
				// 異常値をrefに代入する。
				ref = 0;
				// ループを終える。
				break;
			}
			
			// 現在指すDOMがクラスであれば
			if(curAttribute.name == "class"){

				// DOMの位置を動かす。
				startdom = $('.' + curkey["class"]);
				
				// curkeyにテキストがあれば
				if('text' in curkey){
					// テキストを追加する。
					startdom = this.setTagText(startdom, curkey['text']);
				}
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
		
		// parentArgArrayに初期値を加える。
		this.parentArgArray[0] = this.argArrayOriginal.concat();
		
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
	 * 引数  :jQuery startdom, Array text
	 * 返却値  :jQuery
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 */
	this.setTagText = function(startDom,text){
		// textがあれば
		if(text !== void(0)){
			// textが要素数2以上であれば
			if(text.length > 1){
				// 同じクラスを持つ要素に順次テキストを流し込んでいく。
				$('.'+startDom.attr("class") +' > th,td,li', this.dom).each(function(i){
					// テキストを順番に流し込んでいく。
					$(this).append(text[i]);
				});
				// startDomの位置を最後の要素にずらす。
				startDom = $('.' + startDom.attr('class') + ':last');
			// そうでなければ
			} else {
				// タグにテキストを書き込む。
				startDom.append(text);
			}
		}
		
		// startDomを返す。
		return startDom;
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
		// キーの値が配列であれば
		if(key[argArrayOriginal[this.argArrayOriginal.length 
             		              - this.parentArgArray[this.parentArgArray.length - 1].length]].isArray()){
			// startdomのクラスの要素を走査する。
			startdom.each(function(i){
				// startdomの要素に対し、キーの値の配列の属性値を順番にセットしていく。
				$(this).attr(argArrayOriginal[this.argArrayOriginal.length 
	                    		              - this.parentArgArray[this.parentArgArray.length - 1].length],
	                    		              key[argArrayOriginal[this.argArrayOriginal.length 
	                                            		              - this.parentArgArray[this.parentArgArray.length - 1].length]][i])
			});
		// キーの値が単一の値であれば
		} else {
		// タグに現在指すDOMのノードの属性値をセットする。
		startdom.attr(argArrayOriginal[this.argArrayOriginal.length 
                    		              - this.parentArgArray[this.parentArgArray.length - 1].length],
		              key[argArrayOriginal[this.argArrayOriginal.length 
                        		              - this.parentArgArray[this.parentArgArray.length - 1].length]]);
		}
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
			// 子がいれば、加えて箇条書きでなければ
			if('array' in key){
				// 子キーが配列であれば
				if(key["array"].length){
					// カレントkeyを親として保存する。
					this.parentKeyArray.push(key);
					//属性格納配列の配列に新たに属性格納配列を加える。
					this.parentArgArray.push(this.getYoungerFirst());
					// 子を取得する。
					key = key["array"][0];

					// 子の属性格納配列用意する。
					// argArrayを作る。
					
					// ループを抜ける。
					break;
				}
			}
			// 弟がいれば
			if(key = this.getYoungerNext(key)){
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
				key = this.getYoungerNext(key);
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
		var argArray = this.parentArgArray[this.parentArgArray.length - 1];
		
		// 属性格納配列がある限りループ
		for(var i = 0; i < argArray.length; i++){
			// keyにargArrayに該当する値がある
			if(argArray[i] in key){
				// keyを返す。
				retKey = key;
//				retKey = key[argArray[i]];
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
