import bt from '../../lib/bt'
import role_api from '../../lib/api/role';
import account_api from '../../lib/api/account';
import answer from '../../lib/answer';
import setting from '../../lib/setting'
const app = getApp().globalData;

Page({
  data: {
    avatar: '',
    userInfo: null,
    missionArray: [{
      additionClass:"mission_locked",
      currentMission:false
    }, {
        additionClass: "mission_locked",
        currentMission: false
    }, {
        additionClass: "mission_locked",
        currentMission: false
    }, {
        additionClass: "mission_locked",
        currentMission: false
    }, {
        additionClass: "mission_locked",
        currentMission: false
    }, {
        additionClass: "mission_locked",
        currentMission: false
    }, {
        additionClass:"mission_locked",
        currentMission: false
    }, {
        additionClass:"mission_locked",
          currentMission: false
    }, {
        additionClass:"mission_locked",
        currentMission: false
    }, {
        additionClass:"mission_locked",
        currentMission: false
    }],
  },
  onShareAppMessage: function () {
    return setting.share();
  },
  onShow: function (options) {
    this.init();
    this.api_list_bind(this.lv_init);
  },
  // 初始化
  init(){
    bt.bar_title(getApp().title);
    setting.config.tap_time = 0;
    let userInfo = app.userInfo;
    this.setData({ avatar: userInfo.avatarUrl })
  },
  // 定位默认关卡
  lv_init( res ){
    // bt.log(res);
    // 设置当前我的位置
    this.data.missionArray.forEach(info=>{
      info.currentMission = false;
    });
    this.setData({ missionArray: this.data.missionArray });
    
    let userInfo = app.userInfo
    let lv = userInfo.role.lv;
    // 如果当前已经满级
    if(lv >= 10)lv = 9;
    let missionArray = this.data.missionArray[lv];
    missionArray.additionClass = 'mission_0star';
    missionArray.currentMission = true;
    this.setData({ missionArray: this.data.missionArray });
    // 遍历过关历史
    for(let info of res){
        let missionArray = this.data.missionArray[info.lv - 1];
        missionArray.additionClass = answer.get_score_tips(info.score).pass_bg;
        this.setData({ missionArray: this.data.missionArray });
    }
  },
  // 获取用户当前所有关卡
  api_list_bind( func ){
    let role = app.userInfo.role
    role_api.get_list({ account_id: role.account_id,account_role_id:role.id},(res)=>{
      func(res.data);
    })
  },
  // 开始闯关
  start(e){
    // 控制手速
    if (bt.tap_double(e)) {return;}
    else {setting.config.tap_time = e.timeStamp}

		let role = app.userInfo.role
		let lv = parseInt(e.currentTarget.dataset.lv);
		if (parseInt(role.lv) + 1 == lv) {
			bt.toast('海量题目准备中...');
			setTimeout(() => {
				// bt.log('mission.js > game start');
        bt.go('../paper/paper?lv=' + lv);
			}, 1000)
		}else{
			// bt.log('faile');
		};
  }
})