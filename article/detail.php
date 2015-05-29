<?php
include 'inc/mslinfo.php';
$msl_infos = new MSLDetailInfo();
if ($msl_infos->get('article_title')==""){
//header("HTTP/1.0 404 Not Found");
//header("Location:".(empty($_SERVER["HTTPS"]) ? "http://" : "https://") . $_SERVER["HTTP_HOST"]);
//exit;
}
?>
<!-- HTMLによるコード -->
<!doctype html>
<!-- 最も外のタグ -->
<html>
<!-- 予め仕様等を記すヘッダータグ -->
<head>

<!--title、keywords、description表示用-->
<?php echo $msl_infos->get('html_meta'); ?>
<!--title、keywords、description表示用-->

<!-- Googleアナリスティクの記述のタグ -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58020246-43', 'auto');
  ga('send', 'pageview');
</script>
<!-- mslで指定されたCSSファイルを読み込む -->
<link href="css/top.css" rel="stylesheet" type="text/css">

<!-- メインのCSSファイルを読み込む。 -->
<link href="../css/style.css" rel="stylesheet" type="text/css">
<!-- Googleアナリティクスのトラッキングコード -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58020246-43', 'auto');
  ga('send', 'pageview');

</script>

</head>
<!-- コンテンツを表示する領域 -->
<body>
	<!-- ウェブサイトの横幅の基準となる -->
	<div id="container">
		<!-- メインのタグ -->
		<div class="main">
			<!--MSL記事表示用-->
			<?php echo $msl_infos->get('html_article'); ?>
			<!--MSL記事表示用-->
		</div>
	<!-- idをcontainerに指定したdivタグを閉じる -->
	</div>
<!-- bodyタグを閉じる -->
</body>
<!-- htmlタグを閉じる -->
</html>