const app = getApp();
const gData = app.globalData;

import account_api from '../../lib/api/account';
import role_api from '../../lib/api/role';
import answer from '../../lib/answer';
import bt from '../../lib/bt'
import setting from '../../lib/setting'
import leads_share from '../../lib/leads_share'
import login from '../../lib/login'

Page({
  data: {
    isStageClear: false,
    hidden: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    grade_name: '年级',
    score: '-',
    cdn: app.cdn
  },
  // 分享
  onShareAppMessage: function () {
    return setting.share();
  },
  onReady() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#4c6fcb' });
    this.playMusic();
  },
  // 播放背景音乐
  playMusic() {
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.play();
  },
  onLoad() {
    // bt.log('onload');
    answer.clear_time();
    login.init( this );
  },
  // 应用隐藏
  onHide() {
    this.setData({ hidden: true });
    wx.hideLoading();
  },
  // 进入闯关
  pass_go() {
    wx.showLoading({ title: "正在进入闯关赛...", mask: true });
    // 判断当前用户是否创建过 Leads
    leads_share.if();
  },
  init() {
    this.playMusic();
    bt.bar_title(app.title);
  },
  onCurrent() {
    account_api.get_current_role(res => {
      if (res.data && res.data.hasOwnProperty('id')) {
        this.userInfo_init({
          account_id: res.data.account_id,
          grade: res.data.grade,
          lv: res.data.lv,
          score: res.data.score
        })
        // bt.log(app.userInfo)
        if (gData.userInfo && gData.userInfo.hasOwnProperty('role')) {
          gData.userInfo.role = res.data;
          if (gData.userInfo.role.lv >= 10) {
            this.data.isStageClear = true;
          } else {
            this.data.isStageClear = false;
          }
        }
        this.setData({
          isStageClear: this.data.isStageClear,
          score: res.data.score + '分'
        });
        // 在线生成测试报告会出错
        if (res.data && res.data.hasOwnProperty('grade')) {
          this.setData({ grade_name: bt.get_grade(res.data.grade) });
        }
      }
    })
  },
  onShow() {
    this.init();
    if (wx.getStorageSync(setting.config.cache_tag)) {
      // bt.log('onshow -> current');
      this.onCurrent();
    }
  },
  // 获取用户头像
  update_user_info() {
    // bt.log('update_user_info')
    if (gData.userInfo) {
      this.setData({
        userInfo: gData.userInfo,
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
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          gData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
  },
  // 全局UserInfo动态赋值
  userInfo_init(data) {
    if (gData.userInfo) {
      for (let item in data) {
        gData.userInfo[item] = data[item];
      }
    } else {
      gData.userInfo = data;
    }
  }
})