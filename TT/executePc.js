console.info('..... [   打开网页网址  ].......');
app.startActivity({
  action: "android.intent.action.VIEW",
  data: "https://mp.toutiao.com/profile_v4/index/"
});



sleep(1000 * 10);
console.info('..... [   点击发布按钮  ].......');
let _send_article_btn= className('android.widget.Button').text("开始创作").depth(21).indexInParent(5).childCount(0).findOne(1000);
_send_article_btn.click();


sleep(1000 * 8);
console.info('..... [   选择微头条：点击下拉框  ].......');
let _find_short_article_select= text("发布文章").depth(26).indexInParent(1).childCount(0).findOne(1000);
_find_short_article_select.click();



sleep(1000 * 6);
console.info('..... [   选择微头条：点击下拉框: 选择微头条  ].......');
let _find_short_article_select_item= className('android.view.View').depth(20).indexInParent(2).childCount(2).findOne(1000);
_find_short_article_select_item.click();


sleep(1000 * 8);
console.info('..... [   填入内容 ].......');
let _send_article_edit= className('android.widget.EditText').depth(31).indexInParent(0).childCount(0).findOne(1000);
_send_article_edit.click();
sleep(3000)
_send_article_edit.setText("微头条内容")

sleep(1000 * 8);
console.info('..... [   填入内容 ].......');
let _send_article_content_edit= className('android.widget.EditText').depth(30).indexInParent(0).childCount(0).findOne(1000);
_send_article_content_edit.click();
_send_article_content_edit.setText("内容")