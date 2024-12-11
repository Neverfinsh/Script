








"ui";
showLoalTask();
console.hide();
threads.start(setIntervalTask);


function showLoalTask() {

  ui.layout(
    <frame>
      <vertical h="auto" marginTop="20">
        <linear marginTop="30">
          <button id="them_to_article_btn" bg="#8acfaa" text="生成文心文章" marginLeft="35" h="38" />
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
  setInterval(executeMain, 60* 1000)
}



// 【 ........................................ 【主程序】.......................................... 】

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


  var url = "http://101.201.33.155:8099/them/script/findAllThemWithOut";
  var r = http.get(url);
  var result = r.body.string();
  let taskRes = JSON.parse(result)
  let resObj = taskRes.res;

  if (resObj === null) {
    toastLog("当前没有需要转化的 【Them】")
    console.error('.....[ 当前没有可执行Them任务 ]........');
    return;
  }
  console.log('.....[ 开始执行获取 them 的内容  ]........', resObj);
  // 获取标题和内容
  let taskResult = taskRes.res;
  let counterSuccess = excuteAritcle(taskResult)

  if(counterSuccess===undefined){
    console.error('.....[ 生成文章出错 ]........');
  }else{

    console.info('.....[ 原生成数量 ]........', taskResult.articleNum);
    console.info('.....[ 入库成功数据量  ]........', counterSuccess);
      // 更新 them的状态
    let themId = resObj.id
    var url2 = `http://101.201.33.155:8099/them/script/updateThemStatus/${themId}`;
    console.info('.....[   开始回调接口    ]........');

    var updateStatusRes = http.postJson(url2);

    let contentCallBack = JSON.parse(updateStatusRes.body.string());

    console.info('.....[   开始回调them接口结果,返回值  ]........', contentCallBack);

    if (contentCallBack.code === 1) {
      console.info('.....[   更新状态成功    ]........');
     }
  }



  

}



// 【 ............................................ 【入库】.................................... 】


function excuteAritcle(taskResult) {

  console.warn('.....[从them查询出来的]......', taskResult);

  let them = taskResult.articleThem
  let articleNum = taskResult.articleNum
  let uid = taskResult.uid
  let deviceId = taskResult.deviceId
  let articleSendTime = taskResult.articleSendTime
  
  let counter=0;

  for (let index = 1; index < Number(articleNum) + 1; index++) {
    let title = them
    sleep(5000)
    let content
    content = getContentWithWenXin(title);

    console.log('.....content......',content);

    if (content === "false") {
         console.error(".... 获取[内容]错误，返回重写获取数据.......");
         return;
    }

    // mysql数据库当前的时间
    var currentDate = new Date();
    var createTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // 插入article表
    let articleVo = {}
    articleVo.articleThem = them;
    articleVo.articleTitle = title
    articleVo.articleContent = content
    articleVo.uid = uid
    articleVo.deviceId = deviceId
    articleVo.themId=taskResult.id

    // TODO:  在当前的时间里面:往后相加10分钟
     let newArticleSendTime = nextDateUtil(index,articleSendTime);
    articleVo.articleSendTime = newArticleSendTime
    articleVo.articleNum = 1
    articleVo.status = 0
    articleVo.createTime = createTime

    var url2 = `http://101.201.33.155:8099/article/web/addArticle`;

    console.info('.....[   开始入库【article】 参数 :    ]........',articleVo);

    var updateStatusRes = http.postJson(url2, articleVo);
    let contentCallBack = JSON.parse(updateStatusRes.body.string());
    console.info('.....[   入库结果    ]........', contentCallBack);


    if (contentCallBack.code === 0) {
        console.info('.....[   article 入库更新状态成功    ]........');
    }

    if (contentCallBack.code === 0) {
      console.info('.....[   article 入库更新状态成功    ]........');
      counter++;
    }


    console.info('.....[   准备执行下个入库对象    ]........');
    sleep(10000);
  }
  return counter;
}




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

