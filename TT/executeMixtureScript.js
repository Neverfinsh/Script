
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
          <button id="local_start_task_btn" bg="#8acfaa" text="发布【视频】" marginLeft="35" h="38" />
          <button id="clearn_localstorage_btn" bg="#ffe63d" text="清除本地缓存" marginLeft="15" h="38" />
          <button id="stop_all_script_btn" bg="#ffe63d" text="停止脚本运行" marginLeft="15" h="38" />
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






  // 【 发布视频 】 
  ui.local_start_task_btn.click(function () {


    var runningScripts = engines.all();
    console.error("当前运行的脚本个数", runningScripts.length);

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
        if (j != runningScripts.length - 1) { // 保留最后一个
          try {
            var engine = runningScripts[j];
            console.log('.....engine......', engine);
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
    console.setSize(800, 1000)
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
        let counter = 0;
        setInterval(() => {
            if (counter % 2 === 0) {
              executeArticle();
            } else {
              executeVideoMain();
            }
            counter++;
        }, 1000*60*3);  // 每隔 1000 毫秒执行一次



}






/* **********************************  [    保存图片到相册      ]   ************************************************* */



function  saveVideo(path){

  // 打开日志窗口
console.show();
console.setSize(800,1000)
console.setPosition(70, 100);


var pathArray = path.split("/");
var imageNameStr = pathArray[pathArray.length - 1];
var imageName = new Date().getTime();
var savePath = "/sdcard/DCIM/Camera/" + "VID_" + imageName + ".mp4";


let startTime = new Date().getTime();

console.warn("-------开始下载--------> ");

var res=http.get(path);

if (res.statusCode !== 200) {    
   console.warn("-------视频下载失败，状态码--------> "+ res.statusCode);
   return false ;
}

console.warn("-------下载中--------> ");

files.writeBytes(savePath,res.body.bytes());

media.scanFile(savePath);

console.warn("-------下载 结束--------> ");


let endTime = new Date().getTime();
let executionTime = endTime - startTime;

console.warn("------------->下载消耗时间: " + executionTime/1000 + " 秒");


return true  ;
}








/* **********************************  [    删除视频     ]   ************************************************* */

function delBeforVideo() {
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


  // 获取当前时间
  function getCurrentTime() {
    let now = new Date();
    return {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds()
    };
  }


  

// 判断是否到了晚上 8 点
function shouldStop() {
  let time = getCurrentTime();
  return time.hour === 19 ;
}



/*************************************  [改写标题] ******************************************************/
function resetTitle(title) {


  var content = "";



  clearApp();



  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "https://chat18.aichatos10.com/#/"
  });



  // 查找搜索框并输入关键字
  sleep(1000 * 6);
  var searchBox = className("android.widget.EditText").depth(28).findOne();
  searchBox.click();
  sleep(1000);
  
  searchBox.setText(title+"根据这句话内容，重新写一个文章的标题,要求使得标题更加吸引中年人的人眼球，能够引起人们的共鸣，调动情绪，更加具体创新力，不超过30个字")



  
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
      
      //console.log('.....arr  检查是否有换行......',arr);

      // 处理结果
      for (let i = 4; i < arr.length; i++) {
            //content += arr[i];
            content += "\n"+arr[i]+"\n";
      }
      //console.log('....最后内容....',content);

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



/*************************************  [执行 [视频] ] ******************************************************/
function executeVideo() {




// if (shouldStop()) {
//     console.log("--------------到了晚上 8 点，停止脚本！----------");
//      exit();  // 停止脚本
// }


  if (!console.isShowing()) {
        console.show();
        console.setPosition(70, 100);
  }






  var runningScripts = engines.all();
  console.error("当前运行的脚本个数", runningScripts.length);







  if (runningScripts.length > 1) {
    console.error("-----------有多个脚本同时运行，已经关闭所有重复脚本，停止运行。脚本数:", runningScripts.length);
    engines.stopAll();
    return;
  }





  toastLog("------------>  开始执行执行定时任务  ------->    ")


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


  var url = `http://101.201.33.155:8099/video/script/findOneVideo/${deviceId}`;

  var r = http.get(url);
  var result = r.body.string();
  let taskRes = JSON.parse(result)
  let content = JSON.parse(result);
  let resObj = content.res;


  if (resObj == null) {
    toastLog(`当前没有可发布的【视频】,设备编号:${deviceInfo.deviceId}`)
    return;
  }


  let taskArr = taskRes.res;


  //  删除旧视频和图片
  var delflag = delBeforVideo()
  if (delflag) {
      console.log('......[   删除旧的视频成功    ]..........');
  }

  //  保存视频到相册
  let path=taskArr.path
  var saveflag= saveVideo(path)


  if(!saveflag){
     console.log('......[   下载视频失败    ]..........');
   }else{
    sleep(4000)
    let titleVideo = resObj.title
    let videoId =     resObj.id
  
    console.warn(".........【 开始改写视频标题:titleVideo 】.............", titleVideo);

    // 【 ............................................ 【获取内容】..................................... 】

    let endTilte;

    let newTitle=resetTitle(titleVideo)
 

    if(newTitle === "false"){
          endTilte=titleVideo
    }else{
          endTilte=newTitle
    }
      

    console.warn(".........【 开始发送发布视频标题:endTilte 】.............", endTilte);
  
    try {
      const flag = excuteSendVideo(endTilte);
      if (!flag) {
         console.error("执行发送视频的脚本出现错误,无法执行回调")
         return;
      }
  
    } catch (error) {
      console.error(".........【 发布视频内容失败！】脚本原因:", error);
      return;
    }
  
  
    //【   更新回调   】
    sleep(2000)
    console.info('.....[   开始回调接口    ]........');
    var url2 = `http://101.201.33.155:8099/video/script/callbackVideo/${videoId}`;
    var updateStatusRes = http.get(url2);
  
    let contentCallBack = JSON.parse(updateStatusRes.body.string());
    console.log('......[   回调接口返回值    ]..........', contentCallBack);
  
    if (contentCallBack.code === 1) {
      console.info('.....[   更新状态成功    ]........');
    }
   }


  
}

/*************************************  [执行  [文章]] ******************************************************/
function executeArticle() {

  if (!console.isShowing()) {
        console.show();
        console.setPosition(70, 100);
  }

  var runningScripts = engines.all();
  console.error("当前运行的脚本个数", runningScripts.length);

  if (runningScripts.length > 1) {
    console.error("-----------有多个脚本同时运行，已经关闭所有重复脚本，停止运行。脚本数:", runningScripts.length);
    engines.stopAll();
    return;
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
  let titleArticleImg = []
  titleArticleImg = taskArr.imgList

  //  删除手机里面久的图片 
  var delflag = delBeforImg()
  if (delflag) {
    console.log('......[   删除旧的图片成功    ]..........');
  }

  //  保存图片到相册
  for (let i = 0; i < titleArticleImg.length; i++) {
    saveImg(titleArticleImg[i])
  }

  sleep(4000)
  let articleId = resObj.id
  let titleArticle = taskArr.articleTitle
  let contentArticle = taskArr.articleContent

  console.warn(".........【 开始发送发布文章内容:titleArticle 】.............", titleArticle);
  try {
    const flag = excuteArticle(titleArticle, contentArticle);
    if (!flag) {
      console.error("执行发送文章的脚本出现错误,无法执行回调")
      return;
    }

  } catch (error) {
    console.error(".........【 发布文章内容失败！】原因:", error);
    return;
  }


  //【   更新回调   】
  sleep(2000)
  console.info('.....[   开始回调接口    ]........');
  var url2 = `http://101.201.33.155:8099/article/script/execute/updateArticle/${articleId}`;
  var updateStatusRes = http.postJson(url2);

  let contentCallBack = JSON.parse(updateStatusRes.body.string());
  console.log('......[   回调接口返回值    ]..........', contentCallBack);

  if (contentCallBack.code === 1) {
    console.info('.....[   更新状态成功    ]........');
  }
}




/*************************************  [执行脚本] ******************************************************/


function executeVideoMain() {




  // if (shouldStop()) {
  //     console.log("--------------到了晚上 8 点，停止脚本！----------");
  //      exit();  // 停止脚本
  // }
  
  
    if (!console.isShowing()) {
          console.show();
          console.setPosition(70, 100);
    }
  
  
  
  
  
    var runningScripts = engines.all();
    console.error("当前运行的脚本个数", runningScripts.length);
  
  
  
  
  
  
  
    if (runningScripts.length > 1) {
      console.error("-----------有多个脚本同时运行，已经关闭所有重复脚本，停止运行。脚本数:", runningScripts.length);
      engines.stopAll();
      return;
    }
  
  
  
  
  
    toastLog("------------>  开始执行执行定时任务  ------->    ")
  
  
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
  
  
    var url = `http://101.201.33.155:8099/video/script/findOneVideo/${deviceId}`;
  
    var r = http.get(url);
    var result = r.body.string();
    let taskRes = JSON.parse(result)
    let content = JSON.parse(result);
    let resObj = content.res;
  
  
    if (resObj == null) {
      toastLog(`当前没有可发布的【视频】,设备编号:${deviceInfo.deviceId}`)
      return;
    }
  
  
    let taskArr = taskRes.res;
  
  
    //  删除旧视频和图片
    var delflag = delBeforVideo()
    if (delflag) {
        console.log('......[   删除旧的视频成功    ]..........');
    }
  
    //  保存视频到相册
    let path=taskArr.path
    var saveflag= saveVideo(path)
  
  
    if(!saveflag){
       console.log('......[   下载视频失败    ]..........');
     }else{
      sleep(4000)
      let titleVideo = resObj.title
      let videoId =     resObj.id
    
      console.warn(".........【 开始改写视频标题:titleVideo 】.............", titleVideo);
  
      // 【 ............................................ 【获取内容】..................................... 】
  
      let endTilte;
  
      let newTitle=resetTitle(titleVideo)
   
  
      if(newTitle === "false"){
            endTilte=titleVideo
      }else{
            endTilte=newTitle
      }
        
  
      console.warn(".........【 开始发送发布视频标题:endTilte 】.............", endTilte);
    
      try {
        const flag = excuteSendVideo(endTilte);
        if (!flag) {
           console.error("执行发送视频的脚本出现错误,无法执行回调")
           return;
        }
    
      } catch (error) {
        console.error(".........【 发布视频内容失败！】脚本原因:", error);
        return;
      }
    
    
      //【   更新回调   】
      sleep(2000)
      console.info('.....[   开始回调接口    ]........');
      var url2 = `http://101.201.33.155:8099/video/script/callbackVideo/${videoId}`;
      var updateStatusRes = http.get(url2);
    
      let contentCallBack = JSON.parse(updateStatusRes.body.string());
      console.log('......[   回调接口返回值    ]..........', contentCallBack);
    
      if (contentCallBack.code === 1) {
        console.info('.....[   更新状态成功    ]........');
      }
     }
  
  
    
  }

  







function clearApp() {
  recents();
  sleep(3000);
  let clear_btn=descContains("关闭").findOne();
  clear_btn.click();
}

