const app = getApp().globalData;
import answer from '../../lib/answer';
import bt from '../../lib/bt'
import setting from '../../lib/setting'
import question_api from '../../lib/api/question';
import role_api from '../../lib/api/role';
import leads_share from '../../lib/leads_share'

Page({
  data: {
    cdn: getApp().cdn,
    avatar: null,
    time: setting.config.time,
    time_percent: setting.config.time_percent,
    question_list: [],
    current_question: 0,
    question_info: {},
    number_animat: '',
    answer_animat: '',
    s_A: '',
    s_B: '',
    s_C: '',
    s_D: '',
    lv: null,
    sum_score: 0,
    status: true,
    showModal: false,
    mask_hide: true,
    pass_over:false,
    pass_number: 1,// 代表过关下一关或是重玩本关只有1和0两什值
    modal_tips: null,
    modal_btn_text: null,
    star_count: null
  },
  onShareAppMessage: function () {
    return setting.share(this.share_success);
  },
  onReady() {
    wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#84b647' });
    this.music_win = wx.createAudioContext('music_win')
    this.music_solt = wx.createAudioContext('music_solt');
  },
  onLoad: function (options) {
    // bt.log('paper.js > onload');
    this.data.lv = options.lv;
    this.init();
    this.api_bind(this.start);
  },
  onUnload() {
    // console.log('paper.js > unload');
    this.data.status = false;
    this.resert();
    // 此处延迟清理，主要为进入答题阶段（未正式开始）直接退场，定时变量未获取而延迟清除
    setTimeout(() => {
      answer.clear_time();
    }, 2500);
    if (!this.data.status) {
      bt.toast('中途退场，挑战失败~', 2000);
    }
  },
  resert() {
    // 清空计数器
    answer.clear_time();
    // 更新bar title
    bt.bar_title(getApp().title);
    // 重置手快
    setting.config.tap_time = 0;
    // 重置答题顺序索引
    this.data.current_question = 0;
    // 清空题库
    this.data.question_info = {};
    // 清空总数
    this.data.sum_score = 0;
    // 重置答题结果库
    app.answer_result = [];
  },
  // 初始化Event
  init() {
    // 重置
    this.resert();
    // 用户头像
    this.setData({ avatar: app.userInfo.avatarUrl });
  },
  // 倒记时开始
  time_start() {
    this.setData({ mask_hide : false});
    answer.time_down((time) => {
      // bt.log('time.start > ' + setting.config.down_time_tag)
      this.setData({
        time_percent: (setting.config.time - time) * setting.config.time,
        time: time
      });
    }, () => {
      // 如果在正常答题状态下
      if (this.data.status){
        // 时间到继续下一题
        if (this.data.current_question >= 4) {
          // 未答题，自动带入0分
          let answer_info = { question_id: -1, time: -1, result: 'no', subject: '' };
          app.answer_result.push(answer_info);
          return this.answer_over();
        } else {
          this.answer_next();
        }
      }
    });
  },
  // 下一题
  answer_next() {
    answer.clear_time();
    this.setData({ time_percent: setting.config.time_percent });
    this.data.time = setting.config.time
    this.setData({ current_question: ++this.data.current_question, answer_animat: '' })
    this.answer_start(this.data.current_question);
    this.animation_init();
    setTimeout(() => {
      this.setData({ mask_hide: false });
      this.time_start();
    }, 2500)
  },
  // 获取答题数据
  api_bind(func) {
    let role = app.userInfo.role;
    let data = { grade: role.grade, lv: this.data.lv };
    question_api.get_rand(data, res => {
      this.data.question_list = res.data;
      func();
    })
  },
  // 开始逐一答题
  answer_start(current) {
    this.setData({ question_info: this.data.question_list[current] });
    let role = app.userInfo.role
    // 加入事件检测
    // bt.log(`${bt.get_grade(role.grade)}第${parseInt(role.lv) + 1}关`);
    bt.bar_title(`${bt.get_grade(role.grade)}第${parseInt(role.lv) + 1}关`);
  },
  // 开始动画
  animation_init() {
    setTimeout(() => {
      this.setData({ number_animat: 'number_go' })
    }, 500);
    setTimeout(() => {
      this.setData({ number_animat: 'number_go_clear' })
    }, 1500);
    setTimeout(() => {
      this.setData({ answer_animat: 'answer_go' })
    }, 2000);
  },
  // 答题确认
  answer_sure(e) {
    answer.clear_time();
    this.setData({ mask_hide: true });
    if (bt.tap_double(e)) {
      // bt.log('answer.sure.double')
      return;
    }
    else {
      setting.config.tap_time = e.timeStamp
    }
    let answer_info = this.data.question_info;
    let sure_info = e.target.dataset.val;
    let info = {
      question_id: answer_info.id, time: this.data.time,
      subject: answer_info.subject
    };
    if (answer_info.answer.toUpperCase() == sure_info.toUpperCase()) {
      info.result = 'yes';
    } else {
      info.result = 'no';
    }
    let sDong = {}
    sDong[`s_${answer_info.answer.trim()}`] = 'sdong_' + info.result;
    this.setData(sDong);

    setTimeout(() => {
      this.setData({ s_A: '', s_B: '', s_C: '', s_D: '' });
      // 将答题结构塞入变量
      app.answer_result.push(info);
      // 实时计算总数
      this.setData({ sum_score: answer.sum_socre(app.answer_result) })
      // 直接下一题
      if (this.data.current_question >= 4) {
        return this.answer_over();
      } else {
        this.answer_next();
      }
    }, 1000)
  },
  // 异步开始封装 - 总开始
  start() {
    this.answer_start(this.data.current_question);
    this.animation_init();
    setTimeout(() => {
      this.time_start()
    }, 2500)
  },
  // 如果当前通关，分享成功即给予一次重闯机会
  share_success() {
    let role = app.userInfo.role;
    // if (role.lv >= 10) {
    //   role_api.reset_pass(role, res => {
        this.resert();
        // app.userInfo.role.lv = 0;
        // this.data.lv = 0;
        bt.redirect('../home/home');
    //   });
    // }
  },
  // 答题结束，重置
  answer_over() {
    // bt.log('paper.js > answer.over');
    let tips = answer.get_score_tips(this.data.sum_score);
    let role = app.userInfo.role;
    role.score = this.data.sum_score;
    if (tips.btn_txt == '下一关'){
      this.music_win.play();
    }else{
      this.music_solt.play();
    }
    this.setData({
      showModal: true, modal_tips: tips.msg, modal_btn_text: tips.btn_txt,
      pass_number: tips.pass_number, star_count: tips.star, status : true
    });
    this.answer_success();
  },
  // 答题结束，分值动画
  answer_success() {
    this.score_save(this.data.sum_score);
  },
  // 下一关
  next_pass(e) {
    // bt.log('paper.js > next_pass');
    // next_lv为判断是重玩本关还是下一关，默认加1，下一关
    let next_lv = parseInt(e.target.dataset.value);;
    this.data.lv = parseInt(this.data.lv) + next_lv;
    let json = { mask_hide:true, showModal: false, number_animat: '', answer_animat: '', sum_score: 0 };
    this.setData(json);
    this.setData({ current_question: 0, time_percent: setting.config.time_percent });
    this.animation_init();
    setTimeout(() => {
      this.resert();
      this.api_bind(this.start);
    }, 500)
  },
  // 保存关卡数据入库
  score_save() {
    answer.save_score.call(this, res => {
      // bt.log('paper.js > score_save');
      this.resert();
      // 如果通关
      if (app.userInfo.role.lv >= 10) {
        this.setData({ pass_over: true, star_count: 'stars_4'});
      }
    })
  },
	leads_share(){
		leads_share.if();
	}
})