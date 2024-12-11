
"ui";

const { info, error } = require("__console__");

showLoalTask();
console.hide();
threads.start(setIntervalTask);


function showLoalTask() {

  ui.layout(
    <frame>
      <vertical h="auto" marginTop="20">
        <linear>
          <text w="70" h="50" textSize="16ps">用户编号:</text>
          <input id="user_id_input" h="40" w="300" textSize="16ps" />
        </linear>
        <linear>
          <text w="70" h="50" textSize="16ps">设备编号:</text>
          <input id="device_id_input" h="40" w="300" textSize="16ps" />
        </linear>

        <linear marginTop="30">                            
          <button id="local_start_task_btn"      bg="#8acfaa" text="发布文章" marginLeft="35" h="38" />
          <button id="clearn_localstorage_btn"   bg="#ffe63d" text="清除本地缓存" marginLeft="15" h="38" />
          <button id="stop_all_script_btn"       bg="#ffe63d" text="停止脚本运行" marginLeft="15" h="38" />
        </linear>
        <linear marginTop="30">
          <button id="close_console_log_btn" bg="#8acfaa" text="关闭日志" marginLeft="35" h="38" />
        </linear>
      </vertical>
    </frame>
  );


  // 【初始化】
  var LocalStorage = storages.create("device_storage");
  let deviceInfo = LocalStorage.get("deviceInfo")
  if (deviceInfo != null) {
      ui.user_id_input.setText(deviceInfo.userId);
      ui.device_id_input.setText(deviceInfo.deviceId);
  }






  // 【 发布文章 】 
  ui.local_start_task_btn.click(function () {

   
    var runningScripts = engines.all();
    console.error("当前运行的脚本个数",runningScripts.length);

    var currentScriptName = engines.myEngine().source.toString();   // 获取当前脚本的名称 
    var runningScripts = engines.all();
    var otherScripts = [];

      for (var i = 0; i < runningScripts.length; i++) {
        var scriptName = runningScripts[i].source.toString();
        if (scriptName == currentScriptName) {
            otherScripts.push(scriptName);
        }
      }

      if (otherScripts.length > 0) {
        for (var j = 0; j < runningScripts.length; j++) {
            if(j != runningScripts.length-1 ){ // 保留最后一个
               try {
                    var engine = runningScripts[j] ;
                    console.log('.....engine......',engine);
                     engine.forceStop(); 
                    toastLog("强制了关闭其中一个脚本");
               } catch (error) {
                     toastLog("强制了关闭其中一个脚本，出现错误");
               }
            }
        }

      } else {
        toastLog("当前没有其他脚本在执行");
      }

    
    toastLog("开始执行任务")
    let userId = ui.user_id_input.getText();
    let deviceId = ui.device_id_input.getText();
    // TODO: 获取不到值！！
    if (userId.length === 0 || deviceId.length === 0) {
      toastLog("请输入用户编号或者设备编号");
      return;
    } else {
      let param = {}
      param['userId'] = userId
      param['deviceId'] = deviceId
      LocalStorage.put("deviceInfo", param);
    }
    // 打开日志窗口
    console.show();
    console.setSize(800,1000)
    console.setPosition(70, 100);

  });


  //  【停止脚本运行】
  ui.stop_all_script_btn.click(function () {
    toastLog("停止了脚本运行，并且清除日志缓存")
    console.clear();
    engines.stopAll();
  });


  // 【 清除本地缓存 】
  ui.clearn_localstorage_btn.click(function () {
    var LocalStorage = storages.create("device_storage");
    LocalStorage.remove("deviceInfo")
    toastLog("清除本地缓存成功")
    showLoalTask()
  });


    // 【 关闭日志 】
    ui.close_console_log_btn.click(function () {
      console.hide();
    });                                                                                                                                                                                                                                                       
}



// 【 定时任务执行 】
function setIntervalTask() {
         setInterval(executeMain, 1*60* 1000)
}


/* **********************************  [    保存图片到相册      ]   ************************************************* */

function saveImg(imgUrl) {

  // 从网络加载一张图片
  
  // 使用split()函数将路径字符串分割成数组
  var pathArray = imgUrl.split("/");
  

  // 时间挫作为名称
  var imageName = new Date().getTime();
  
  // 打印图片名称
  console.log("imageName"+imageName);
  
  var img = images.load(imgUrl);


  let pathURL= "/sdcard/DCIM/Camera/" + "IMG_"+imageName+".jpg"
  // 保存图片到相册
  var saved = images.save(img, "/sdcard/DCIM/Camera/" + "IMG_"+imageName+".jpg");
  
   //保存图片
   // im.saveTo(path);

    //把图片加入相册
    media.scanFile(pathURL);


  // 检查保存是否成功
  if (saved) {
         console.log('......[   图片保存成功    ]..........', );
  } else {
         console.log('......[   图片保存失败    ]..........', );
  }
  
  }




/* **********************************  [    删除图片      ]   ************************************************* */

function delBeforImg(){
  let folderPath = "/sdcard/DCIM/Camera/"; // 指定文件夹路径
  let folder = new java.io.File(folderPath);
   
  if (folder.exists()) {
      let files = folder.listFiles();
      for (let i = 0; i < files.length; i++) {
          let file = files[i];
          if (file.isFile()) {
              file.delete(); // 删除文件
          }
      }
  }
      return true
}


/*************************************  [执行主程序] ******************************************************/
function executeMain() {

 if (!console.isShowing()) {
     console.show();
     console.setPosition(70, 100);
 } 

  var runningScripts = engines.all();
  console.error("当前运行的脚本个数",runningScripts.length);

 if(runningScripts.length>1){
    console.error("-----------有多个脚本同时运行，已经关闭所有重复脚本，停止运行。脚本数:",runningScripts.length);
    engines.stopAll();
    return ;
 }


  toastLog("开始执行执行定时任务")
  var LocalStorage = storages.create("device_storage");
  let deviceInfo = LocalStorage.get("deviceInfo");
  console.log('..... [deviceInfo]........', deviceInfo);
  if (deviceInfo === undefined) {
    toastLog("请填写用户编号和设备编号！！")
    return;
  }
  let deviceId = deviceInfo.deviceId;
  console.log('..... [deviceId]........', deviceId);
  if (deviceId === undefined || deviceId === "" || deviceId === null) {
    toastLog("请填写设备编号！！")
    return;
  }

  let userId = deviceInfo.userId;
  console.log('..... [userIdId]........', userId);
  if (userId === undefined || userId === "" || userId === null) {
    toastLog("请填写用户编号！！")
    return;
  }


  var url = `http://101.201.33.155:8099/article/script/execute/findOneArticle/${deviceId}`;

  var r = http.get(url);
  var result = r.body.string();
  let taskRes = JSON.parse(result)
  let content = JSON.parse(result);
  let resObj = content.res;


  if (resObj == null) {
    toastLog(`当前没有可发布的【文章】,设备编号:${deviceInfo.deviceId}`)
    return;
  }


 let taskArr = taskRes.res;
 let titleArticleImg  = []
     titleArticleImg  = taskArr.imgList
    
  console.log('.....titleArticleImg......',titleArticleImg);

  try {
      //  删除手机里面久的图片 
      var delflag= delBeforImg()
      if(delflag){
         console.log('......[   删除旧的图片成功    ]..........');
        }
  } catch (error) {
         console.error('......[   删除旧的图片失败    ]..........');
         return;
  }


  try {
      //  保存图片到相册
    for(let i=0;i<titleArticleImg.length;i++){
        saveImg(titleArticleImg[i])
    }
  } catch (error) {
         console.error('......[   保存图片到相册失败    ]..........');
         return;
  }
  


  sleep(4000)
  let articleId = resObj.id
  let titleArticle = taskArr.articleTitle
  let contentArticle = taskArr.articleContent

  console.warn(".........【 开始发送发布文章内容:contentArticle 】.............",contentArticle);
  try {
    const flag= excuteLongArticle(titleArticle,contentArticle);
    if(!flag){
      console.error("执行发送文章的脚本出现错误,无法执行回调")
      return;
   }
 
  } catch (error) {
    console.error(".........【 发布文章内容失败！】原因:",error);
    return;
  }


  //【   更新回调   】
  sleep(2000)
  console.info('.....[   开始回调接口    ]........');
  var url2 = `http://101.201.33.155:8099/article/script/execute/updateArticle/${articleId}`;
  var updateStatusRes = http.postJson(url2);

  let contentCallBack = JSON.parse(updateStatusRes.body.string());
  console.log('......[   回调接口返回值    ]..........', contentCallBack);
  
  if(contentCallBack.code===1){
    console.info('.....[   更新状态成功    ]........');
  }
}



/*************************************  [执行【文章】脚本] ******************************************************/

function excuteLongArticle(title, content) {

  

  console.info('..... [ 清除后台所有应用 ] ........');
  clearApp()

  sleep(8000);
  console.info('..... [  打开今日头条APP ] ........');
  launchApp("今日头条");


  sleep(3000);
  
  console.info('..... [  打开头条 Tab ] ........');
  let tt_tab_obj =className('com.bytedance.platform.raster.viewpool.cache.compat.MeasureOnceRelativeLayout2').depth(9).indexInParent(0).childCount(1).findOne(1000);
  tt_tab_obj.click();

  sleep(8000);
 if(className("android.widget.Button").text("取消").exists()){
    console.warn('..... [  界面出现了有未成的编辑的提示词 ] ........');
    let unfinish_page_obj= text("取消").depth(5).findOne(1000);
    unfinish_page_obj.click()
  }


  if(text("升级版本").depth(6).exists()){
    console.warn('..... [  界面出现了软件升级提示词 ] ........');
    let unfinish_page_obj= desc("关闭").depth(6).findOne(1000);
    unfinish_page_obj.click()
  }



  console.info('..... [  点击 [我的 Tab ]  ] ........');
  sleep(3000);
  click("我的");


  sleep(3000);
  if(!text("创作中心").depth(22).exists()){
    console.error('..... [ 打开 [我的] 页面失败 ] ........');
    return;
  }


  // --   点击【去发文 】tab 页面

  sleep(4000);
  console.info('..... [  点击 [去发文]  ] ........');
  if (className("android.widget.TextView").desc("去发文").exists()) {
     click("去发文");
  } else {
    className("android.widget.ImageView").desc("发布").find().forEach(function (item, value) {
      item.click()
    });
  }
  



     // --   点击【文章】tab 页面
    sleep(4000);
    console.info('..... [  点击 文章  [ tab]  ] ........');
    let _long_article_tab = className('android.widget.FrameLayout').depth(10).childCount(1).indexInParent(1).findOne();
    _long_article_tab.click();
    sleep(4000);
  


   // --   把[内容]写入[编辑框]

    sleep(3000);
    console.info("....[ 把内容写入编辑区 ] ......");
    let _long_article_title_obj = className('EditText').depth(19).findOne(1000);
    sleep(3000);
    _long_article_title_obj.setText("\n"+content+"\n"+"")
   
    //滑动一下
    sleep(3000);
    console.info("....  [ 滑动一下 ]  ......");
    var num = (Math.random() * 0.99 + 0.01).toFixed(2);
    console.log("--------[随机数生成]--------" + num);
    let y2 = num
    sleep(3000);
    swipe(device.width / 2, device.height * y2, device.width / 2, y2, 1000);
     
    sleep(5000);
    let bounds = _long_article_title_obj.bounds();
    let x = bounds.centerX(); 
    let y = bounds.centerY(); 
    let offsetX = random(-10, 10); 
    let offsetY = random(-10, 10); 
    console.log('.....offsetY......', offsetY);
    console.log('.....offsetX......', offsetX);
    click(x + 1, y -2);


  //【 文章最后，添加图片 】
  sleep(5000); 
  console.info("....  [ 点击 添加图片的按钮，给文章内容添加图片 ]  ......");
  let _long_article_add_img_btn = desc('添加图片').depth(17).findOne(1000);
  _long_article_add_img_btn.click();
  
  
  
  sleep(4000);
  console.info("------- [ 打开相册，开始选择相册 ] --------")
  desc('未选中').depth(15).find().forEach(function (value, index) {
      console.log('.....index......',index);
      value.click();
  });


   // 【点击】
  sleep(4000);
  console.info("------- [ 打开相册，选择相册完，点击 【完成】 按钮 ] --------")
  let _add_img_finsh_btn =className('android.widget.LinearLayout').depth(14).childCount(2).indexInParent(1).findOne();
  _add_img_finsh_btn.click();



  //把标题写入编辑框
  sleep(4000);
  let newTilte;

  if(title.length>25){
        let index = title.indexOf("一定要");
        newTilte = title.substring(0, index);
        console.log('.....newTilte......',newTilte);
  }else{
      newTilte=title
  }

  console.log('.....title......',newTilte);
  if(newTilte.length>30){
     newTilte = newTilte.substring(0, 26).trim()+"...";
  }

   sleep(3000);
   console.info(".... [ 把标题写入编辑区 ] ......");
   let _long_article_content_obj = className('EditText').depth(20).findOne(1000);
   _long_article_content_obj.click();
    sleep(1000);
  _long_article_content_obj.setText(newTilte);





  // 点击【下一步】
   sleep(3000);
   console.info("....点击 [  下一步   ]  按钮 ......");
   let _long_article_next_btn = className('android.widget.Button').text('下一步').depth(11).findOne(1000);
   _long_article_next_btn.click();



  // 点击【添加地址】



   // 点击【发布】
   sleep(3000);
   console.info("....点击[  发布 ]  按钮     ......");
   let _long_article_publish_btn=text("发布").desc("发布").depth(11).findOne(1000);
   _long_article_publish_btn.click()

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