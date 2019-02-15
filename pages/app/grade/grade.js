//获取应用实例
const app = getApp().globalData;
import account_api from '../../lib/api/account';
import role_api from '../../lib/api/role';
import answer from '../../lib/answer';
import bt from '../../lib/bt'
import setting from '../../lib/setting'

Page({
  data: {
    cdn: getApp().cdn,
    gradeClass: ["grade1", "grade2", "grade3","grade4","grade5","grade6"],
    gradeClassChecked: ["grade1_checked", "grade2_checked", "grade3_checked","grade4_checked","grade5_checked","grade6_checked"],
    starGameSrc: getApp().cdn + '/start-1.png',
    grade : null
  },
  onLoad(options){
    // bt.log('grade.js > onload');
    // bt.log(app.userInfo);
    // 如果通过选择年级进入
    if (options.hasOwnProperty('grade')){
      this.__grade(parseInt(options.grade));
    }
  },
	onShareAppMessage: function () {
		return setting.share();
	},
  // 检测用户之前是否已经选择年级，并跳转
  check_grade(){
    // bt.log('grade.js > check_grade');
    //bt.log(app.userInfo.role);
    if (app.userInfo && app.userInfo.hasOwnProperty('role')){
      if (app.userInfo.role.hasOwnProperty("id")) {
        bt.redirect('../mission/mission');
      }
    }
  },
  // 进入挑战
  start(e) {
    if (bt.tap_double(e)){
      // bt.log('start game quick')
      return false;
    }else {
      setting.config.tap_time = e.timeStamp
    }
    if (this.data.grade == null) {
      bt.toast('请先选择所在年级~',1000);
      return;
    }
    // 默认7年级
    let userInfo = app.userInfo;
    userInfo.status = 'pass';
    // bt.log('grade.index > start');    
    role_api.add_role(userInfo,(res)=>{
      if(res.data.account_id > 0){
        // 将当前角色绑客户全局
        app.userInfo.grade = res.data.grade;
        app.userInfo.role = res.data;
        // bt.log('当前角色');
        // bt.log(app.userInfo.role);
        bt.redirect('../mission/mission');
      }else{
        bt.show('消息','用户登陆失败,请重新进入游戏');
      }
    })
  },
  // 选择年级带入系统
  __grade(grade){
    this.data.grade = app.userInfo.grade = (() => {
      switch (parseInt(grade)) {
        case 0:
          return 7;
        case 1:
          return 8;
        case 2:
          return 9;
        case 3:
          return 4;
        case 4:
          return 5;
        case 5:
          return 6;
      }
      return -1;
    })();
    // bt.log('grade is ' + this.data.grade);
    this.data.gradeClass = ["grade1", "grade2", "grade3","grade4","grade5","grade6"];
    let index = grade;
    this.data.gradeClass[index] = this.data.gradeClassChecked[index];
    this.setData({
      gradeClass: this.data.gradeClass,
      starGameSrc: this.data.cdn + "/start-2.png"
    })
  },
  // 切换年级大图Btn
  selectGrade: function (event) {
    this.__grade(event.target.dataset.gradeType);
  }
})