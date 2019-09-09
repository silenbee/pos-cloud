// pages/index/listen.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const recorder = wx.getRecorderManager();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shuru: true,
    shuchu: false
  },
  doUploadWaveformal: function() {
    var that = this
    this.setData({

      shuru: false,
      shuchu: true

    })

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage(filePath, 0, 0, 300, 150)
        ctx.draw()
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadWaveformUrl,
          filePath: filePath,
          name: 'file',
          success: function(res) {
            console.log(res)
            res = JSON.parse(res.data)
            if (res['err']) return util.showModel("失败", "转换失败，请重试");
            else util.showSuccess('开始加载声音')
            const src = util.getAudioUrl(res.res.filename)
            // that.setData({
            //   audioSrc: src
            // })
            const innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src = src
            innerAudioContext.onPlay = function(err) {
              util.showSuccess('正在播放声音')
            }
            innerAudioContext.onEnded = function(err) {
              util.showSuccess('播放声音完毕')
            }
          },

          fail: function(e) {
            util.showModel('上传图片失败', e)
          }
        })

      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  doUploadWaveformca: function() {
    var that = this
    this.setData({

      shuru: false,
      shuchu: true

    })
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        const ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage(filePath, 0, 0, 300, 150)
        ctx.draw()
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadWaveformUrl,
          filePath: filePath,
          name: 'file',
          success: function(res) {
            console.log(res)
            res = JSON.parse(res.data)
            if (res['err']) return util.showModel("失败", "转换失败，请重试");
            else util.showSuccess('开始加载声音')
            const src = util.getAudioUrl(res.res.filename)
            // that.setData({
            //   audioSrc: src
            // })
            const innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src = src
            innerAudioContext.onPlay = function(err) {
              util.showSuccess('正在播放声音')
            }
            innerAudioContext.onEnded = function(err) {
              util.showSuccess('播放声音完毕')
            }
          },

          fail: function(e) {
            util.showModel('上传图片失败', e)
          }
        })

      },
      fail: function(e) {
        console.error(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
