<template>
  <div class="homepage">
    <div class="bg">
      <!-- 搜索 -->
      <div class="search clearfix">
        <div class="Lsearch fl" @click="searchs">
          <van-search v-model="value" placeholder="请输入搜索关键词" />
        </div>
        <div class="Rsearch fl">
          <!-- <van-icon name="user-circle-o" /> -->
          <div @click="addmy">
            <img :src="userimage ? userimage : require('../../assets/dlu.png') " alt />
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div class="figure">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item,index) in imageslist" :key="index">
            <img :src="item.src" alt />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <!-- 功能应用 -->
    <div class="mall_nav">
      <van-swipe class="my-swipe">
        <van-swipe-item>
          <div class="fl mall_nav_swipe" v-for="(item,index) in iconlist" :key="index">
            <div class="mall_nav_box">
              <img :src="item.src" alt />
            </div>
            <p>{{item.title}}</p>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="nagive">
      <div class="nagive_top clearfix">
        <div class="nagive_left fl clearfix">
          <h1 class="fl">易购秒杀</h1>
          <div class="fl">
            <van-count-down :time="time">
              <template>
                <span class="block">{{h}}</span>
                <span class="colon">:</span>
                <span class="block">{{m}}</span>
                <span class="colon">:</span>
                <span class="block">{{s}}</span>
              </template>
            </van-count-down>
          </div>
        </div>
        <div class="nagive_right fr">
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="nagive_btn">
        <div class="nagic">
          <div
            class="nagive_box fl"
            @click="jumpdetails(item.goods_id)"
            v-for="(item,index) in getmiaosha"
            :key="index"
          >
            <div class="nagive_img">
              <img :src="item.picurl" alt />
            </div>
            <div class="nagive_text clearfix">
              <h1>{{item.goods_name}}</h1>
              <span class>{{item.price_after}}</span>
              <del class>￥{{item.price}}</del>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特别推荐 -->
    <div class="recommended">
      <h1>-- 特别推荐 --</h1>
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
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");

export default {
  data() {
    return {
      time: new Date().getMilliseconds() * 60,
      h: 0,
      m: 0,
      s: 0,
      value: "",
      //   特别推荐数据
      setgoodslist: [],
      imageslist: [
        { src: require("../../assets/figure/1.jpg") },
        { src: require("../../assets/figure/2.jpg") },
        { src: require("../../assets/figure/3.jpg") },
        { src: require("../../assets/figure/4.jpg") },
        { src: require("../../assets/figure/5.jpg") },
        { src: require("../../assets/figure/6.jpg") },
      ],
      iconlist: [
        {
          src: require("../../assets/icons/01.png"),
          title: "易购超市",
        },
        {
          src: require("../../assets/icons/02.png"),
          title: "数码电器",
        },
        {
          src: require("../../assets/icons/03.png"),
          title: "易购服饰",
        },
        {
          src: require("../../assets/icons/04.png"),
          title: "易购生鲜",
        },
        {
          src: require("../../assets/icons/05.png"),
          title: "易购到家",
        },
        {
          src: require("../../assets/icons/06.png"),
          title: "充值缴费",
        },
        {
          src: require("../../assets/icons/07.png"),
          title: "9.9元拼",
        },
        {
          src: require("../../assets/icons/08.png"),
          title: "领券",
        },
        {
          src: require("../../assets/icons/09.png"),
          title: "领金贴",
        },
        {
          src: require("../../assets/icons/10.png"),
          title: "PLUS会员",
        },
      ],
      //   秒杀商品
      getmiaosha: [],
      userimage: "",
    };
  },
  computed: {
    ...mapState(["HomePageCacheData", "ShoppingCacheData"]),
  },
  created() {
    //   调用特别推荐
    this.goodslist();
    this.getlist();
    this.timeData();
    this.getUserInfo();
  },
  methods: {
    // 搜索
    searchs() {
      this.$router.push("/search");
    },
    // ...mapMutations(['CacheData']),
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
        .catch((err) => {});
    },
    // 跳转详情页
    jumpdetails(goods_id) {
      this.$router.push({
        name: "Details",
        query: {
          goods_id,
        },
      });
    },
    // 秒杀商品
    getlist() {
      // 判断vuex是否有数据
      if (this.ShoppingCacheData.length > 0) {
        this.getmiaosha = this.ShoppingCacheData;
        //
        return;
      }

      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/themelist",
        params: {
          apikey: "95c765fcf2939bc8",
        },
      })
        .then((result) => {
          if (result.data.status_code == 200) {
            result.data.data.data.forEach((v) => {
              this.getmiaosha.push(v.goodslist[0]);
            });

            let getlist = this.getmiaosha;
            // 缓存数据
            this.$store.commit("homePage/ShoppingData", {
              getlist,
            });
          }
        })
        .catch((err) => {});
    },
    //   倒计时
    timeData() {
      let _this = this;
      let time = setInterval(function () {
        _this.time -= 1;
        _this.h = parseInt((_this.time / 3600) % 24); //小时数
        _this.m = parseInt((_this.time / 60) % 60); //分钟
        _this.s = parseInt(_this.time % 60); //秒数
        _this.h = _this.h < 10 ? "0" + _this.h : _this.h;
        _this.m = _this.m < 10 ? "0" + _this.m : _this.m;
        _this.s = _this.s < 10 ? "0" + _this.s : _this.s;
      }, 1000);
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
            this.userimage = result.data.result[0].userImg;
            // console.log(result)
          }
        })
        .catch((err) => {});
    },
    addmy() {
      if (localStorage.getItem("__Tk")) {
        this.$router.push("/setupthe");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.homepage {
  padding: 50px 0;
  background-color: #f6f6f6;
}
.bg {
  height: 100px;
  border-radius: 0 0 10px 10px;
  margin-bottom: 70px;
  background-color: #c9261a;
  position: relative;
}
// 搜索
.search {
  width: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 666;
  .Lsearch {
    width: 85%;
    height: 50px;
    .van-search {
      height: 50px;
      padding-right: 0;
    }
  }
  .Rsearch {
    width: 15%;
    height: 50px;
    text-align: center;
    .van-icon {
      font-size: 40px;
      color: #ccc;
      margin: 5px auto;
    }
    div {
      width: 40px;
      height: 40px;
      float: right;
      margin: 5px 5px;
      border-radius: 50%;
      // background-color: aqua;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
// 轮播图
.figure {
  position: absolute;
  top: 18px;
  width: 96%;
  height: 140px;
  margin: 0 2%;
  border-radius: 20px;
  overflow: hidden;
  .van-swipe {
    width: 100%;
    height: 140px;
  }
}
// 功能应用
.mall_nav {
  width: 100%;
  height: 160px;
  .my-swipe {
    height: 160px;
  }
  .mall_nav_swipe {
    width: 20%;
    height: 80px;
    .mall_nav_box {
      width: 44px;
      height: 44px;
      margin: 3px auto;
    }
    p {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
    }
  }
}
.nagive {
  height: 200px;
  padding-bottom: 10px;
  width: calc(100% - 20px);
  margin: 10px 10px;
  border-radius: 10px;
  background-color: #fff;
  .nagive_top {
    height: 36px;
    .nagive_left {
      padding-left: 10px;
      line-height: 36px;
      h1 {
        font-size: 16px;
      }
      div {
        padding-top: 4px;
        margin-left: 4px;
      }
    }
    .nagive_right {
      padding-right: 12px;
      padding-top: 12px;
    }
  }
  .nagive_btn {
    width: 100%;
    height: calc(100% - 36px);
    overflow-x: auto;
    .nagic {
      width: 1401px;
      height: 144px;
    }
    .nagive_box {
      width: 120px;
      height: 100%;
      margin: 0 10px;
      .nagive_img {
        width: 100px;
        height: 100px;
        margin: 0px auto;
        background-color: #ccc;
      }
      .nagive_text {
        width: 100%;
        height: 44px;
        h1 {
          line-height: 24px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 10px;
          margin-top: 4px;
        }
        span {
          font-weight: 700;
          color: red;
          font-size: 16px;
          padding-left: 10px;
        }
        del {
          margin-left: 10px;
          display: block;
          font-size: 12px;
        }
      }
    }
  }
}
// 特别推荐
.recommended {
  width: 100%;
  margin-top: 10px;
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