/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://b7byalw0.qcloud.la';

var myhost = 'https://hotpot.club/pos/api/v0';
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        uploadWaveformUrl: `${myhost}/get-audio?get-filename=true`,

        downloadAudioUrl: `${myhost}/get-audio`,

        uploadAudioUrl: `${myhost}/get-waveform?get-filename=true`,

        trainAudioUrl:'https://hotpot.club/pos/api/v0/get-waveform?get-filename=true',

        trainAudioUrl1:'https://xiaoyuu.top/pos/api/v0/get-waveform2?get-filename=true',

        downloadWaveformUrl: `${myhost}/get-waveform`,

        downloadTrainformUrl1:'https://xiaoyuu.top/pos/api/v0/get-waveform',

        downloadTrainformUrl: 'https://hotpot.club/pos/api/v0/get-waveform'
    },
    record:{
      duration: 400000,
      format:'mp3'
    },
    recordLimit:{
      minDuration: 2000
    }

};

module.exports = config;
