"ui";
showLoalTask();
console.hide();
threads.start(setIntervalTask);


function showLoalTask() {

  ui.layout(
    <frame>
      <vertical h="auto" marginTop="20">
        <linear marginTop="30">
          <button id="them_to_article_btn" bg="#8acfaa" text="生成GPT[themKey ]" marginLeft="35" h="38" />
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
  setInterval(executeMain, 60 * 1000)
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

    let content = getContentWithGPT(them);

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
  let _clear_box = desc("关闭所有最近打开的应用").findOne(1000)
  _clear_box.click();
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






