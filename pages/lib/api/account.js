// 用户帐号接口

import setting from '../setting';
import bt from '../bt';

var get = setting;
var api = get.get_api_setting;

export default {
  init(res,func){
    let userInfo = getApp().globalData.userInfo;
		let openid = wx.getStorageSync(setting.config.cache_tag) || null;
    bt.log(openid)
    if (openid && openid.length < 15){
      openid = null;
    }
		if(! openid){
			this.get_by_openID(userInfo.code, res => {
				getApp().globalData.userInfo.openid = res.data.openid;
        wx.setStorageSync(setting.config.cache_tag,res.data.openid);
				this.get_account_role(func);
			})	
		}else{
			getApp().globalData.userInfo.openid = openid;
			this.get_account_role(func);
		}
	},
	get_account_role(func){
    bt.log('get_account_role');
    bt.log(getApp().globalData.userInfo)
		this.add_or_get(getApp().globalData.userInfo, res => {
			getApp().globalData.userInfo.grade = parseInt(res.data.role.grade);
      // 获取leads收集到的时间
      getApp().globalData.userInfo.lead_created = res.data.lead_created;
			getApp().globalData.userInfo.account_id = res.data.account_id;
			getApp().globalData.userInfo.role = res.data.role;
			// 拿到用户数据后进行回调
			func();
		})
	},
  update( data ,func){
    return get.request(api('account/update', data), func);
  },
  // 获取用户唯一OPENID
  get_by_openID( code ,func){
    let data = {code : code};
    return get.request(api('account/get_openid', data), func);
  },
  // 返回单个Account
  get_account_by_openid(data, func = null) {
    return get.request(api('account/get_account_by_openid', data), func);
  },
  // 用户登陆创建新用户
  add_or_get(data,func){
    return get.request(api('account/add_or_get', data), func);
  },
  //  获取用户能力图谱
  get_power(data, func) {
    return get.request(api('account/get_power', data), func);
  },
  // 获取用户当前所在的年级角色
  get_current_role( func ){
    let data = { openid: wx.getStorageSync(setting.config.cache_tag) };
    return get.request(api('account/get_current', data), func);
  },
  get_rank(data,func){
    return get.request(api('account/rank', data), func);
  }
}