
console.info('.....  清除所有的后台应用 ........');
clearApp()

sleep(2000);
console.info('.....  打开 [文心一言 ] ........');
launchApp("文心一言");



sleep(5000);
console.info('..... [  在提问框中输入提问的问题 ] ........');
let input_edit_text_obj= className("android.widget.EditText").depth(21).indexInParent(1).findOne()
input_edit_text_obj.click()
sleep(2000);
input_edit_text_obj.setText("亲爱的哥哥，我想跟你说说我心里话，我会一直等你的，等你出现在我的生活中，走向幸福的彼岸。根据这句话的内容，以这句话作为开头并且换行，语言口语化。根据这句话，以第一人称的口吻，假设你是一31岁单身女性的角色，写一篇800字的短文，要求以第一人称的口吻，语言通俗易懂,段落清晰,语言口语化。");


sleep(2000);
console.info('..... [  输入问题后，点击  [提交按钮]   ] ........');
let input_edit_send_btn= className("android.widget.RelativeLayout").depth(22).indexInParent(1).findOne()
let _clear_box_bounds = input_edit_send_btn.bounds()
var x = _clear_box_bounds.centerX();
var y = _clear_box_bounds.centerY();
click(x, y);


sleep(6000);
console.info('..... [  获取回答的内容   ] ........');
className("android.view.View").depth(29).find().forEach(function(item,index){
    console.log('.....item......',item);
});

























function clearApp() {
    recents();
    sleep(3000);

    if (desc("关闭所有最近打开的应用").depth(6).exists()) {
        let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
        _clear_box.click();
    } else {
        let _clear_box = id("clearbox").depth(7).findOne();
        let _clear_box_bounds = _clear_box.bounds()
        var x = _clear_box_bounds.centerX();
        var y = _clear_box_bounds.centerY();
        click(x, y);
    }

    sleep(4000);
}