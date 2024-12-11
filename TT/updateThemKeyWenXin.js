"ui";
showLoalTask();
console.hide();
threads.start(setIntervalTask);


function showLoalTask() {

  ui.layout(
    <frame>
      <vertical h="auto" marginTop="20">
        <linear marginTop="30">
          <button id="them_to_article_btn" bg="#8acfaa" text="生成文小言【themKey】文章" marginLeft="35" h="38" />
          <button id="clearn_localstorage_btn" bg="#ffe63d" text="清除本地缓存" marginLeft="15" h="38" />
          <button id="stop_all_script_btn" bg="#ffe63d" text="停止脚本运行" marginLeft="15" h="38" />
        </linear>
        <linear marginTop="30">
          <button id="close_console_log_btn" bg="#8acfaa" text="关闭日志" marginLeft="35" h="38" />
        </linear>
      </vertical>
    </frame>
  );



  // 【 生成文章 】

  ui.them_to_article_btn.click(function () {

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
  setInterval(executeMain, 20 * 1000)
}



/////////////////////////////////////////////////////////////////【主程序】//////////////////////////////

function executeMain() {

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


  var url = "http://101.201.33.155:8099/themKey/script/findThemKeyOne";
  var r = http.get(url);
  var result = r.body.string();
  let taskRes = JSON.parse(result)
  let resObj = taskRes.res;

  if (resObj === null) {
      toastLog("当前没有需要转化的 【Them】")
      console.error('.....[ 当前没有可执行Them任务 ]........');
      return;
  }

  
  // 获取标题和内容
  console.log('.....[ 开始执行获取 them 的内容  ]........', resObj);
  let taskResult = taskRes.res;
 
  excuteAritcle(taskResult)

}



// 【 ............................................ 【入库】.................................... 】


function excuteAritcle(taskResult) {

    console.warn('.....[从them查询出来的]......', taskResult);

    let them = taskResult.articleThemContentTemplate

    sleep(5000)

    let content = getContentWithWenXin(them);

    if (content === "false") {
         console.error(".... 获取[内容]错误.......");
         return;
    }


    // 更新状态

    let themKeyVo = {}
    themKeyVo.id = taskResult.id;
    themKeyVo.status = 1;
    themKeyVo.articleThemContent = content


    console.info('.....[   开始 更新ThemKey 文章内容    ]........');
    var url2 = `http://101.201.33.155:8099/themKey/web/updateThemKey`;


    var updateStatusRes = http.postJson(url2, themKeyVo);
    let contentCallBack = JSON.parse(updateStatusRes.body.string());
    console.info('.....[   更新结果    ]........', contentCallBack);


    if (contentCallBack.code === 0) {
         console.info('.....[   更新ThemKey 文章内容成功    ]........');
     }

    sleep(10000);

    return true;
}





function clearApp() {
  recents();
  sleep(3000);
  if (desc("关闭所有最近打开的应用").depth(8).exists()) {
  // if (desc("关闭所有最近打开的应用").depth(6).exists()) {
  //     let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
      let _clear_box = desc("关闭所有最近打开的应用").depth(8).findOne(1000)
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






function getContentWithWenXin(title) {

  
  console.log('.....[ 打开   [清除后台管理]   ] ......')

  clearApp()

  console.log('.....[ 打开 文心一言 APP ] ......')

  launchApp("文小言")

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
  sleep(1000 * 30* 1)
  console.info('.....[  开始获取文章的内容  ]........');
  let arr = []

  className("android.widget.TextView").depth(32).childCount(0).find().forEach(function (item, index) {
      let itemContent = item.text()
      arr.push(itemContent)
  });

   console.log('.....arr......',arr);

  // 处理结果
  for (let i = 0; i < arr.length; i++) {
       content += "\n" + arr[i] + "\n";
      }


  var emptyStringIndex = arr.indexOf('');
  var content = arr[emptyStringIndex-1]
  console.warn('.................最后内容.................');
  console.warn( content);
  
  if( content ===undefined){
      return  'false'
  }
  return content;

}
















