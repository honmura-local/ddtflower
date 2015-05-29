<?php
include 'inc/mslinfo.php';
$msl_infos = new MSLListInfo();
?>
<!-- HTMLによるコード -->
<!doctype html>
<!-- 最も外のタグ -->
<html>
<!-- 予め仕様等を記すヘッダータグ -->
<head>
<!-- UTF-8でエンコード -->
<meta http-equiv="Content-Type" content="text/html charset=UTF-8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
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
		<!-- コンテンツ領域のタグ -->
		<div class="main">
			<!--MSL記事表示用-->
			<?php echo $msl_infos->get('html_article'); ?>
			<!--MSL記事表示用-->
		</div>
	</div>
<!-- bodyタグを閉じる -->
</body>
<!-- htmlタグを閉じる -->
</html>