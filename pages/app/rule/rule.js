import account_api from '../../lib/api/account';
import role_api from '../../lib/api/role';
import answer from '../../lib/answer';
import bt from '../../lib/bt'
import setting from '../../lib/setting'
Page({
  data: {
    cdn: getApp().cdn,
  },
  onReady: function () {
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#4c6fcb',
  })
  },
})