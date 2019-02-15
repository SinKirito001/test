import charts from '../../lib/charts';
import bt from '../../lib/bt'
import account_api from '../../lib/api/account';
import setting from '../../lib/setting'
const app = getApp().globalData;

Page({
  data: {
    cdn: getApp().cdn,
    width: wx.getSystemInfoSync().windowWidth,
    score : 0,
    grade : '年级',
    avatar : '',
    nickname : '',
    isStageClear : false,
    power_tips_1: '愿你历经千帆',
    power_tips_2: '归来时已是麒麟',
  },
  onLoad: function (options) {
    // bt.log('power.js > onLoad');
    // bt.log(app.userInfo);
    this.setData({ avatar: app.userInfo.avatarUrl, nickname: app.userInfo.nickName })
    this.api_bind(this.init);
  },
  onShareAppMessage: function () {
    return setting.share();
  },
  onReady() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#4c6fcb' });
  },
  api_bind( func ){
    bt.load('正在生成图谱');
    let data = {};
    if (app.userInfo.hasOwnProperty('account_id') && app.userInfo.hasOwnProperty('role')){
      data = { account_id: app.userInfo.account_id, role_id: app.userInfo.role.id };
    }else{
      bt.load_hide();
      return;
    }
    account_api.get_power(data, res => {
      // 判断是否参与过游戏并有积分
      if (res.data.info && res.data.info.hasOwnProperty('score')){
        app.userInfo.role.score = res.data.info.score;
        this.power_tips(res.data);
        this.chart_init(res.data);
        if(app.userInfo.role.lv >= 10){
          this.setData({ isStageClear : true});
        }
      }
      func();
      wx.hideLoading();
    })
  },
  // 渲染文字
  power_tips(res){
    // bt.log('power.tips');
    if (res.accuracy.length > 1){
      let max = Math.max(...res.accuracy);
      let min = Math.min(...res.accuracy);
      let max_index = res.accuracy.indexOf(max);
      let min_index = res.accuracy.indexOf(min);
      let max_text = res.subject[max_index];
      let min_text = res.subject[min_index];
      this.setData(
        { power_tips_2:setting.config.power_code['max_' + max_text],
          power_tips_1: setting.config.power_code['min_' + min_text]
        });
    }
  },
  init(){
    let role = app.userInfo.role;
    if (role && role.hasOwnProperty('id')){
      let json = { score: role.score, grade: bt.get_grade(role.grade) };
      this.setData(json);
    }else{
      bt.toast('当前没有参加任何比赛，没有图谱',2000);
      return;
    }
  },
  chart_init( res ){
    new charts({
      canvasId: 'pieCanvas',
      type: 'radar',
      categories: res.subject,
      series: [{
        name: '能力图谱',
        data: res.accuracy,
        labelColor: '#ffffff',
      }],
      width: this.data.width - 60,
      height: 200,
      extra: {
        radar: {
          max: 100,
          labelColor : '#ffffff',
          }
      }
    });
  }
})