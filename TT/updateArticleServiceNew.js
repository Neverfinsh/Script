"ui";

showLoalTask();
console.hide();
threads.start(setIntervalTask);

//log info warn  error ，全局模式方案
var gloabModalType = false;


function showLoalTask() {

  ui.layout(
    <frame>
      <vertical h="auto" marginTop="20">
        <linear marginLeft="35" marginTop="35">
          <text w="150" h="50" textSize="16ps" >是否自动模式:</text>
          <switch id="model_switch" checked="false" thumbTint="gray/orange-800" trackTint="light-gray/orange-200" marginEnd="16"></switch>
        </linear>
        <linear marginTop="30">
          <button id="them_to_article_btn" bg="#8acfaa" text="生成文章" marginLeft="35" h="38" />
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



  // 【选择模式】
  ui.model_switch.on("check", function (checked) {
    if (checked) {
      toast("开关已打开");
      gloabModalType = true;
    } else {
      toast("开关已关闭");
      gloabModalType = false;
    }
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



// 【 ............................................ 【入库】.................................... 】


function excuteAritcle(taskResult) {

  console.warn('.....[从them查询出来的]......', taskResult);

  let them = taskResult.articleThem
  let articleNum = taskResult.articleNum
  let uid = taskResult.uid
  let deviceId = taskResult.deviceId
  let articleSendTime = taskResult.articleSendTime
  //
  let  articleTitleStatus=taskResult.articleTitleStatus
  let  articleTitleTemplate=taskResult.articleTitleTemplate

  let counter = 0;

  for (let index = 1; index < Number(articleNum) + 1; index++) {

    let title = them


    if (gloabModalType) {
      title = setTitleRich(them, index)
      if (title === "false") {
        console.error(".... 获取[标题]错误.......");
        continue;
      }
    }

    sleep(5000)

    let content
    console.log('.....gloabModalType......',gloabModalType);
    if (gloabModalType) {
      content = getContentGPT(them, index);
    //  content = getContentWithThem(them, index);
    } else {
      content = getContentGPT(title, index);
    //  content = getContentWithTitle(title, index);
    }
    // test


    if (content === "false") {
      console.error(".... 获取[内容]错误.......");
      continue;
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


    // TODO:  在当前的时间里面:往后相加10分钟
     let newArticleSendTime = nextDateUtil(index,articleSendTime);
    console.log('.....newArticleSendTime......', newArticleSendTime);
    articleVo.articleSendTime = newArticleSendTime
   // articleVo.articleSendTime = articleSendTime
    articleVo.articleNum = 1
    articleVo.status = 0
    articleVo.createTime = createTime

    var url2 = `http://101.201.33.155:8099/article/web/addArticle`;

    console.info('.....[   开始入库【article】    ]........');

    var updateStatusRes = http.postJson(url2, articleVo);
    let contentCallBack = JSON.parse(updateStatusRes.body.string());
    console.info('.....[   入库结果    ]........', contentCallBack);


    if (contentCallBack.code === 0) {
      console.info('.....[   article 入库更新状态成功    ]........');
      counter++;
    }

    console.info('.....[   准备执行下个入库对象    ]........');
    sleep(10000);
  }
  return counter;
}


// 【 ............................................ 【最新的】..................................... 】
function getContentGPT(title, index){

  console.info('..... [ 开始生成 第[' + index + '] 个内容 .......');

  sleep(2000);
  console.info('.....[ 清除后台其他APP  ] ........');
  clearApp()
  
  
  sleep(2000);
  console.info('.....[打开 [ Aichatos APP  ] ........');
  
  launchApp("aichatos");
  
  
  sleep(8000);
  console.info('.....[删除之前的对话 [  弹出对话框  ] ........');
  let del_btn= className("android.view.View").depth(19).indexInParent(7).findOne()
  del_btn.click()
  
  
  sleep(4000);
  console.info('.....[删除之前的对话  [  点击确认  ] ........');
  // let del_confirm_btn=text("删除").depth(20).indexInParent(2).findOne();
  let del_confirm_btn=className("android.widget.Button").depth(20).indexInParent(2).childCount(0).findOne()
  //console.log('.....del_confirm_btn......',del_confirm_btn);
  del_confirm_btn.click()
  let del_confirm_btn_bounds=del_confirm_btn.bounds()
  var x = del_confirm_btn_bounds.centerX();
  var y = del_confirm_btn_bounds.centerY();
  click(x, y);

  
  
  sleep(3000);
  console.info('.....[ 关闭关联上下文1               ] ........');
  let close_comtent_model= className("android.view.View").depth(19).indexInParent(8).findOne();
  let modelText=close_comtent_model.getText()
  if( modelText==="关闭关联上下文"){
      close_comtent_model.click();
  }
  
  
  sleep(3000);
  console.info('.....[ 设置好提问的问题 ] ........');
  let input_edit_text_obj= className("android.widget.EditText").depth(21).indexInParent(0).findOne()
  input_edit_text_obj.click()
  sleep(2000);
  //input_edit_text_obj.setText("亲爱的哥哥，我想跟你说说我心里话，我会一直等你的，等你出现在我的生活中，走向幸福的彼岸。根据这句话的内容，以这句话作为开头并且换行，语言口语化。根据这句话，以第一人称的口吻，假设你是一31岁单身女性的角色，写一篇800字的短文，要求以第一人称的口吻，语言通俗易懂,段落清晰,语言口语化。");
  input_edit_text_obj.setText(title)
  
  sleep(2000);
  console.info('.....[ 输入问题后，点击  [提交按钮]   ] ........');
  let input_edit_send_btn= className("android.widget.Button").depth(19).indexInParent(9).findOne()
  input_edit_send_btn.click()
    
  
  
    //查找搜索结果列表并输出内容 ， // --> 小心一瞬间的操作
    sleep(3000)
    console.info('.....[  获取文章的内容开始  ] ->........',formateDateUtil());
    let arr = []
    let counter = 0;
    var content = "";
    while (counter < 60) {
      counter++;
      sleep(5000)
      if (!className("android.widget.Button").text('停止生成').exists()) {
        className("android.view.View").depth(23).find().forEach(function (currentItem, index) {
          let itemContent = currentItem.text();
          arr.push(itemContent)
        });
        //console.log('.....arr  检查是否有换行......',arr);
        // 处理结果
        for (let i = 0; i < arr.length; i++) {
              if(i==0){
                  content += arr[i]+"\n"+"\n";
              }else{
                  content += "\n"+arr[i]+"\n";
              }
        }
        console.log('...................[内容:].........................');
        console.log(content);
        // 加载完
        break;
      }

      if (className("android.widget.Button").text('停止生成').exists()) {
        console.log(".....[ 加载中 ] .......[",counter+" ].......");
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
  
 console.log("....获取chatGPT的内容......结束时间:....", formateDateUtil());

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


if (content === "") {
    return "false"
} else {
   return content
}
  
  
  
  
}





// 【 ............................................ 【获取内容】..................................... 】
function getContentWithTitle(title, index) {

  console.info('..... [ 获取内容，填入内容，访问网址 ,开始生成 第[' + index + '] 个.......');

  var content = "";
  // 打开页面
  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "https://chat18.aichatos.xyz/"
  });


    // 打开网址，不要联想其他的语句，保持问题单纯
    sleep(1000 * 2);
    console.info('..... [ 打开纯净模式 ].......');
    var not_carry_pre_btn = className("android.widget.Button").depth(26).indexInParent(2).childCount(0).findOne();
    not_carry_pre_btn.click();
    sleep(1000 * 6);

    


  // 等待浏览器加载完成
  sleep(1000 * 6);

  // 查找搜索框并输入关键字
  console.info('..... [ 获取内容，填入内容，访问网址,开始获取,[' + index + '].......');
  var searchBox = className("android.widget.EditText").depth(28).findOne();
  searchBox.click();
  sleep(1000);
  //searchBox.setText("以"+ title +"为标题写一篇300字的短文，要求内容吸引人眼球，正能量,不要带有正文和标题的字样,开头换一行,并且空2格")
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
  console.log("....获取chatGPT的内容.....开始时间:....", formateDateUtil());
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

  console.log("....获取chatGPT的内容......结束时间:....", formateDateUtil());

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

  // 双击退出
 // doubleExistApp()

  if (content === "") {
    return "false"
  } else {
    return content
  }
}




function getContentWithThem(title, index) {

  console.info('..... [ 获取内容，填入内容，访问网址 ,开始生成 第[' + index + '] 个.......');

  var content = "";
  // 打开页面
  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "https://chat18.aichatos.xyz/"
  });

  // 等待浏览器加载完成
  sleep(1000 * 6);

  // 查找搜索框并输入关键字
  console.info('..... [ 获取内容，填入内容，访问网址,开始获取,[' + index + '].......');
  var searchBox = className("android.widget.EditText").depth(28).findOne();
  searchBox.click();
  sleep(1000);
  //searchBox.setText("以"+ title +"为标题写一篇300字的短文，要求内容吸引人眼球，正能量,不要带有正文和标题的字样,开头换一行,并且空2格")
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
  console.log("....获取chatGPT的内容.....开始时间:....", formateDateUtil());
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
        content += arr[i];
      }
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

  console.log("....获取chatGPT的内容......结束时间:....", formateDateUtil());

  // 检查content  很抱歉，我无法满足你的要求

  if (content.indexOf("Ai") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [AI [字样")
    return "false";
  }

  if (content.indexOf("机器人") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [机器人[] 字样")
    return "false";
  }

  if (content.indexOf("很抱歉，我无法满足你的要求") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [  很抱歉，我无法满足你的要求 ] 字样")
    return "false";
  }

  if (content.indexOf("很抱歉，我无法满足你的要求") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [ 抱歉我无法满足你的要求 ] 字样")
    return "false";
  }

  if (content.indexOf("Sorry") !== -1) {
    console.error("ChatGPT 内容获取获取失败,内容带有 [ Sorry ] 字样")
    return "false";
  }

  // 双击退出
  doubleExistApp()

  if (content === "") {
    return "false"
  } else {
    return content
  }
}


// 【 ............................................. 【获取标题】........................................ 】
function setTitleRich(title, index) {


  console.info('..... [ 获取标题，，填入内容，访问网址 ,开始生成 第[' + index + '] 个.......');

  var content = "";
  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "https://chat18.aichatos.xyz/"
  });


  // 打开网址，不要联想其他的语句，保持问题单纯
  console.info('..... [ 打开纯净模式 ].......');
  var not_carry_pre_btn = className("android.widget.Button").depth(26).indexInParent(2).childCount(0).findOne();
  not_carry_pre_btn.click();
  sleep(1000 * 6);


  console.info('..... [ 获取标题，填入内容，访问网址,开始获取,[' + index + '].......');

  sleep(1000 * 6);
  var searchBox = className("android.widget.EditText").depth(28).findOne();
  searchBox.click();
  sleep(1000);



  searchBox.setText("把" + title + "这个标题润色一下,使得标题更加吸引人眼球，更加具体创新力，不超过14个字，要求标题不要带有双引号,不要带有:")


  // // 点击搜索按钮并等待结果页面加载完成className('Button')
  sleep(1000);

  className("android.widget.Button").find().forEach(function (value, index) {
    if (value.depth() == 25) {
      if (value.indexInParent() == 3) {
        value.click()
      }
    }
  })

  // 查找搜索结果列表并输出内容
  sleep(3000) // --> 小心一瞬间的操作
  let arr = []
  let counter = 0;
  console.log("....获取chatGPT的标题.....开始时间:....", formateDateUtil());
  while (counter < 60) {
    counter++;
    if (!text('Stop Responding').depth(28).exists()) {
      className("android.widget.TextView").depth(29).find().forEach(function (currentItem, index) {
        let itemContent = currentItem.text();
        arr.push(itemContent)
      });
      // 处理结果
      for (let i = 4; i < arr.length; i++) {
        content += arr[i];
      }
      // 加载完
      break;
    }
    // 还在加载中...
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
      //console.log(333);
      return "false";
    }
  }
  console.log("....获取chatGPT的标题......结束时间:....", formateDateUtil());
  console.log("....获取的 【标题】:.......", content);

  if (content.indexOf("false") !== -1) {
    console.error("ChatGPT 标题获取获取失败")
    return "false";
  }

  // 双击退出
  doubleExistApp()


  if (content === "") {
    return "false"
  } else {
    return content
  }
}



// 【 ............................................. 【 工具类  】........................................ 】
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




function doubleExistApp() {

  back()
  sleep(1000)
  back()
  sleep(1000)
  back()
}


function clearApp() {
  recents();
  sleep(3000);

  let _clear_box = id("clearbox").depth(7).findOne(); 66
  let _clear_box_bounds = _clear_box.bounds()
  var x = _clear_box_bounds.centerX();
  var y = _clear_box_bounds.centerY();
  click(x, y)
  sleep(4000);


}

