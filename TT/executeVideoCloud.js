
// 读取版本后，存本地
// 执行脚本 ;
// 在脚本，在读取最新的版本后，不一致，就重新加载脚本，重新加载脚本,读取俩次接口
// 提供一个接口，修改润色模板


var url = "http://101.201.33.155/ymystatic/script/executeVideoCommon.js"

var res = http.get(url);

var Source = res.body.string();


if (Source != "") {
      engines.execScript("远程云代码", Source);
} else {
      toast("获取远程的脚本失败!");
}
