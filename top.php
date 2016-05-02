<!-- container -->
<div id="container" class="window" name="usuall">

<header class="header">
</header>
	<div class="main">
	</div>
<script>
		try{
			commonFuncs = new common();						//汎用共通関数定義クラスインスタンスを生成する

			var creator = new createLittleContents();		//createTagクラスのインスタンスを生成する
			
			creator.getJsonFile('source/index.json');		// ファイルのデータをjsonを用いて持ってくる
			creator.getJsonFile('source/commonJson.json');	// ファイルのデータをjsonを用いて持ってくる
			creator.getDomFile('template/common.html');		// 共通パーツのDOMを取得する。
			creator.getDomFile('template/toppage.html');	// トップページのパーツのDOMを取得する。
			//ヘッダー内のタグが作成済みでなければ
		
			creator.createNormalHeaderContent();	//ヘッダー内のタグが作成済みでなければ作る。
		
			creator.outputTag('flowerBackground', 'createImage');	// トップページ背景を作る

			//ログイン状態をチェックした上でDBにアクセスする
			create_tag.doGuestLoginProcedure(function() {
				creator.getJsonFile(URL_SAVE_JSON_DATA_PHP, create_tag.json.topicGallery, 'topicGallery');
				creator.getJsonFile(URL_SAVE_JSON_DATA_PHP, create_tag.json.topicBlog, 'topicBlog');
			});

			//ギャラリー、ブログの新着記事情報をセットする
			commonFuncs.setDataToNoticeContents = function(create_tag.json.topicGallery, create_tag.json.getTopicGallery.tableData, commonFuncs.sampleNoticeDataOrganizeKeyArray, commonFuncs.sampleNoticeDataOrganizeSettingObj);
			commonFuncs.setDataToNoticeContents = function(create_tag.json.topicBlog, create_tag.json.getTopicBlog.tableData, commonFuncs.sampleNoticeDataOrganizeKeyArray, commonFuncs.sampleNoticeDataOrganizeSettingObj);
			//各お知らせを表示するボタンを作る
			creator.outputTag('topicShowCampaign','topicShow', '.flowerBackground');
			creator.outputTag('topicShowGallery','topicShow', '.flowerBackground');
			creator.outputTag('topicShowBlog','topicShow', '.flowerBackground');
			//各お知らせを作る。
			creator.outputTag('topicGallery','topic', '.flowerBackground');
			creator.outputTag('topicCampaign','topic', '.flowerBackground');
			creator.outputTag('topicBlog','topic', '.flowerBackground');
			
			creator.outputTag('footer');							// フッターを作る
			
			// トップメニューにマウスオーバーのフィルターを配置する。
			functionFilter('.topMenu li');
		
			//0ミリ秒後にキャンペーンお知らせ表示ボタンをスライド表示する。
			commonFuncs.moveNoticeWindows();
			//お知らせウィンドウを開閉させるイベントを登録する
			commonFuncs.toggleNoticeWindows();


			commonFuncs.setShowSelectedBlogArticleEvent();			
			
			//例外処理
			}catch(e){
				//エラーログを出す
				console.log(e);
			}
		</script>
</div>
<!-- JavaScriptのコードを記述する -->
