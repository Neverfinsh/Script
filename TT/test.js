
getContentWithWenXin("你好")

function getContentWithWenXin(title) {

  
  console.log('.....[ 打开   [清除后台管理]   ] ......')

  clearApp()

  console.log('.....[ 打开 文心一言 APP ] ......')

  launchApp("文心一言")

  sleep(3000)

  //  输入框填入值
  let input_edit_text_obj = className("android.widget.EditText").depth(22).indexInParent(1).findOne()
  input_edit_text_obj.click()
  sleep(2000);
  //input_edit_text_obj.setText("要不咱就爽快一点，来个闪婚吧！咱们先结婚后恋爱，省的再这样耗下去了。你觉得怎么样？彩礼什么的真的不用多，一万八就够了，我还会回礼六万八呢！月薪三千八的你，就能把我领回家，是不是很划算？把这句话润色一下，一定要写一篇150字的文章，要求开头吸引人眼球，要求以第一人称的口吻，语言通俗易懂,情感要真实,段落清晰,使文章更加口语化。");
   input_edit_text_obj.setText(title);
   input_edit_text_obj.click()
  sleep(3000)

  console.info('..... [  输入问题后，点击  [提交按钮]   ] ........');
  let input_edit_send_btn = className("android.widget.RelativeLayout").depth(23).indexInParent(1).childCount(1).findOne(1000)
  //  console.log('.....【input_edit_send_btn】......',input_edit_send_btn);
   input_edit_send_btn.click()
  
  
   sleep(1000 * 3)
  let _clear_box_bounds = input_edit_send_btn.bounds()
  var x = _clear_box_bounds.centerX();
  var y = _clear_box_bounds.centerY();
  console.log('.....x......',x);
  console.log('.....y......',y);
  longClick(x, y);

  var centerX = (_clear_box_bounds.left + _clear_box_bounds.right) / 2;  
  var centerY = (_clear_box_bounds.top + _clear_box_bounds.bottom) / 2;  

  console.log('.....centerX......',centerX);
  console.log('.....centerY......',centerY);
  click(centerX, centerY);


  console.info('[  等待【1分钟】后 获取文章的内容...  ]');
  sleep(1000 * 60* 2)
  console.info('.....[  开始获取文章的内容  ]........');
  let arr = []

  className("android.widget.TextView").depth(32).childCount(0).find().forEach(function (item, index) {
      let itemContent = item.text()
      arr.push(itemContent)
  });

  // console.log('.....arr......',arr);

  // 处理结果
  for (let i = 0; i < arr.length; i++) {
       content += "\n" + arr[i] + "\n";
      }

  var content = arr[arr.length-4]

  var filteredArray = arr.filter(function(element) {
    return !element.includes('我是Kimi');
  });

  content=filteredArray
  

  console.log('....最后内容....', content);
  
  if( content ===undefined){
      return  'false'
  }
  return content;

}



function clearApp() {
  recents();
  sleep(3000);
  //if (desc("关闭所有最近打开的应用").depth(8).exists()) {
  if (desc("关闭所有最近打开的应用").depth(6).exists()) {
      let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
 //     let _clear_box = desc("关闭所有最近打开的应用").depth(8).findOne(1000)
      _clear_box.click();
  } else {
      let _clear_box = id("clear_button").depth(8).findOne();
      let _clear_box_bounds = _clear_box.bounds()
      var x = _clear_box_bounds.centerX();
      var y = _clear_box_bounds.centerY();
      click(x, y);
  }
  sleep(4000);
}

