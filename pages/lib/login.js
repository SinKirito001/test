const app = getApp();
const gData = app.globalData;

import setting from './setting'
import account_api from './api/account';
import bt from './bt';

let __login = function(){};

__login.prototype.init = function( self ){
    wx.showLoading({ title: "正在登陆...", mask: true });
    // 微信授权登陆
    wx.getUserInfo({
      success: data => {
        let userInfo = gData.userInfo = JSON.parse(data.rawData);
        // bt.log('getUserInfo -> success');
        // bt.log(gData.userInfo);
        // 获取用户唯一OPENID并存放到全局中
        wx.login({
          success: res => {
            gData.userInfo.code = res.code;
            // 保存用户基础数据
            account_api.init(data, () => {
              // 隐藏登陆框
              wx.hideLoading();
              if (userInfo && userInfo.role) {
                if (userInfo.role.hasOwnProperty('score')) {
                  self.setData({ score: userInfo.role.score + '分' });
                }
                if (userInfo.hasOwnProperty('grade') && !isNaN(userInfo.grade)) {
                  self.setData({ grade_name: bt.get_grade(userInfo.grade) });
                }
                if (userInfo.role.lv >= 10) {
                  self.setData({ isStageClear: true });
                }
                // 拿到openid获取当前游戏信息
                // bt.log('getUserInfo > account_api > init');
                // bt.log(gData.userInfo);
                self.onCurrent();
              }
            });
          }
        });
      },
      fail(res) {
        wx.hideLoading();
        let openid = wx.getStorageSync(setting.config.cache_tag) || null;
        if (gData.userInfo) {
          self.userInfo_init({
            nickName: '游客',
            openid: openid,
            avatarUrl: self.data.cdn + '/timg.jpg'
          });
        }
        if (!openid) {
          openid = `temp-${bt.random()}`;
          wx.setStorageSync(setting.config.cache_tag, openid);
          if (!gData.userInfo) {
            self.userInfo_init({
              openid: openid,
              nickName: '游客',
              avatarUrl: self.data.cdn + '/timg.jpg'
            });
          }
          account_api.init([], res => {
            // bt.log(res);
          })
        }
      },
      complete() {
        // 更新用户头像
        self.update_user_info();
      }
    });
}

module.exports = new __login();