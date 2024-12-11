


getContentWithWenXin()

function getContentWithWenXin(title) {

    clearApp()

    console.log('.....[ 讯飞星火 ] ......')

    launchApp("讯飞星火")

    sleep(3000)

    //  输入框填入值
    console.info('..... [  把问题填入输入框   ] ........');
    let input_edit_text_obj = className("android.widget.EditText").depth(13).indexInParent(0).findOne()
    input_edit_text_obj.click()
    sleep(2000);
    input_edit_text_obj.setText("要不咱就爽快一点，来个闪婚吧！咱们先结婚后恋爱，省的再这样耗下去了。你觉得怎么样？彩礼什么的真的不用多，一万八就够了，我还会回礼六万八呢！月薪三千八的你，就能把我领回家，是不是很划算？把这句话润色一下，一定要写一篇150字的文章，要求开头吸引人眼球，要求以第一人称的口吻，语言通俗易懂,情感要真实,段落清晰,使文章更加口语化。");
    // input_edit_text_obj.setText(title);

    sleep(2000);
    console.info('..... [  输入问题后，点击  [提交按钮]   ] ........');
    let input_edit_send_btn = className("android.widget.ImageView").depth(12).indexInParent(3).findOne()
    let _clear_box_bounds = input_edit_send_btn.bounds()
    var x = _clear_box_bounds.centerX();
    var y = _clear_box_bounds.centerY();
    click(x, y);


    console.info('[  等待【30s】后 获取文章的内容...  ]');
    sleep(1000 * 30)
    console.info('.....[  开始获取文章的内容  ]........');
    let arr = []

    className("android.widget.TextView").depth(14).childCount(0).find().forEach(function (item, index) {
        let itemContent = item.text()
        arr.push(itemContent)
    });

     console.log('.....arr......',arr);

    // 处理结果
    for (let i = 0; i < arr.length; i++) {
         content += "\n" + arr[i] + "\n";
    
        }

    var content = arr[arr.length-4]
    console.log('....最后内容....', content);
    
    return content;

}



function formateDateUtil() {

  let now = new Date(); // 获取当前的日期和时间

  let year = now.getFullYear(); // 获取当前的年份
  let month = now.getMonth() + 1; // 获取当前的月份（注意月份是从 0 开始计算的，所以需要加 1）
  let day = now.getDate(); // 获取当前的日期
  let hour = now.getHours(); // 获取当前的小时
  let minute = now.getMinutes(); // 获取当前的分钟
  let second = now.getSeconds(); // 获取当前的秒钟

  let formattedDateTime = year + "-" + addZeroPadding(month) + "-" + addZeroPadding(day) + " " +
    addZeroPadding(hour) + ":" + addZeroPadding(minute) + ":" + addZeroPadding(second);

  // 在个位数前添加零补齐
  function addZeroPadding(num) {
    return num < 10 ? "0" + num : num;
  }
  return formattedDateTime
}




function nextDateUtil(index,articleSendTime) {
 

  var isoFormatString = articleSendTime.replace(" ", "T");
  const now = new Date(isoFormatString); 

  let addMinutes = 10 * index
  let year =   now.getFullYear(); 
  let month =  now.getMonth() + 1; 
  let day =    now.getDate();
  let hour =   now.getHours(); 
  let minute = now.getMinutes() + addMinutes; 
  let second = now.getSeconds(); 
1
  // [组装参数]
  let formattedDateTime = year + "-" + addZeroPadding(month) + "-" + addZeroPadding(day) + " " +
    addZeroPadding(hour) + ":" + addZeroPadding(minute) + ":" + addZeroPadding(second);

  // [在个位数前添加零补齐]
  function addZeroPadding(num) {
    return num < 10 ? "0" + num : num;
  }
  return formattedDateTime
}


function clearApp() {
  recents();
  sleep(3000);
  let _clear_box = id("clearbox").depth(7).findOne(); 
  let _clear_box_bounds = _clear_box.bounds()
  var x = _clear_box_bounds.centerX();
  var y = _clear_box_bounds.centerY();
  click(x, y)
  sleep(4000);


}














function clearApp() {
    recents();
    sleep(3000);
    if (desc("关闭所有最近打开的应用").depth(8).exists()) {
        let _clear_box = desc("关闭所有最近打开的应用").depth(8).findOne(1000)
        _clear_box.click();
    } else {
        let _clear_box = id("clear_button").depth(6).findOne();
        let _clear_box_bounds = _clear_box.bounds()
        var x = _clear_box_bounds.centerX();
        var y = _clear_box_bounds.centerY();
        click(x, y);
    }
    sleep(4000);
}



