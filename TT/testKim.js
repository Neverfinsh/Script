
getContentWithTitle("你好","")

// 【 ............................................ 【获取内容】..................................... 】
function getContentWithTitle(title, index) {

  clearApp()

  console.log('.....[ Kimi 智能助手 ] ......')

  launchApp("Kimi 智能助手")

  sleep(3000)

  //  输入框填入值
  let input_edit_text_obj = className("android.widget.EditText").depth(9).indexInParent(1).findOne()
  input_edit_text_obj.click()
  sleep(2000);
  input_edit_text_obj.setText(title);

  sleep(2000);
  console.info('..... [  输入问题后，点击  [提交按钮]   ] ........');
  let input_edit_send_btn = className("android.widget.ImageView").depth(9).indexInParent(2).findOne()
  let _clear_box_bounds = input_edit_send_btn.bounds()
  var x = _clear_box_bounds.centerX();
  var y = _clear_box_bounds.centerY();
  click(x, y);


  console.info('[  等待【30s】后 获取文章的内容...  ]');
  sleep(1000 * 30)
  console.info('.....[  开始获取文章的内容  ]........');
  let arr = []
  var content = "";
  className("android.widget.TextView").depth(13).childCount(0).find().forEach(function (item, index) {
      let itemContent = item.text()
      arr.push(itemContent)
  });

  var filteredArray = arr.filter(function(element) {
    return !element.includes('你好呀');
  });


  for (let i = 0; i < filteredArray.length; i++) {
       content += "\n" + filteredArray[i] + "\n";
   }
   console.log('.....内容......');
   console.log(content);
  return content;
}




function clearApp() {
  recents();
  sleep(3000);
  let _clear_box = desc("关闭所有最近打开的应用").findOne(1000)
  _clear_box.click();
  sleep(4000);
}
