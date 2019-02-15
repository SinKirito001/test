//app.js
import question_api from 'pages/lib/api/question';
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取配置信息
    question_api.get_setting(res =>{
      this.globalData.config = res.data;
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
							// this.globalData.nickName = res.userInfo.nickName;
							// console.log(this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    // 用户个人基础信息
    userInfo: {
      role : {}
    },
    // 答题结果
    answer_result : [],
    // 过关用分配置，API获取
    config : {}
  },
  cdn: 'http://pcp-guanjiastatics.oss-cn-shanghai.aliyuncs.com/xcx_pass',
  title : '学霸冲冲冲'
})