
getContentWithGPT("你好")




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



// 【 ............................................ 【获取内容】..................................... 】
function getContentWithGPT(title) {


  var content = "";
  // 打开页面
  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "https://chat18.aichatos10.com/#/"
  });


  // 等待浏览器加载完成
  sleep(1000 * 6);
  let close_comtent_model= className("android.widget.Button").depth(26).indexInParent(2).findOne();
  close_comtent_model.click();





  // 查找搜索框并输入关键字
  sleep(1000 * 6);
  var searchBox = className("android.widget.EditText").depth(28).findOne();
  searchBox.click();
  sleep(1000);
  searchBox.setText(title)


  sleep(1000);
  console.info('..... [  访问网址，填入问题, 点击发送 ] ........');
  className("android.widget.Button").find().forEach(function (value, index) {
    if (value.depth() == 25) {
      if (value.indexInParent() == 3) {
        value.click()
      }
    }
  })

  // 查找搜索结果列表并输出内容 ， // --> 小心一瞬间的操作
  sleep(3000)
  let arr = []
  let counter = 0;
  while (counter < 60) {
    counter++;
    if (!text('Stop Responding').depth(28).exists()) {
      className("android.widget.TextView").depth(29).find().forEach(function (currentItem, index) {
        let itemContent = currentItem.text();
        arr.push(itemContent)
      });
      
      console.log('.....arr  检查是否有换行......',arr);

      // 处理结果
      for (let i = 4; i < arr.length; i++) {
            //content += arr[i];
            content += "\n"+arr[i]+"\n";
      }
      console.log('....最后内容....',content);

      // 加载完
      break;
    }
    // 还在加载中...、
    if (textStartsWith("Stop Responding").depth(28).exists()) {
      console.log("加载中.......", counter);
      sleep(3000)
    }

    // 发生错误了
    if (textStartsWith("Something went wrong").depth(28).exists()) {
      return "false";
    }

    // 超时
    if (counter > 60) {
      return "false";
    }
  }


  // 检查content

  if (content.indexOf("Ai") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [AI [字样")
    return "false";
  }

  if (content.indexOf("机器人") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [机器人[] 字样")
    return "false";
  }

  if (content.indexOf("抱歉我无法满足你的要求") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [ 抱歉我无法满足你的要求 ] 字样")
    return "false";
  }


  if (content.indexOf("Something went wrong, please try again later.") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [   Something went wrong, please try again later. ] 字样")
    return "false";
  }

  console.log('.....content......',content);


  if (content === "") {
    return "false"
  } else {
    return content
  }
}
