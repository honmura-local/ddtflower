$(function(){
	// use_pointの初期保存と差分保存
	var target =  $("input[name^='get_point']");
	// 初期値保存
	target.focus(function() {
		if(!target.attr("data-base_point")) {
			target.attr("data-base_point", target.val());
		}
	});
	// 差分保存
	target.change(function() {
		target.attr("data-diff_point", (target.val() - target.attr("data-base_point")));
	});
});