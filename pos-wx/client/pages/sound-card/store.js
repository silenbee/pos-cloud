// pages/index/store.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templatePath: "../static/model1.jpg"
  },
  // 画布初始化
  canvasInit: function (templatePath) {
    var that = this
    var ctx = wx.createCanvasContext('store-canvas')
    templatePath = templatePath||that.data['templatePath']
    ctx.drawImage(templatePath, 0, 0, 300, 150)
    ctx.drawImage(wx.getStorageSync('waveformPath'), 30, 50, 100, 50)
    ctx.draw()
  },
  chooseTemplate:function(e){
    var that = this
    var templatePath = e.target.dataset['templatePath']
    that.setData({
      templatePath: templatePath
    })
    that.canvasInit(templatePath)
  },
  saveImg: function () {
    var that = this
    that.setData({
      isGenerating: true
    })
    var templatePath = that.data['templatePath']
    var ctx = wx.createCanvasContext('generate-canvas')
    ctx.drawImage(templatePath, 0, 0, 720, 510)
    ctx.drawImage(wx.getStorageSync('waveformPath'), 50, 170, 240, 170)
    ctx.draw(false, function (e) {
      wx.canvasToTempFilePath({
        canvasId: 'generate-canvas',
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
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.canvasInit()

  },

})