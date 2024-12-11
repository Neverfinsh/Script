
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
          <button id="local_start_task_btn" bg="#8acfaa" text="发布视频" marginLeft="35" h="38" />
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
     setInterval(executeMain, 1*20* 1000)
  // setInterval(executeMain, 4 * 60 * 1000)
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





/*************************************  [执行主程序] ******************************************************/
function executeMain() {




if (shouldStop()) {
  console.log("--------------到了晚上 8 点，停止脚本！----------");
  exit();  // 停止脚本
}


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
  
    console.warn(".........【 开始发送发布视频标题:titleVideo 】.............", titleVideo);
  
    try {
      const flag = excuteSendVideo(titleVideo);
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



/*************************************  [执行脚本] ******************************************************/



function excuteSendVideo(title) {



  console.info('..... [ 清除后台所有应用 ] ........');
  clearApp()





  sleep(8000);
  console.info('..... [  打开今日头条 ] ........');
  launchApp("今日头条");





  sleep(8000);
  console.info('..... [  点击头条Tab ] ........');
  let tt_tab_obj_child=text("头条").findOne();
  let  tt_tab_obj=tt_tab_obj_child.parent();
  tt_tab_obj.click();




  sleep(4000);
  let  me_tab_obj_child=text("我的").findOne();
  let  me_tab_obj=me_tab_obj_child.parent();
  me_tab_obj.click();




  sleep(4000);
  console.info('..... [  点击 [去发文]  ] ........');
  if (className("android.widget.TextView").desc("去发文").exists()) {
    click("去发文");
  } else {
    className("android.widget.ImageView").desc("发布").find().forEach(function (item, value) {
      item.click()
    });
  }





  // 选择视频Tab
  sleep(5000);
  let  video_tab_obj_child_child=text("视频").findOne();
  let  video_tab_child=video_tab_obj_child_child.parent();
  let  video_tab=video_tab_child.parent();
  video_tab.click()





  // 选择具体的视频
  sleep(5000);
  console.log('.....  [选择具体的视频] ......');
  className("android.widget.Button").depth(23).find().forEach(function(item,value){
  item.click()
   });




   


  // 选择更多设置
  sleep(5000);
  console.log('..... 点击 [更多设置] 按钮......');
  let more_setting_btn_child=text("更多设置").findOne();
  let more_setting_btn=more_setting_btn_child.parent();
  more_setting_btn.click()



  

  sleep(5000);
  console.log('.....  [置空标题].....');
  let titlEdit= className("android.widget.EditText").findOne();
  titlEdit.click()
  sleep(2000)
  titlEdit.setText('')




  sleep(3000);
  let set_text_title=textStartsWith('添加标题').findOne(1000)
  set_text_title.setText('')
  sleep(5000);
  set_text_title.setText(title);



 // 发布
 sleep(5000);
 let send_btn=text('发布').findOne(1000)
 send_btn.click();


   return true;

}






function clearApp() {
  recents();
  sleep(3000);
  let clear_btn=descContains("关闭").findOne();
  clear_btn.click();
}

