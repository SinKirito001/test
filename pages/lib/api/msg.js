import setting from '../setting';

var get = setting;
var api = get.get_api_setting;
const app = getApp()

export default {
  send(data, func) {
    data.code = (function(){
      let out = "";
      do
        out = Math.floor(Math.random() * 10000);
      while (out < 1000)
      return out;
    })();
    console.log(data);
    return get.request(api('msg/send', data), func);
  },
}