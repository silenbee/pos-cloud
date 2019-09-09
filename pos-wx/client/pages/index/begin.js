// pages/index/begin.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    banner:[
      '../../images/bb3.jpg',
      '../../images/bb2.jpg',
      '../../images/bb1.jpg',
      '../../images/bb4.jpg'
    ],
    icon: ['../../images/orange.jpg','../../images/40dec43586fb39df230e8fe16e9c7e0e.jpg'],
    title:['水果可能对你的记忆有帮助','支付宝新型基金或取代'],
    cont:['今日科学家们对水果可以帮助人们增强记忆力的论证加以...','越来也多的大学生对某宝的基金...']
  },
  jumptorecord: function () {
    wx.navigateTo({
      url: 'index'
    })
  },
  jumptolisten: function() {
    wx.navigateTo({
      url:'listen'
    })
  },
  jumptotrain: function () {
    wx.navigateTo({
      url: 'train'
    })
  },
  jumptolist: function () {
    wx.navigateTo({
      url: '../learn/learn'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  
})