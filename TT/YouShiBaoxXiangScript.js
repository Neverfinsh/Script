console.log("开始循环播放")
execute();

function execute(){
    console.show();
    console.setSize(800,1000)
    console.setPosition(70, 100);
    let counter=0
    while(true){
        console.log("--------[自动看的次数]--------" + counter);
        let y2 = 0.82
        sleep(3000);
        swipe(device.width / 2, device.height * y2, device.width / 2, y2, 1000);
        sleep(1000*15)
        counter++;
    }
    
}
