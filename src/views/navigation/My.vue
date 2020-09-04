<template>
  <div>
    <div class="my" :style="{backgroundImage: 'url('+require('../../assets/timg.jpg')+')'}">
      <div class="Lmy fl">
        <div class="Lmy_img">
          <img :src="userlist.userImg ? userlist.userImg : require('../../assets/dlu.png')" alt />
        </div>
      </div>
      <div class="Rmy fr" v-if="isActive">
        <div class="Rmy_icon">
          <div class="icon">
            <van-icon name="setting-o" @click="setupthe" />
            <!-- <van-icon name="chat-o" /> -->
          </div>
        </div>
        <div class="Rmy_title">用户ID：{{userlist.nickName}}</div>
        <div class="Rmy_text">
          <i class="fl">
            <van-icon name="edit" />
          </i>
          <span class="fl">{{userlist.desc == "" ? "个性签名" : userlist.desc}}</span>
        </div>
        <div class="Rmy_tab">
          <div class="tab_box fl" v-for="(item,index) in record" :key="index" @click="addextension(index)">
            <div class="tab_top">{{item.title}}</div>
            <div class="tab_btn">{{item.num}}</div>
          </div>
        </div>
      </div>
      <div class="Rmy fr" v-else>
        <div @click="login" class="login fl">登录</div>
        <div class="login fl">/</div>
        <div @click="registered" class="login fl">注册</div>
      </div>
    </div>

      <!-- 订单 -->
      <div class="setting">
        <div class="take clearfix">
          <div class="take_tab fl" v-for="(item,index) in take" :key="index" @click="order(index)">
            <div class="take_img">
              <img :src="item.url" alt />
            </div>
            <div class="take_text">{{item.title}}</div>
          </div>
        </div>
        <div class="take clearfix">
          <div class="take_tab fl" v-for="(item,index) in befor" :key="index" @click="updata(index)">
            <div class="take_img">
              <img :src="item.url" alt />
            </div>
            <div class="take_text">{{item.title}}</div>
          </div>
        </div>
      <!-- 工具于服务 -->
        <div class="extension">
          <div class="title">
            <div class="fl">工具与服务</div>
          </div>
          <div
            class="fl extension_box"
            v-for="(item,index) in extension"
            :key="index"
            @click="addextension"
          >
            <div class="extension_img">
              <img :src="item.url" alt="">
            </div>
            <div class="extension_text">{{item.text}}</div>
          </div>
        </div>

        <!-- 特别推荐 -->
        <div class="recommended">
          <h1>-- 为你推荐 --</h1>
          <div class="list">
            <div
              class="list_tab"
              v-for="(item,index) in setgoodslist"
              :key="index"
              @click="jumpdetails(item.goods_id)"
            >
              <van-card
                :price="item.price_after"
                :title="item.goods_name"
                :desc="item.goods_desc"
                :thumb="item.picurl"
              >
                <template #tags>
                  <van-tag v-for="(val,i) in item.pf_cname" :key="i" plain type="danger">{{val}}</van-tag>
                </template>
              </van-card>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");
export default {
  data() {
    return {
      isActive: false,
      record: [
        {
          title: "我的关注",
          num: 0,
        },
        {
          title: "我的店铺",
          num: 0,
        },
        {
          title: "浏览记录",
          num: 0,
        },
      ],
      //   特别推荐数据
      setgoodslist: [],
      // 订单
      take: [
        {
          title: "全部订单",
          url: require("../../assets/images/order0.png"),
        },
        {
          title: "待收货",
          url: require("../../assets/images/order1.png"),
        },
        {
          title: "已收货",
          url: require("../../assets/images/order2.png"),
        },
        {
          title: "评价",
          url: require("../../assets/images/order3.png"),
        },
      ],
      befor:[
        {
          title:"账号管理",
          url: require("../../assets/images/order4.png"),
          path:"/setupthe"
        },
        {
          title:"地址管理",
          url: require("../../assets/images/order5.png"),
          path:"/address"
        },
        {
          title:"我的收藏",
          url: require("../../assets/images/order6.png"),
          path:"/collection"
        },{
          title:"安全中心",
          url: require("../../assets/images/order7.png"),
          path:"/security"
        }
      ],
      // 工具于服务数据
      extension: [
        {
          text: "客服服务",
          url:require('../../assets/img/1.png')
        },
        {
          text: "我的预约",
          url:require('../../assets/img/2.png')
        },
        {
          text: "高价回收",
          url:require('../../assets/img/3.png')
        },
        {
          text: "火车票",
          url:require('../../assets/img/4.png')
        },
        {
          text: "应用推荐",
          url:require('../../assets/img/5.png')
        },
        {
          text: "酒店",
          url:require('../../assets/img/6.png')
        },
        {
          text: "闲置换钱",
          url:require('../../assets/img/7.png')
        },
        {
          text: "更换皮肤",
          url:require('../../assets/img/8.png')
        },
      ],
      userlist: [],
    };
  },
  created() {
    //   调用特别推荐
    this.goodslist();
    // this.brandlist();
    // 判断是否登录
    let tokenString = localStorage.getItem("__Tk");
    
    if (tokenString) {
      this.isActive = true;
      this.getUserInfo();
    } else {
      this.isActive = false;
    }
    
    this.record[2].num = this.BrowsingHistory.length;
  },
  computed: {
    ...mapState(["HomePageCacheData", "ShoppingCacheData","BrowsingHistory"]),
  },
  methods: {
    // brandlist() {
    //   this.axios({
    //     method: "get",
    //     url: "/index.php/v1/api/jd/brandlist",
    //     params: {
    //       apikey: "95c765fcf2939bc8",
    //     },
    //   })
    //     .then((result) => {
    //       // 
    //     })
    //     .catch((err) => {
    //       
    //     });
    // },
    // 登录
    login() {
      this.$router.push("/login");
    },
    // 注册
    registered() {
      this.$router.push("/registered");
    },
    // 设置
    setupthe() {
      this.$router.push("/setupthe");
    },
    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          if (result.data.code == "A001") {
            // this.lists = result.data.result[0];
            this.userlist = result.data.result[0];
            
          }
        })
        .catch((err) => {});
    },
    // 工具于服务
    addextension(index) {
      // this.$router.push("./changetheskin");
      if(index >= 2){
        console.log("99")
        this.$router.push("/browsing")
      }else{
        this.$toast('待开发')
      }
    },
    // 跳转订单
    order(index){
      let tokenString = localStorage.getItem("__Tk");
      if (tokenString) {
        if(index < 3){
          this.$router.push(
            {
              name:"Order",
              params:{
                num:index
              }
            }
          )
        }else{
          this.$toast('待开发')
        }
      } else {
        this.$toast('请先登录')
      }
    },
    // 特别推荐请求
    goodslist() {
      // 判断vuex是否有数据
      if (this.HomePageCacheData.length > 0) {
        this.setgoodslist = this.HomePageCacheData;
        
        return;
      }

      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/goodslist",
        params: {
          apikey: "95c765fcf2939bc8",
        },
      })
        .then((result) => {
          if (result.data.status_code == 200) {
            let list = result.data.data.data;

            let getlist = [];
            list.forEach((v) => {
              getlist.push({
                goods_id: v.goods_id,
                goods_name: v.goods_name,
                goods_short_name: v.goods_short_name,
                goods_desc: v.goods_desc,
                price: v.price,
                price_after: v.price_after,
                picurl: v.picurl,
                picurls: v.picurls,
                brandname: v.brandname,
                shopid: v.shopid,
                shopname: v.shopname,
                pf_cname: {
                  pf_cname1: v.pf_cname1,
                  pf_cname2: v.pf_cname2,
                  pf_cname3: v.pf_cname3,
                },
              });
            });
            this.setgoodslist = getlist;
            
            // 缓存数据
            this.$store.commit("homePage/CacheData", {
              getlist,
            });
          }
        })
        .catch((err) => {
          
        });
    },
    // 跳转详情页
    jumpdetails(goods_id){
      this.$router.push({
        name:'Details',
        query:{
          goods_id
        }
      })
    },
    // 管理
    updata(index){
      let tokenString = localStorage.getItem("__Tk");
      if (tokenString) {
        this.$router.push(this.befor[index].path);
      } else {
        this.$toast('请先登录')
      }

    }
  },
};
</script>

<style lang="less" scoped>
.my {
  width: 100%;
  height: 150px;
  // background-color: #ccc;
  background-size: 100%;
  .Lmy {
    width: 120px;
    height: 100%;
    // background-color: #ccc;
    .Lmy_img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      //   background-color: #fff;
      margin: 34px auto;
      box-shadow: 0px 0px 20px #ddd;
      overflow: hidden;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
  .Rmy {
    width: calc(100% - 120px);
    height: 100%;
    color: white;
    .login {
      height: 150px;
      line-height: 150px;
      margin: 0 10px;
      font-size: 20px;
    }
    .Rmy_icon {
      height: 32px;
      width: 100%;
      .icon {
        float: right;
        .van-icon {
          // line-height: 32px;
          margin-right: 10px;
          margin-top: 10px;
          font-size: 20px;
        }
      }
    }
    .Rmy_title {
      width: 100%;
      height: 26px;
      line-height: 26px;
      text-indent: 10px;
    }
    .Rmy_text {
      height: 28px;
      line-height: 28px;
      margin: 4px 0;
      i {
        line-height: 28px;
        font-size: 18px;
        margin-left: 4px;
      }
      span {
        font-size: 14px;
        margin-left: 4px;
      }
    }
    .Rmy_tab {
      width: 100%;
      height: 50px;
      .tab_box {
        width: 30%;
        height: 50px;
        margin: 0 4px;
        .tab_top {
          width: 100%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
        }
        .tab_btn {
          width: 100%;
          height: 20px;
          font-size: 14px;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
}
.setting {
  // position: fixed;
  // top: 150px;
  // left: 0;
  // bottom: 50px;
  width: 100%;
  background-color: #ddd;
  overflow-y: auto;
  .take {
    width: 100%;
    height: 80px;
    margin: 10px 0;
    background-color: #fff;
    .take_tab {
      width: 25%;
      height: 100%;
      padding-top: 6px;
      // box-sizing: border-box;
      .take_img {
        width: 40px;
        height: 40px;
        margin: 0 auto;
        // background-color: #ccc;
        img {
          width: 36px;
          height: 36px;
          padding: 4px;
        }
      }
      .take_text {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
.extension {
  width: calc(100%-20px);
  // height: 200px;
  margin: 0 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  .title {
    height: 34px;
    line-height: 34px;
    margin: 0 10px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
  }
  .extension_box {
    width: 25%;
    height: 100px;
    .extension_img {
      width: 50px;
      height: 50px;
      background-color: #ccc;
      border-radius: 50%;
      margin: 8px auto;
    }
    .extension_text {
      text-align: center;
      font-size: 14px;
    }
  }
}
// 特别推荐
.recommended {
  width: 100%;
  // margin-top: 0px;
  margin-bottom: 60px;
  h1 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
  }
  .list {
    width: 100%;
    .list_tab {
      margin-bottom: 10px;
      
      .van-card {
        padding-top: 14px;
        background-color: #fff;
        .van-card__title {
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .van-card__desc {
          margin: 4px 0;
        }
        .van-tag {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>