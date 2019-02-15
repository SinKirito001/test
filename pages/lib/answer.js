import bt from 'bt'
import setting from 'setting'
import role_api from 'api/role';

let answer = function(){};
// content 获取上下文关系
answer.prototype.init = function( content ){
  this.content = content;
}
// 倒记时
answer.prototype.time_down = function( func ,over){
  let i = setting.config.time;
  let time_tag = setInterval(() => {
    if (i > 0) {
      func(--i);
    } else {
      this.clear_time();
      over();
    }
  }, 1000);
  // 将定时器标准套入定时数组
  setting.config.down_time_tag.push(time_tag);
}
// 清除倒记时
answer.prototype.clear_time = function(){
  for (let i of setting.config.down_time_tag){
    // bt.log('time is ' + i);
    clearInterval( i );
  }
  setting.config.down_time_tag = [];
}
// 计算总数
answer.prototype.sum_socre = function(list){
  let sum_score = 0;
  for (let info of list) {
    let i = list.indexOf(info);
    if (info.result == 'yes') {
      let score = 0;
      if (info.time == 10) {
        score = setting.config.score;
      } else if (info.time > 0) {
        score = setting.config.score - 10 + info.time;
      } else {
        score = 10;
      }
      if (i == 4) {
        score *= 2;
      }
      sum_score += score;
    }
  }
  return sum_score;
}
// 保存答题结果
answer.prototype.save_score = function(func ){
  bt.log('answer.js -> save_score');
  let app = getApp();
  let role = app.globalData.userInfo.role;
  let data = { account_id: role.account_id };
  data.account_role_id = role.id;
  data.score = this.data.sum_score;
  data.lv = this.data.lv;
  data.answer_data = JSON.stringify(app.globalData.answer_result);
  data.status = 0;
  if (data.score >= setting.config.score_pass) {
    data.status = 1;
  }
  role_api.add_role_list(data, res => {
    app.globalData.userInfo.role.lv = res.data.lv;
    func(res.data);
  });
}
// 根据5题分值换算提示结果
answer.prototype.get_score_tips = function(score){
  // 根据后端配置文件获取过关亮星分值
  let config = getApp().globalData.config;
  let first_score_1 = config.first_score_1 || 69;
  let first_score_2 = config.first_score_2 || 85;
  let second_score_1 = config.second_score_1 || 84;
  let second_score_2 = config.second_score_2 || 100;
  let thirdly_score = config.thirdly_score || 99;
  setting.config.score_pass = first_score_1 + 1;

	// pass_number 代表叠加下一关或重玩本关
  let tips = { btn_txt: '下一关', pass_number: 1,pass_bg: 'mission_0star', star: 'stars_0'};
  if (score > first_score_1 && score < first_score_2){
    tips.msg = '成功向你抛来一丢丢媚眼';
    tips.pass_bg = 'mission_1star';
    tips.star = 'stars_1';
  } else if (score > second_score_1 && score < second_score_2) {
    tips.msg = '明明可以靠脸，偏要靠才华';
    tips.pass_bg = 'mission_2star';
    tips.star = 'stars_2';
  } else if (score > thirdly_score) {
    tips.msg = '“眼”技一流，傲视群雄';
    tips.pass_bg = 'mission_3star';
    tips.star = 'stars_3';
	}else{
		tips.btn_txt = '再试下';
    tips.msg = '失败背后总有个点错的手指';
		tips.pass_number = 0;
	}
	return tips;
}

module.exports = new answer();