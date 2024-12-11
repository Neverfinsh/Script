



newMain('爱情公寓：当初剧里的人生轨迹，如今真的照进了现实')


 //downloadVideo("http://101.201.33.155/ymystatic/video/头一次见，大船出船祸.mp4");


function  main(){

  let flag=downloadVideo("http://101.201.33.155/ymystatic/video/头一次见，大船出船祸.mp4");

  if(flag){
        sendVideo("请问这是什么鸟呢 ?")()

  }
}


function newMain(title){
   
  let newTitle=resetTitle(title);
  console.log('.....newTitle......',newTitle);

  // if(newTitle === "false"){
  //      sendVideo(title);
  // }else{
  //       sendVideo(newTitle);
  // }

}





function getContentLength(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, false);  // 使用 HEAD 请求仅获取文件头部信息
  xhr.send();
  if (xhr.status === 200) {
      return xhr.getResponseHeader('Content-Length'); // 返回文件大小
  }
  return 0;
}


function testLoadVideo(){

  const downloadUrl = 'http://101.201.33.155/ymystatic/video/庆幸！我二十来岁看完了这几部纪录片.mp4';   // 替换为你要下载的视频链接

  var imageName = new Date().getTime();
  var savePath = "/sdcard/DCIM/Camera/" + "VID_" + imageName + ".mp4";





  
  let fileSize = getContentLength(url);  // 获取文件大小
  if (fileSize === 0) {
      toast("无法获取文件大小，下载失败");
      return;
  }

  // 使用 HttpURLConnection 流式下载
  console.warn("-------开始下载--------> ");

  let connection = new java.net.URL(url).openConnection();
  connection.setRequestMethod("GET");
  connection.setConnectTimeout(5000);  // 设置连接超时
  connection.setReadTimeout(10000);    // 设置读取超时

  let inputStream = connection.getInputStream(); // 获取输入流
  let outputStream = new java.io.FileOutputStream(savePath); // 获取输出流

  let buffer = new java.lang.ByteArray(1024); // 设置缓冲区
  let bytesRead = 0;
  let totalRead = 0;

  while ((bytesRead = inputStream.read(buffer)) !== -1) {
      outputStream.write(buffer, 0, bytesRead); // 将读取的内容写入文件
      totalRead += bytesRead;

      let progress = (totalRead / fileSize) * 100;
      log("下载进度: " + progress.toFixed(2) + "%");

      // 可以显示进度条或其他反馈给用户
  }

  inputStream.close();
  outputStream.close();

  media.scanFile(savePath);

  toast("文件下载完成");
  console.warn("-------文件下载完成--------> ");
}




function  downloadVideo(path){

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







// 【 ............................................ 【获取内容】..................................... 】
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


  



function sendVideo(title) {




  console.info('..... [ 清除后台所有应用 ] ........');
  clearApp()


  // 处理title
  //  1、打开GPT 



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
  set_text_title.setText("新款手机支架");



 // 发布
 sleep(5000);
 let send_btn=text('发布').findOne(1000)
 send_btn.click();


   return true;

}


// function clearApp() {
//   recents();
//   sleep(3000);
//   //if (desc("关闭所有最近打开的应用").depth(8).exists()) {
//   if (desc("关闭所有最近打开的应用").depth(6).exists()) {
//       let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
//  //     let _clear_box = desc("关闭所有最近打开的应用").depth(8).findOne(1000)
//       _clear_box.click();
//   } else {
//       let _clear_box = id("clear_button").depth(8).findOne();
//       let _clear_box_bounds = _clear_box.bounds()
//       var x = _clear_box_bounds.centerX();
//       var y = _clear_box_bounds.centerY();
//       click(x, y);
//   }
//   sleep(4000);
// }


//learApp();

function clearApp() {
  recents();
  sleep(3000);
  let clear_btn=descContains("关闭").findOne();
  clear_btn.click();

  // if (desc("关闭所有最近打开的应用").depth(6).exists()) {
  //   let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
  //   _clear_box.click();
  // } else {
  //   let _clear_box = id("clearbox").depth(7).findOne();
  //   let _clear_box_bounds = _clear_box.bounds()
  //   var x = _clear_box_bounds.centerX();
  //   var y = _clear_box_bounds.centerY();
  //   click(x, y);
  // }
}