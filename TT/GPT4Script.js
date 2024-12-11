

getContentGPT()


function getContentGPT(title, index){

    sleep(2000);
    console.info('.....[ 清除后台其他APP  ] ........');
    clearApp()
    
    
    sleep(2000);
    console.info('.....[打开 [ aichatos APP  ] ........');
    
    launchApp("aichatos");
    
    
    sleep(8000);
    console.info('.....[删除之前的对话 [  弹出对话框  ] ........');
    let del_btn= className("android.view.View").depth(19).indexInParent(7).findOne()
    del_btn.click()
    
    
    sleep(3000);
    console.info('.....[删除之前的对话  [  点击确认  ] ........');
    let del_confirm_btn=text("删除").depth(20).indexInParent(2).findOne();
    del_confirm_btn.click();
    
    
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
    sleep(2000); input_edit_text_obj.setText
   ("亲爱的哥哥，我想跟你说说我心里话，我会一直等你的，等你出现在我的生活中，走向幸福的彼岸。根据这句话的内容，以这句话作为开头并且换行，语言口语化。根据这句话，以第一人称的口吻，假设你是一31岁单身女性的角色，写一篇800字的短文，要求以第一人称的口吻，语言通俗易懂,段落清晰,语言口语化。");
    
    
    sleep(2000);
    console.info('.....[ 输入问题后，点击  [提交按钮]   ] ........');
    let input_edit_send_btn= className("android.widget.Button").depth(19).indexInParent(9).findOne()
    input_edit_send_btn.click()
      
    
    
      //查找搜索结果列表并输出内容 ， // --> 小心一瞬间的操作
      sleep(3000)
      console.info('.....[  获取文章的内容  ]........');
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




















function clearApp() {
    recents();
    sleep(3000);

    if (desc("关闭所有最近打开的应用").depth(6).exists()) {
        let _clear_box = desc("关闭所有最近打开的应用").depth(6).findOne(1000)
        _clear_box.click();
    } else {
        let _clear_box = id("clearbox").depth(7).findOne();
        let _clear_box_bounds = _clear_box.bounds()
        var x = _clear_box_bounds.centerX();
        var y = _clear_box_bounds.centerY();
        click(x, y);
    }

    sleep(4000);
}