const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

   

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  userInfoHandler: function (e) {

    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                  // 可以传给后台，再经过解析获取用户的 openid
                  // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
              //     wx.request({
              //         // 自行补上自己的 APPID 和 SECRET
              //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx17185c9f8e15083e&secret=6d57d847131dadec3edee7fd83f588ab&js_code=' + res.code + '&grant_type=authorization_code',
              //         success: res => {
              //             // 获取到用户的 openid
              //             console.log("用户的openid:" + res.data.openid);
              //         }
              //     });
              //     wx.showToast({
              //       title: '成功',
              //       icon: 'success',
              //     });
              //   }
              // });
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'http://localhost:3000/user',
                    data: {
                      js_code: res.code,
                      userName:app.globalData.userInfo.nickName
                    },
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    success: res => {
                      // 获取到用户的 openid
                      console.log("用户的id:" + res.data);
                      app.globalData.sessionid=res.data;
                      wx.setStorage({
                        key: 'sessionid',
                        data: res.data,
                        success(res){
                          console.log('存好了')
                        } 
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                      });
                     // 重新加载
                      that.onLoad();
                    }
                  });
                }
              });

            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '还未授权'
          });

        }
      }
    });

    console.log('以下测试内容：'+e.detail.userInfo);
  },

  /*
  userInfoHandler: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  userInfoHandler(data) {
    wx.BaaS.handleUserInfo(data).then(res => {
    }, res => {
    })
  },*/
  shoucang: function () {
    wx.navigateTo({
      url: '../store/store'
    })
  },
  xiaoxi: function () {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  wzgl: function () {
    wx.navigateTo({
      url: '../wzgl/wzgl'
    })
  },
  yaoqing: function () {
    wx.navigateTo({
      url: '../yaoqing/yaoqing'
    })
  },
  yhkb: function () {
    wx.navigateTo({
      url: '../discount_new/discount_new'
    })
  },
  fk: function () {
    wx.navigateTo({
      url: '../fk/fk'
    })
  },
})