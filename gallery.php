<!DOCTYPE html>
<?php
include 'article/inc/mslinfo.php';
$msl_infos = new MSLPageInfo('1197', '1984');
$msl_infos2 = new MSLPageInfo('1197', '1985');
?>
<html>
<head>
<meta charset="UTF-8">
<title>DDTFlowers/プリザーブドフラワー</title>
<link href="http://ddthink.com/article/css/top.css" rel="stylesheet" type="text/css">
</head>
<body>
	<div id="container">
		<div class="main">
			<!-- コース案内のCSSファイルを読み込む。 -->
			<link href="css/courseguide.css" rel="stylesheet" type="text/css">
			<!-- ギャラリーページのCSSファイルを読み込む。 -->
			<link href="css/gallery.css" rel="stylesheet" type="text/css">
			<script>
				creator.getJsonFile('source/gallery.json');			// ギャラリーページ用のJSONデータを取得する。
				creator.getJsonFile('source/gallerycontent.json');	// フォトギャラリー用のJSONデータを取得する。
				creator.getJsonFile('source/commonJson.json');		// 各ページ共通のパーツのJSONデータを取得する。
				//テンプレートのDOMを取得する。
				creator.getDomFile('template/common.html');
				creator.getDomFile('template/gallery.html');
				
				creator.outputTag('headImage', 'createImage');		// 天の画像を作る
				creator.outputTag('pageTitle');						// タイトル領域を作る
				creator.outputTag('gallery');						// ギャラリーページ用のギャラリーを作る。
				creator.outputTag('footImage', 'createImage');		// 地の画像を作る
				creator.outputTag('footer');						// フッターを作る
			
				// メイン領域にヘッダーの高さ分のmarginを設定し、固定スクロール時に埋もれるのを阻止する。
				fixYCoordinate('header', '.main');
				// position:fixed;を設定したヘッダーが横スクロールしない問題を解決する関数をコールする。
				fixXCoordinateOnScroll('header')
				//ギャラリーの画像を拡大できるようにする。
				useZoomImage('photo');

				//@add 2015.0604 T.Masuda MSL記事一覧の位置を変えるコードを定義しました
				//MSLの記事リストをギャラリーの前に配置する
				$('.gallery').append($('#mslongtail_1985').show());
			</script>
			<!-- MSLの記事を表示する -->
			<?php echo $msl_infos2->get('html_article'); ?>
		</div>
	</div>
</body>
</html>