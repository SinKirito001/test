import bt from 'bt'
import setting from 'setting'
import role_api from 'api/role';
import account_api from 'api/account';
const app = getApp();

let leads_share = function () { };
leads_share.prototype.if = function () {
	let role = app.globalData.userInfo.role
	// 如果没有选择任何年级
	if (!role || !role.hasOwnProperty('id')) {
		bt.go('/pages/app/grade/grade');
		return;
	}
  if (role && role.hasOwnProperty("id") && role.lv < 10) {
    bt.go('../mission/mission');
    return;
  }
	// bt.log(role);
	role_api.get_role(role.id, res => {
		let lv = res.data.lv;
		account_api.get_account_by_openid({ openid: app.globalData.userInfo.openid }, res => {
			// bt.log(lv)
			if (lv >= 10 && res.data.lead_created == null) {
				// bt.toast('填写表单复活', 2000);
				bt.go('/pages/app/unlock/unlock?ops=leads');
			}
			else if (lv >= 10) {
				// bt.toast('分享复活', 2000);
				bt.go('/pages/app/unlock/unlock?ops=share');
			} else {
				bt.go('/pages/app/grade/grade');
			}
			wx.hideToast();
		});
	})
}

module.exports = new leads_share();