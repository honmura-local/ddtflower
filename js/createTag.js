// JSONとHTMLのパーツのひな形から、HTMLのパーツを作り上げる関数群。

function jsonToTag(){
	// JSONデータを格納する変数。
	this.json = null;
	// ひな形のHTMLのDOMを格納する変数。
	this.dom = '';
	
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
		
		// ループ開始時に連想配列を取得する。ループするごとに連想配列のポインタを次へ進め、全て走査し終えれば終了する。
		for(var curkey = [this.json, this.getMap(key), this.getKeyList(this.json[key]), 0];
			curkey[1] != null && startdom != null; curkey = this.getNextKey(curkey)){
			
			// 現在指すタグのクラスからDOMを取得し、curdomに代入する。
			curdom = $('.' + startdom.attr("class") +'[' + curkey[2][curkey[3]] + ']', this.dom);
			
			// DOMが取得できなかったら、またはキーがクラス名でなければ
			if(curdom.length <= 0 && $('.' + startdom.attr('class'), this.dom).has(':not(.' + curkey[2][curkey[3]] + ')').length <= 0){
				// 異常値をrefに代入する。
				ref = 0;
				// ループを終える。
				break;
			}
			
			// 現在指すDOMがクラスであれば
			if(curdom.length <= 0){
					// テキストを追加する。
					this.setTagText(startdom, curkey[1]['text']);
				// startdomが子要素を持っている
				if(startdom.children().length > 0){
					// タグを子要素に移動する。
					startdom = $(':first-child', startdom);
				// startdomに弟要素があれば
				} else if(startdom.next() != null){
					// 処理対象のDOMを弟要素に切り替える。
					startdom = startdom.next();
				// startdomの親に弟要素があれば
				} else if(startdom.parent().next() != null){
					// startdomの親の弟要素に移る。
					startdom = startdom.parent().next();
				// DOMがなくなったら
				} else {
					// startdomにnullを入れる。
					startdom = null;
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
		// メンバのJSON連想配列のキーに対応する値を返す。
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
	 * 関数名:this.setAttrText(startdom, curkey)
	 * 概要  :指定したタグに属性を追加する。
	 * 引数  :jQuery startdom, Array curkey
	 * 返却値  :なし
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 */
	this.setAttrText = function(startdom, curkey){
		// タグに現在指すDOMのノードの属性値をセットする。
		startdom.attr(curkey[2][curkey[3]], curkey[1][curkey[2][curkey[3]]]);
	};

	/* 
	 * 関数名:this.getNextKey = function(curkey)
	 * 概要  :連想配列のカレントの位置を動かす。
	 * 引数  : Array curkey
	 * 返却値  :Array
	 * 作成者:T.M
	 * 作成日:2015.02.13
	 */
	this.getNextKey = function(curkey){
		// 現在の連想配列を走査し終えていないなら
		if(curkey[3] < curkey[2].length){
			// カウンターを回し、次のキーを指す。
			curkey[3]++;
		// 全てのキーを走査し終えている状態であれば
		} else {
			// 連想配列をnullに置き換え、連想配列走査のループの終了条件を満たす。
			curkey[1] = null;
		}
		
		// curkeyを返す。
		return curkey;
	}
	
	/* 
	 * 関数名:this.getKeyList = function(map)
	 * 概要  :連想配列のキーのリストを取得する。
	 * 引数  : Object map
	 * 返却値  :Array
	 * 作成者:T.M
	 * 作成日:2015.02.15
	 */
	this.getKeyList = function(map){
		// 返却値となるキーのリストを保存する変数を宣言する。
		var keyList = [];
		// ループ内のカウンター変数を宣言、初期化する。
		var counter = 0;
		
		// for in文で連想配列を走査する。
		for(key in map){
			// keyListに連想配列のキーを格納する。
			keyList[counter++] = key;
		}
		
		// keyListを返す。
		return keyList;
	}
}
