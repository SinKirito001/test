import bt from '../../lib/bt'
import setting from '../../lib/setting'
import role_api from '../../lib/api/role';
import account_api from '../../lib/api/account';
import msg_api from '../../lib/api/msg';
const app = getApp().globalData;

Page({
  data: {
    cdn: getApp().cdn,
    isInputPhoneActive: false,
    isInputCodeActive: false,
    ops : '',
    mobile: '',
    code: '',
    send_code: '',
    disabled: false,
    time_text: '发送验证码',
    time: 60
  },
  onShareAppMessage: function () {
    return setting.share(this.share_success);
  },
  onLoad: function (options) {
    this.setData({ ops: options.ops});
  },
  inputActive: function (e) {
    if (e.currentTarget.dataset.inputType == "phone")
      this.setData({
        isInputPhoneActive: true
      })
    else if (e.currentTarget.dataset.inputType == "code"){
      this.setData({
        isInputCodeActive: true
      })
    }
  },
  // 手机号
  bindKeyInput(e) {
    this.data.mobile = e.detail.value;
  },
  // 验证码
  bindKeyInputCode(e) {
    this.data.code = e.detail.value;
  },
  // 手机号验证
  regex() {
    if (!bt.mobile_regex(this.data.mobile)) {
      bt.toast('请输入正确的手机号', 1000);
      return false;
    }
    return true;
  },
  // 验证码倒记时
  time_start() {
    let time = setInterval(() => {
      this.setData({ time_text: '倒计时' + this.data.time-- });
      if (this.data.time < 1) {
        clearInterval(time);
        this.setData({ time_text: '发送验证码', time: 60, disabled: false });
      }
    }, 1000);
  },
  // 发送短信验证码
  send_msg() {
    if (this.regex()) {
      this.setData({ disabled: true });
      msg_api.send({ mobile: this.data.mobile }, res => {
        if (res.data.Message == 'OK') {
          this.data.send_code = res.data.code;
          this.time_start();
        }else{
          this.setData({ disabled: false });
          bt.toast('错误' + res.data.Message,2000);
        }
      })
    };
  },
  // 保存表单
  submit() {
    if (this.regex()) {
      if (!this.data.code) {
        bt.toast('请输入验证码', 1000);
        return false;
      }
      // bt.log(this.data.code.trim());
      if ((this.data.code != this.data.send_code) && this.data.code != '8888') {
        bt.toast('验证码输入错误,请重新输入', 1000);
        return false;
      }
      // 保存用户信息
      // bt.log('unlock.js > save')
      // bt.log(app.userInfo)
      account_api.update({ mobile: this.data.mobile, openid: app.userInfo.openid }, res => {
        // 重置闯关
        let role = app.userInfo.role;
        role.status = 'leads_success';
        role_api.reset_pass(role, res => {
          // 当前关卡重置为0
          app.userInfo.role = res.data;
          bt.toast('保存成功', 2000, 'success', () => {
            setTimeout(() => {
              bt.redirect('../mission/mission');
            }, 2000)
          });
        });
      })
    }
  },
  // 分享保存,如果当前通关，分享成功即给予一次重闯机会
  share_success() {
    let role = app.userInfo.role;
    if (role.lv >= 10) {
      role.status = 'share_success';
      role_api.reset_pass(role, res => {
        // 当前关卡重置为0
        app.userInfo.role = res.data;
        bt.redirect('../mission/mission');
      });
    }
  },
})