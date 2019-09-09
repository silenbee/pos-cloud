var AipImageClassifyClient = require("baidu-aip-sdk").imageClassify;

// 设置APPID/AK/SK
var APP_ID = "15988012";
var API_KEY = "t3ZLCTuG6IpixB6WmkhclVl4";
var SECRET_KEY = "IVKoAXT69MNMuL3ttkeGQ5LRTUeYuYpL";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipImageClassifyClient(APP_ID, API_KEY, SECRET_KEY);



var fs = require('fs');

var image = fs.readFileSync("../test.jpg").toString("base64");

// 调用通用物体识别
client.advancedGeneral(image).then(function(result) {
    console.log(JSON.stringify(result));
}).catch(function(err) {
    // 如果发生网络错误
    console.log(err);
});

// 如果有可选参数
var options = {};
options["baike_num"] = "5";

// 带参数调用通用物体识别
client.advancedGeneral(image, options).then(function(result) {
    console.log(JSON.stringify(result));
}).catch(function(err) {
    // 如果发生网络错误
    console.log(err);
});;

