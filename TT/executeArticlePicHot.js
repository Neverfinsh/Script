// 上传接口，获取最新的文件的名称，然后更新；
//  
// 设计一张表，根据状态，获取对应的日期的脚本。
// 下载线上最新的autojs的脚本
// 下载下来
// 执行脚本、
var url = "http://101.201.33.155/ymystatic/script/executeArticlePic.js"//你要运行的js云端源码
var res = http.get(url);
var Source = res.body.string();
// log(Source)
if (Source != "") {
      engines.execScript("远程云代码", Source);
} else {
      toast("获取远程的脚本失败");
}
