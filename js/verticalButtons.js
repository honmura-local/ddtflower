// 縦並び。
(function($){
	// jQueryプラグインの宣言。
	$.fn.extend({
		verticalButtons: function(trigger){
			
			// メニューの要素を変数に格納する。
			var $menu = $(this);
			// メニューのボタンの要素を変数に格納する。
			var $menuButtons = $('.menu_button', $menu);
			// メニューを呼び出すボタンを変数に格納する。
			var $trigger = $(trigger);

			// メニューの出現位置を設定する。ここではメニューが3/4だけ頭を出す様にする。
			var appears = 0;
			// マウスオーバー時にボタンがどれだけ飛び出るかの値を設定する。
			var foward = -($menu.width()  / 4);
			// ボタンが隠れる際、どこまで深く隠れるかの倍率を指定する。
			var disappearRatio = 1.0;
			
			// メニューを隠しておき、イベントに合わせて表示したり非表示にする処理。
			
			// メニューを右奥に隠す。親要素はoverflow-x: hidden;とposition:relative
			// のスタイルを指定しておく必要がある。
			
			// メニュー自身にはposition: absolute;のスタイルを指定しておく。
			
			// 表示するためのanimate関数で指定するrightの値に任意の値を加えれば、その分だけ
			// メニューを右端から離す事ができる。
			
			// メニュー自身の幅のマイナスの値を右からの位置に設定し、隠しておく。
			$menu.css('right', -($menu.width() * disappearRatio) + "px");
			// メニューのボタンの高さを均等にする。ウィンドウで一度に全て表示できる高さにする。
//			$menuButtons.css('height', $(window).height() / $menuButtons.length);
			// 文字の高さを中心に揃える。
			//$('a', $menuButtons).css('margin-top', $menuButtons.height() / 2 - $('a', $menuButtons).height() /2 );
			
		//メニューを表示する処理
	 		// 表示を切り替えるトリガーとなる要素をクリックした時のイベント
	 		$trigger.on('click',function(){
	 			// メニューの右からの座標を数値にする。rightプロパティに設定される値は数値指定
	 			// であると自動的にpxの文字列が付いてしまうため、pxの文字列を抜いて整数に変換する。
	 			var fromRight = parseInt($menu.css("right").replace("px", ""));
	 			// メニューが表示されていれば(=メニューの右からの座標が0px以上の位置にあるとき)
	 			if(fromRight >= appears){
	 				// メニュー要素をアニメーションして非表示にする。
		 			$menu.animate({
		 				// 画面からスライドしながらフェードアウトする。
		 				// 右からの座標を自分の幅のマイナスの値にしていすることで自分自身の幅だけ移動する。
		 				right: -($menu.width() / 4) + "px"
					// スタイル指定のハッシュの括弧を閉じて、その後にアニメーション速度を指定する。
		 			}, 'slow');
		 			
		 			// オーバーレイを表示する。オーバーレイは　divタグで作成する。
		 			$('body').append($('<div></div>')
		 					// オーバーレイのクラスを設定する。
		 					.addClass('overray')
		 					);
	 			}
	 		});

	 		// 表示を切り替えるトリガーとなる要素にマウスカーソルを重ねたときのイベント
	 		$trigger.on('mouseenter', function(){
	 			// メニュー要素をアニメーションして表示する。
	 			$menu.animate({
	 				// 親要素の右端に移動する。0であれば右端ぴったり、それ以上にすればそれ
	 				// だけ右端から離れる。
	 				right: appears
	 				// スタイル指定のハッシュの括弧を閉じて、その後にアニメーション速度を指定する。
	 			}, "slow");
	 			// オーバーレイを表示する。オーバーレイは　divタグで作成する。
	 			$('body').append($('<div></div>')
	 					// オーバーレイのクラスを設定する。
	 					.addClass('overray')
	 					// 高さをcontainerに合わせる。
	 					.css('height', $('#container').css('height'))
	 					);
	 		});
	 		
	 	//ここまでメニューを表示するための処理
	 		
	 		// メニューからマウスカーソルを外したときのイベント
	 		$menu.on('mouseleave', function(){
	 			// メニュー要素をアニメーションして非表示にする。
	 			$menu.animate({
	 				// 画面からスライドしながらフェードアウトする。
	 				// 右からの座標を自分の幅のマイナスの値にしていすることで自分自身の幅だけ移動する。
	 				right: -($menu.width() * disappearRatio) + "px"
	 				// スタイル指定のハッシュの括弧を閉じて、その後にアニメーション速度を指定する。
	 			}, 'slow');
	 			// オーバーレイを消す。
	 			$('.overray').remove();
	 		});

//	 		// 表示を切り替えるトリガーとなる要素をクリックした時のイベント
//	 		$menuButtons.on('click',function(){
//		 		$menu.animate({
//		 			// 画面からスライドしながらフェードアウトする。
//		 			// 右からの座標を自分の幅のマイナスの値にしていすることで自分自身の幅だけ移動する。
//		 			right: -($menu.width()) + "px"
//				// スタイル指定のハッシュの括弧を閉じて、その後にアニメーション速度を指定する。
//		 		}, 'slow');
//	 		});
//	 		
//	 		// 表示を切り替えるトリガーとなる要素にマウスカーソルを重ねたときと離したときのイベント
//	 		$menuButtons.hover(
//	 			//マウスを重ねたときの処理
//	 			function(){
//	 				// 左のネガティブマージンを設定し、ボタンを自身の幅の1/4ほど左にずらす。
//	 				// 右にも同じだけのマージンをプラスの値で設定し、判定をのばす。
//	 				$(this).animate({
////	 					margin: '0 ' + -(foward) + 'px'+ ' 0 ' + foward + 'px',
//	 					marginLeft:foward + 'px',
//	 					paddingRight:-(foward) + 'px'
// 	 				}, 'fast');
//	 			},
//	 			//マウスを離したときの処理
//	 			function(){
//	 				//マウスを重ねたときに設定した左ネガティブマージンを解除する。
//	 				$(this).animate({
//	 					margin: 0,
//	 					padding: 0
//	 				}, 'fast');
//	 			}
//	 		);
		}
	})

})(jQuery);