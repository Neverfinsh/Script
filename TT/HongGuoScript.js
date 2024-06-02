

main()

function execute(){
    let counter=0
    while(counter<1000){
        var num = (Math.random() * 0.99 + 0.01).toFixed(2);
        console.log("--------[循环的次数]--------" + counter);
        console.log("--------[随机数生成]--------" + num);
        let y2 = num
        sleep(3000);
        swipe(device.width / 2, device.height * y2, device.width / 2, y2, 1000);
        counter++;
        sleep(1000*30)
        // 点赞功能
    }
}




function main(){

    openConsoloeLogUtil()
    
    // console.info('..... [ 清除后台所有应用 ] ........');
    // clearAppUtil()

    // sleep(8000);
    // console.info('..... [  打开有柿 ] ........');
    // launchApp("有柿");


    // sleep(3000);
    // console.info('..... [  打开任务 ] ........');
    // click("任务");

    // sleep(3000);
    // console.info('..... [  点击阅读 翻倍中  1 ] ........');
    //  let rich_double_obj= className("com.lynx.tasm.behavior.ui.view.UIView").depth(15).indexInParent(300).findOne(1000)
    //  rich_double_obj.click();

     console.info('..... [  点击<开宝箱得金币> : 点击 <宝箱>  ] ........');
   //  let rich_report_obj= className("com.lynx.tasm.behavior.ui.view.LynxFlattenUI").depth(15).indexInParent(359).childCount(0).findOne(1000)
     // TODO: 一秒钟执行一次，判断是否开宝箱得
     let rich_report_obj= desc("开宝箱得金币").depth(15).findOne(1000)
     
     //let rich_report_obj= desc("领福利").depth(15).findOne(1000)
     //console.warn('.....rich_report_obj......',rich_report_obj);
     //rich_report_obj.click();
     //sleep(3000)
     console.info('..... [  执行完毕！ ] ........');
   // console.info('..... [  看宝箱 ] ........');
   
}





function clearAppUtil() {
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
  


  function openConsoloeLogUtil(){
    console.show();
    console.setSize(800,1000)
    console.setPosition(70, 100);
}






