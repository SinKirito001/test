// 用户选择的角色接口

import setting from '../setting';

var get = setting;
var api = get.get_api_setting;
const app = getApp()

export default {
  add_role(data, func) {
    return get.request(api('role/add', data), func);
  },
  add_role_list(data , func){
    return get.request(api('role/add_list', data), func);
  },
  get_list(data,func){
    return get.request(api('role/get_list', data), func);
  },
  // 重新闯关
  reset_pass(data,func){
    return get.request(api('role/reset_pass', data), func);
  },
  get_role(role_id,func){
    return get.request(api('role/get_role', {role_id : role_id}), func);
  }
}