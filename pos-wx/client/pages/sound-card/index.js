//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const waveform_size = {
  x : 500,
  y : 200
}

const recorder = wx.getRecorderManager();


Page({
  data: {
    //  recordBtnStatus:'recordBtnOff'
      // waveformSrc:'https://hotpot.club/pos/api/v0/get-waveform/25b67f0cfcfb60e0fd33b9d220a88880.png',
    //  isGenerating:true/false
    templatePath: "../static/model2.jpg"
  },
  jumptostore: function () {
    var that = this
    var path = wx.getStorageSync('waveformPath')
    if (!path){
      return util.showModel('不能进入商城','请先录音')
    }
    wx.navigateTo({
      url: 'store'
    })
  },
  // 在录制按钮上方
  doStartRecord: function() {
    var that = this
    recorder.start(config.record)
    util.showBusy('正在录制')
    recorder.onStop((audio)=>{

      console.log(audio, audio.duration, config.recordLimit.minDuration)
      if (audio.duration < config.recordLimit.minDuration) {
        return util.showModel('生成声波图失败', `声音长度应该大于${config.recordLimit.minDuration/1000}秒`)
      } else util.showSuccess('录制完成')
      var filePath = audio.tempFilePath
      console.log(filePath)
      console.log(config.service.uploadAudioUrl)
      wx.uploadFile({
        url: config.service.uploadAudioUrl,
        filePath: filePath,
        name: 'file',
        success: function(res) {
          console.log(res)
          res = JSON.parse(res.data)
          if (res['err']) return util.showModel("failed to convert", res['msg']);
          else util.showModel('开始加载声波图', '点击声波图即可保存')
          var waveformSrc = util.getWaveformUrl(res.res.filename).replace(/jpg/g, 'png')
          wx.getImageInfo({
            src: waveformSrc,
            success: function(res) {
              that.setData({
                waveformSrc: res.path
              })
              wx.setStorageSync(
                'waveformPath',
                res.path
              )
              that.canvasInit()
            }
          })
        },
        fail: function(e) {
          util.showModel('生成失败', e)
        }
      })
    })
  },
  // 离开录制按钮
  doEndRecord: function() {
    var that = this
    recorder.stop()
  },
  // 画布初始化
  canvasInit: function (templatePath) {
    var that = this
    var ctx = wx.createCanvasContext('uploader-canvas')
    templatePath = templatePath || that.data['templatePath']
    var tarx = 300
    var tary = 150
    var startx = 70
    ctx.drawImage(templatePath, 0, 0, tarx, tary)
    var ratio = 0.28
    console.log('ondrwa')
    ctx.drawImage(wx.getStorageSync('waveformPath'), startx * ratio, tary / 2 - 200*ratio/2, 500*ratio, 200*ratio)
    ctx.draw()
  },
  // 预览图片
  previewImg: function() {
    var url
    console.log(url = this.data['waveformSrc'] || this.data['imgUrl'])
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  // 保存图片
  saveImg: function() {
    var that = this
    that.setData({
      isGenerating: true
    })

    var ctx = wx.createCanvasContext('generate-canvas')

    var templatePath = that.data['templatePath']
    var waveformPath = wx.getStorageSync('waveformPath')
    if(!waveformPath)return
    var originx = 1049
    var originy = 709
    var tarx = 720
    var tary = 510
    var startx = 70
    var ratio = tarx / originx
    var window = 540 - 70
    var window_ratio = (540- 70)/waveform_size.x * ratio
    console.log(window_ratio)
    ctx.drawImage(templatePath, 0, 0, tarx, tary)
    var tmp =  ''
    ctx.drawImage(
      tmp || waveformPath, startx * ratio, tary / 2 - waveform_size.y / 2, waveform_size.x * window_ratio, waveform_size.y * window_ratio)

    ctx.draw(false, function(e) {
      wx.canvasToTempFilePath({
        canvasId: 'generate-canvas',
        fileType:'jpg',
        success: function(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
              util.showSuccess('保存成功')
            },
            fail: function(err) {
              util.showModel("保存失败", err)
            },
            complete: function(err) {
              console.log('complete')
            }
          })
        },
        complete: function() {
          that.setData({
            isGenerating: false
          })
        }
      }, this)
    })
  }
})
