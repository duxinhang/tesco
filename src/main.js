import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import $ from 'jquery'

// 在main.js导入lib-flexible
import 'lib-flexible';

// 在main.js引入font-awesome的样式文件
import 'font-awesome/css/font-awesome.min.css'

// 在main.js引入
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

//发起请求之前处理
axios.interceptors.request.use(config => {
  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }
    config.data = paramsString.slice(0, -1);
  }
  return config;
})

Vue.config.productionTip = false

new XMLHttpRequest().withCredentials = true;
//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

// 按需导入vant
import {
  Tabbar,
  TabbarItem,
  Search,
  Form,
  Icon,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  NoticeBar,
  Card,
  Tag,
  NavBar,
  Lazyload,
  GoodsAction,
  goodsActionIcon,
  GoodsActionButton,
  Rate,
  SwipeCell,
  Stepper,
  Popup,
  Skeleton,
  Button,
  Toast,
  Empty,
  Divider,
  CountDown,
  Cell,
  Checkbox,
  SubmitBar,
  Field,
  Uploader,
  ContactCard,
  ContactList,
  ContactEdit,
  AddressList,
  AddressEdit,
  CellGroup,
  Tab,
  Tabs
} from 'vant';

Vue
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Form)
  .use(Icon)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(NoticeBar)
  .use(Card)
  .use(Tag)
  .use(NavBar)
  .use(Lazyload)
  .use(GoodsAction)
  .use(goodsActionIcon)
  .use(GoodsActionButton)
  .use(Rate)
  .use(SwipeCell)
  .use(Stepper)
  .use(Popup)
  .use(Skeleton)
  .use(Button)
  .use(Toast)
  .use(Empty)
  .use(Divider)
  .use(CountDown)
  .use(Cell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(Field)
  .use(Uploader)
  .use(ContactCard)
  .use(ContactList)
  .use(ContactEdit)
  .use(AddressList)
  .use(AddressEdit)
  .use(CellGroup)
  .use(Tabs)
  .use(Tab)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')