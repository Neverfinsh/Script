

let content="你吃土的时候，没有人会问你苦不苦，你吃肉的时候，总会有人问你香不香。这句话听起来挺讽刺的，但确实是我的生活写照。就像我上次加班到深夜，饿得前胸贴后背，只能吃泡面。那时候，谁也没来问我吃得怎么样，连个微信都没有。但当我在朋友圈晒了一顿大餐，立马就有人留言说“看起来好好吃啊！”。这种反差，有时候真的让人哭笑不得就拿我同事小张来说，她是个单身女性，平时生活节俭，但偶尔也会犒劳自己。有一次，她买了一双打折的高跟鞋，结果被同事们围攻，问她是不是发了横财。其实，她只是觉得那双鞋好看，又正好打折。这种时候，她也只能苦笑，解释说“只是偶尔奢侈一下”。你看，人们总是更容易注意到别人的光鲜亮丽，而忽略了背后的辛苦和努力。";
excuteLongArticle("我是标题",content);

function excuteLongArticle(title, content) {

  

//   console.info('..... [ 清除后台所有应用 ] ........');
//   clearApp()

//   sleep(8000);
//   console.info('..... [  打开今日头条APP ] ........');
//   launchApp("今日头条");


//   sleep(3000);
  
//   console.info('..... [  打开头条 Tab ] ........');
//   let tt_tab_obj =className('com.bytedance.platform.raster.viewpool.cache.compat.MeasureOnceRelativeLayout2').depth(10).indexInParent(0).childCount(1).findOne(1000);
//   tt_tab_obj.click();

//   sleep(8000);
//  if(className("android.widget.Button").text("取消").exists()){
//     console.warn('..... [  界面出现了有未成的编辑的提示词 ] ........');
//     let unfinish_page_obj= text("取消").depth(5).findOne(1000);
//     unfinish_page_obj.click()
//   }


//   if(text("升级版本").depth(6).exists()){
//     console.warn('..... [  界面出现了软件升级提示词 ] ........');
//     let unfinish_page_obj= desc("关闭").depth(6).findOne(1000);
//     unfinish_page_obj.click()
//   }



//   console.info('..... [  点击 [我的 Tab ]  ] ........');
//   sleep(3000);
//   click("我的");


//   sleep(3000);
//   if(!text("创作中心").depth(22).exists()){
//     console.error('..... [ 打开 [我的] 页面失败 ] ........');
//     return;
//   }


//   // --   点击【去发文 】tab 页面

//   sleep(4000);
//   console.info('..... [  点击 [去发文]  ] ........');
//   if (className("android.widget.TextView").desc("去发文").exists()) {
//      click("去发文");
//   } else {
//     className("android.widget.ImageView").desc("发布").find().forEach(function (item, value) {
//       item.click()
//     });
//   }
  



//      // --   点击【文章】tab 页面
//     sleep(4000);
//     console.info('..... [  点击 文章  [ tab]  ] ........');
//     let _long_article_tab = className('android.widget.FrameLayout').depth(10).childCount(1).indexInParent(1).findOne();
//     _long_article_tab.click();
//     sleep(4000);
  


   // --   把[内容]写入[编辑框]

    sleep(3000);
    console.info("....[ 把内容写入编辑区 ] ......");
    let _long_article_title_obj = className('EditText').depth(19).findOne(1000);
    sleep(3000);
    _long_article_title_obj.setText("\n"+content)
   
    //--    获取输入框的焦点,赋值图片
    sleep(3000); 
    let screenWidth = device.width;
    let screenHeight = device.height;
    let centerX = screenWidth / 2;
    let centerY = screenHeight / 2;
    console.log('.....centerY......',centerY);
    console.log('.....centerX......',centerX);
    // click(centerX, centerY); 
   
      // 获取EditText控件的位置和大小
      var bounds = _long_article_title_obj.bounds();
      var x = bounds.centerX(); // EditText中心X坐标
      var y = bounds.centerY(); // EditText中心Y坐标
  
      // 随机生成点击位置（稍微偏移以模拟真实点击）
      var offsetX = random(-10, 10); // X轴随机偏移量
      var offsetY = random(-10, 10); // Y轴随机偏移量
  
      // 模拟点击EditText
      click(x + offsetX, y + offsetY);
    
  



  //   //【 文章最后，添加图片 】
  // sleep(3000); 
  // console.info("....  [ 点击 添加图片的按钮，给文章内容添加图片 ]  ......");

  // let _long_article_add_img_btn = desc('添加图片').depth(17).findOne(1000);
  // _long_article_add_img_btn.click();
  
  
  
  // sleep(4000);
  // console.info("------- [ 打开相册，开始选择相册 ] --------")
  // desc('未选中').depth(15).find().forEach(function (value, index) {
  //     console.log('.....index......',index);
  //     value.click();
  // });


  //  // 【点击】
  // sleep(4000);
  // console.info("------- [ 打开相册，选择相册完，点击 【完成】 按钮 ] --------")
  // let _add_img_finsh_btn =className('android.widget.LinearLayout').depth(14).childCount(2).indexInParent(1).findOne();
  // _add_img_finsh_btn.click();



  // // 把标题写入编辑框
  //  sleep(3000);
  //  console.info(".... [ 把标题写入编辑区 ] ......");
  //  let _long_article_content_obj = className('EditText').depth(20).findOne(1000);
  //  _long_article_content_obj.click();
  //   sleep(1000);
  // _long_article_content_obj.setText(title);



  // // 点击【下一步】
  //  sleep(3000);
  //  console.info("....点击 [  下一步   ]  按钮 ......");
  //  let _long_article_next_btn = className('android.widget.Button').text('下一步').depth(11).findOne(1000);
  //  _long_article_next_btn.click();


  // 点击【添加地址】



   // 点击【发布】
   sleep(3000);
   console.info("....点击[  发布 ]  按钮     ......");
   let _long_article_publish_btn=text("发布").desc("发布").depth(11).findOne(1000);
  // _long_article_publish_btn.click()


  return true;
}


function clearApp() {
  recents();
  sleep(3000);

  if(desc("关闭所有最近打开的应用").depth(6).exists()){
    let _clear_box =  desc("关闭所有最近打开的应用").depth(6).findOne(1000)
    _clear_box.click();
  }else{
      let _clear_box = id("clearbox").depth(7).findOne(); 
      let _clear_box_bounds = _clear_box.bounds()
      var x = _clear_box_bounds.centerX();
      var y = _clear_box_bounds.centerY();
      click(x,y);
  }

  sleep(4000);
}

