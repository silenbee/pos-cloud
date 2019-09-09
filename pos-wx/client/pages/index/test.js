//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const waveform_size = {
  x: 500,
  y: 200
}

const recorder = wx.getRecorderManager();


Page({
  data: {
    //  recordBtnStatus:'recordBtnOff'
    // waveformSrc:'https://hotpot.club/pos/api/v0/get-waveform/25b67f0cfcfb60e0fd33b9d220a88880.png',
    waveformSrc: config.service.downloadTrainformUrl,
    //  isGenerating:true/false
    templatePath: "../static/model3.jpg",
    //standardwave: '../static/model4.jpg',
    loadingHidden: true

  },
  onLoad: function (options) {
    this.audioContext=wx.createAudioContext("sound");
    console.log(options.opt)
    this.setData({
      character:options.opt
    })
    var that=this;
    wx.request({
      url: 'https://xiaoyuu.top/pos/api/v0/get-standardwave', // 仅为示例，并非真实的接口地址
      method:'POST',
      data: {
        character: that.data.character,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data["waveAddress"])
        that.setData({
          standardwave: res.data[0]["waveAddress"],
          standardsound: res.data[0]["audioAddress"]
        })
      }
    })
  },
  playstandard: function () {
    util.showShortBusy('正在播放声音')
    //const src = util.getAudioUrl('851cca2000825eb80ccaa82b5d8b0b84.mp3')
    console.log(this.data.standardsound)
    this.audioContext.play();
    // that.setData({
    //   audioSrc: src
    // })
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = src
    // innerAudioContext.onPlay = function (err) {
    //   util.showSuccess('正在播放声音')
    // }
    // innerAudioContext.onEnded = function (err) {
    //   util.showSuccess('播放声音完毕')
    // }
  },
  // 在录制按钮上方
  doStartRecord: function () {
    var that = this
    recorder.start(config.record)
    util.showBusy('正在录制')
    recorder.onStop(function (audio) {

      console.log(audio, audio.duration, config.recordLimit.minDuration)
      if (audio.duration < config.recordLimit.minDuration) {
        return util.showModel('生成声波图失败', `声音长度应该大于${config.recordLimit.minDuration / 1000}秒`)
      } else util.showSuccess('录制完成,评估中')

      that.setData({
        loadingHidden: false
      });

      var filePath = audio.tempFilePath
      console.log(filePath)
      console.log(config.service.trainAudioUrl)
      wx.uploadFile({
        url: config.service.trainAudioUrl,
        filePath: filePath,
        name: 'file',
        success: function (res) {
          that.setData({
            loadingHidden: true
          });

          console.log(res)
          res = JSON.parse(res.data)
          if (res['err']) return util.showModel("failed to convert", res['msg']);
          //else util.showModel('开始加载声波图', '点击声波图即可保存')
          var waveformSrc = util.getWaveformUrl(res.res.filename).replace(/jpg/g, 'png')
          console.log('SRC------------:' + waveformSrc)
          wx.getImageInfo({
            src: waveformSrc,
            success: function (res) {
              that.setData({
                waveformSrc: res.path
              })
              wx.setStorageSync(
                'waveformPath',
                res.path
              )
              that.canvasInit()

              // compare start--------------------------------------
              wx.request({
                url: 'https://xiaoyuu.top/pos/api/v0/get-similarrate', 
                method:'POST',
                data: {
                  src1: waveformSrc,
                  src2: that.data.standardwave
                },
                header: {
                  'content-type': 'application/json' 
                },
                success(res) {
                  // util.showSuccess('准确度为:'+String(res.data.rate)+'%')
                  util.showModel('说的不错','准确度为:'+String(res.data.rate)+'%   请张大嘴巴')
                  console.log(res.data.rate)
                },
                fail(err){
                  util.showModel('匹配失败',{err:'error'})
                }
              })
              //compare end--------------------------------------------
            }
          })
        },
        fail: function (e) {
          util.showModel('生成失败', e)
        }
      })
    })
  },
  // 离开录制按钮
  doEndRecord: function () {
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
    // ctx.drawImage(wx.getStorageSync('waveformPath'), startx * ratio, tary / 2 - 200 * ratio / 2, 500 * ratio, 200 * ratio)
    ctx.drawImage(wx.getStorageSync('waveformPath'), 0, 20, 500 * 0.4, 80 * 0.4)
    ctx.draw()
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
  // 保存图片
  saveImg: function () {
    var that = this
    that.setData({
      isGenerating: true
    })

    var ctx = wx.createCanvasContext('generate-canvas')

    var templatePath = that.data['templatePath']
    var waveformPath = wx.getStorageSync('waveformPath')
    if (!waveformPath) return
    var originx = 1049
    var originy = 709
    var tarx = 720
    var tary = 510
    var startx = 70
    var ratio = tarx / originx
    var window = 540 - 70
    var window_ratio = (540 - 70) / waveform_size.x * ratio
    console.log(window_ratio)
    ctx.drawImage(templatePath, 0, 0, tarx, tary)
    var tmp = ''
    ctx.drawImage(
      tmp || waveformPath, startx * ratio, tary / 2 - waveform_size.y / 2, waveform_size.x * window_ratio, waveform_size.y * window_ratio)

    ctx.draw(false, function (e) {
      wx.canvasToTempFilePath({
        canvasId: 'generate-canvas',
        fileType: 'jpg',
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              util.showSuccess('保存成功')
            },
            fail: function (err) {
              util.showModel("保存失败", err)
            },
            complete: function (err) {
              console.log('complete')
            }
          })
        },
        complete: function () {
          that.setData({
            isGenerating: false
          })
        }
      }, this)
    })
  }
})
