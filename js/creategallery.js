
	/* 
	 * 関数名:createGallery(content, into, num)
	 * 概要  :指定した数の画像のギャラリーを作成する。
	 * 引数  :String content, Selector into, int num
	 * 返却値 :なし
	 * 作成者:T.M
	 * 作成日:2015.02.09
	 */
function createGallery(content, into, num){
	// ギャラリーに画像を追加していくfor文
	for(var i = 0; i < num; i++){
		// 対象のタグに対し、要素を追加していく。最上位はdivタグとなる。
		$(into).append($('<div></div>')
				// その子要素としてaタグを追加する。
				.append($('<a></a>')
						// 属性を追加する。
						.attr({
							// href属性に画像のURLを設定する。
							href: 'image/' + content + '/' + i + '.JPG',
							// galleryという名前で画像をグループ化する。
							rel:"gallery"
						})
						// 画像のタグを最下位に置く。
						.append($('<img>')
								// 画像のパスを設定する。
								.attr('src', 'image/' + content + '/' + i + '.JPG')
						)
				)
		);
	}
}
