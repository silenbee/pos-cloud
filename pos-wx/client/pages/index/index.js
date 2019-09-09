//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const recorder = wx.getRecorderManager();


Page({
   data:{
    //  recordBtnStatus:'recordBtnOff'
    //  waveformSrc:'https://hotpot.club/pos/api/v0/get-waveform/25b67f0cfcfb60e0fd33b9d220a88880.png'
   },
    // 上传声波图片接口
    doUploadWaveform: function () {
      var that = this

      // 选择图片
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          util.showBusy('正在上传')
          var filePath = res.tempFilePaths[0]
          // 上传图片
          wx.uploadFile({
            url: config.service.uploadWaveformUrl,
            filePath: filePath,
            name: 'file',
            success: function (res) {
              console.log(res)
              res = JSON.parse(res.data)
              if(res['err'])return util.showModel("失败".res['msg']);
              else util.showSuccess('开始加载声音')
              const src = util.getAudioUrl(res.res.filename)
              // that.setData({
              //   audioSrc: src
              // })
              const innerAudioContext = wx.createInnerAudioContext()
              innerAudioContext.autoplay = true
              innerAudioContext.src = src
              innerAudioContext.onPlay = function(err){
                util.showSuccess('正在播放声音')
              }
              innerAudioContext.onEnded = function(err){
                util.showSuccess('播放声音完毕')
              }
            },

            fail: function (e) {
              util.showModel('上传图片失败',e)
            }
          })

        },
        fail: function (e) {
          console.error(e)
        }
      })
    },


    // 再录制按钮上方
    doStartRecord :function(){
      var that = this
      recorder.start(config.record)
      util.showBusy('正在录制')
      recorder.onStop( function(audio){
        
        console.log(audio, audio.duration, config.recordLimit.minDuration)
        if (audio.duration < config.recordLimit.minDuration){
          return util.showModel('生成声波图失败', `声音长度应该大于${config.recordLimit.minDuration/1000}秒`)
        }
        else util.showSuccess('录制完成')
        var filePath = audio.tempFilePath
        console.log(filePath)
        console.log(config.service.uploadAudioUrl)
        wx.uploadFile({
          url: config.service.uploadAudioUrl,
          filePath: filePath,
          name: 'file',
          success: function (res) {
            console.log(res)
            res = JSON.parse(res.data)
            if (res['err']) return util.showModel("failed to convert",res['msg']);
            else util.showModel('开始加载声波图','点击声波图即可保存')
            that.setData({
              waveformSrc: util.getWaveformUrl(res.res.filename)
            })
          },
          fail: function (e) {
            util.showModel('生成失败',e)
          }
        })
      })
    },
    //离开录制按钮
    doEndRecord:function(){
      var that = this
      recorder.stop();
    },

    // 预览图片
    previewImg: function () {
      var url
      console.log(url = this.data['waveformSrc'] || this.data['imgUrl'])
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },
    saveImg: function () {
      var url
      console.log(url = this.data['waveformSrc'] || this.data['imgUrl'])
      wx.downloadFile({
        url:url,
        success:function(res){
          console.log(res)
          if (res['statusCode'] === 200){
            res = res.tempFilePath
            console.log(res)
            wx.saveImageToPhotosAlbum({
              filePath:res,
              success:function(){
                util.showSuccess('保存成功')
              },
              fail: function (err){
                util.showModel("保存失败",err)
              },
              complete:function(err){
                console.log('complete')
              }
            })
          }
          else {
            util.showModel("保存失败", err)
          }
          
        },
        fail:function(e){
          util.showModel("获取声波图失败",e)
        }
      })
    }
})
