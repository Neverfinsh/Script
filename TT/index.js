
excuteLongArticle('90后大龄女青年，现在广州工作生活', '我不喜欢我的男孩子一味地付出，更不想看他因为爱而唯唯诺诺，我想我的男孩子跟我在一起是最开心的。生气时，我会坦诚的告诉他你这个样子我很难过，因为我不想会有误会和难过。生活不是假象，不需要伪装，我也不希望他会因为我的眼光而去拘束自己的想法，不喜欢的人就拒绝没有广撒网的道理。唉不知道咋说啧，总之是保持优秀的和他一起阳光温暖的快快乐乐吧。')

function excuteLongArticle(title, content) {

    console.info('..... [ 清除后台所有应用 ] ........');
    clearApp()

    sleep(8000);
    console.info('..... [  打开今日头条 ] ........');
    launchApp("今日头条");



    
    console.info('..... [  打开首页 ] ........');
    sleep(3000);
    click("首页");


    sleep(8000);
    if (className("android.widget.Button").text("取消").exists()) {
        console.warn('..... [  界面出现了有未成的编辑的提示词 ] ........');
        let unfinish_page_obj = text("取消").depth(5).findOne(1000);
        unfinish_page_obj.click()
    }


    if (text("升级版本").depth(6).exists()) {
        console.warn('..... [  界面出现了软件升级提示词 ] ........');
        let unfinish_page_obj = desc("关闭").depth(6).findOne(1000);
        unfinish_page_obj.click()
    }



    console.info('..... [  点击 [我的]  ] ........');
    sleep(3000);
    click("我的");


    sleep(3000);
    if (!text("创作中心").depth(22).exists()) {
        console.error('..... [ 打开 [我的] 页面失败 ] ........');
        return;
    }



    console.info('..... [  点击 [去发文]  ] ........');
    sleep(4000);
    if (className("android.widget.TextView").desc("去发文").exists()) {
        click("去发文");
    } else {
        console.info('..... [  通过顶部的发文发文  ] ........');
        className("android.widget.ImageView").desc("发布").find().forEach(function (item, value) {
            item.click()
        });
    }



    sleep(4000);
    if (!text("图片智能配文").depth(20).exists()) {
        console.error('..... [ 打开 [去发文] 页面失败 ] ........');
        throw (" ..... [ 打开 [去发文] 页面失败 ] ........")
    }



    //点击【文章】tab 页面
    sleep(4000);
    console.info("....[ 点击 底部的 文章tab页面 ] ......");
    let _long_article_tab = className('android.widget.FrameLayout').depth(10).indexInParent(1).find();
    _long_article_tab.forEach(function(item,index){
        if(item.clickable){
            item.click()
        }
    });
    sleep(4000);


    

   //把 【   标题  】写入编辑框
    sleep(4000);
    console.info("....把 【 标题 】  写入编辑区......");
    let _long_article_title_obj = className('EditText').depth(20).indexInParent(0).findOne(1000);
    _long_article_title_obj.click();
    sleep(2000);
    _long_article_title_obj.setText(title);



      //  把 【  内容  】写入编辑框
    sleep(4000);
    console.info("....把【 内容 】 写入编辑区......");
    let _long_article_content_obj = className('EditText').depth(19).indexInParent(0).findOne(1000);
    let _content_bounds=_long_article_content_obj.bounds()
    var x = _content_bounds.centerX();
    var y = _content_bounds.centerY();
     click(x,y)   
     _long_article_content_obj.click();
    _long_article_content_obj.imeEnter()
    console.log('.....换行了.....');
    sleep(2000)
    _long_article_content_obj.setText(content)


    // 点击【下一步】
    sleep(3000);
    console.info("....点击 [  下一步   ]  按钮 ......");
    let _long_article_next_btn = className('android.widget.Button').text('下一步').depth(11).findOne(1000);
    _long_article_next_btn.click();



    // 点击【封面图片】
    let  _face_pic_view=  text("单图").depth(11).findOne(1000)
         _face_pic_view.click()
         let _face_pic_image_view = className('android.widget.ImageView').depth(14).findOne(1000);
         _face_pic_image_view.click()
             // // 全都选
    sleep(4000);
    console.info("------- [ 打开相册，开始选择相册 ] --------")
    className('android.widget.Button').depth(15).find().forEach(function (value, index) {
        if(index ===0 ){
            value.click();
        }
    });

        // // 【点击】
    sleep(4000);
    console.info("------- [ 打开相册，选择相册完，点击 【完成】 按钮 ] --------")
    let _click_img_finish=text('完成').depth(10).findOne(1000);
        _click_img_finish.click();



    // 点击【添加地址】
    sleep(4000);
    console.info("------- [ 点击【添加地址】 ] --------")
    let _click_img_add_address=desc('添加位置').depth(15).indexInParent(2).findOne(1000);
    _click_img_add_address.click();
    sleep(4000);
    let _click_img_add_default_address= className('android.widget.TextView').depth(15).indexInParent(0).findOne(1000);
       _click_img_add_default_address.click();

       
    // 点击【发布】
    // sleep(3000);
    // console.info("....点击[  发布 ]  按钮     ......");
    // let _long_article_publish_btn = text("发布").desc("发布").depth(11).findOne(1000);
    // _long_article_publish_btn.click()


    return true;
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

