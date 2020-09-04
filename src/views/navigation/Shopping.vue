<template>
  <div>
    <van-nav-bar title="购物车" />

    <div class="ppoogs">
      <div v-if="!isLogin">
        <div class="trolley">
          <div class="trolley_text">
            <div>
              登录后可同步账户购物车中的商品
              <button @click="login">登录</button>
            </div>
          </div>
        </div>
        <div class="trolley_box" v-if="!isHas">
          <van-empty
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="登录后同步购物车中商品"
          />
        </div>
      </div>
      <div v-else>
        <div class="gwuclist">
          <div  v-if="isHas">
            <van-swipe-cell  v-for="(item,index) in gwclist" :key="index">
              <van-cell>
                <div class="swipt-cli">
                  <div class="swipt_box">
                    <van-checkbox @click="addact(index)" v-model="item.isActive"></van-checkbox>
                  </div>
                  <div class="swipt_img">
                    <img :src='item.result.picurl' alt />
                  </div>
                  <div class="swipt_text">
                    <div class="Tswipt">
                      <p>{{item.result.goods_name}}</p>
                      <div>
                        <span>{{item.pf_cname}}</span>
                        <span>{{item.pf_cid}}</span>
                      </div>
                    </div>
                    <div class="Bswipt">
                      <div>￥{{item.result.price_after}}</div>
                      <van-stepper v-model="item.count" class="Rice" theme="round" button-size="22" disable-input />
                    </div>
                  </div>
                </div>
              </van-cell>
              <template #right>
                <van-button @click="sanchu(index)" square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
           </div>
          <div class="trolley_box" v-else>
            <van-empty
              class="custom-image"
              image="https://img.yzcdn.cn/vant/custom-empty-image.png"
              description="购物车空空如也"
            />
          </div>
        </div>
      </div>
    <!-- </div> -->
      <van-divider>易购秒杀价</van-divider>

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

      <van-divider>猜你喜欢</van-divider>

      <div class="titen clearfix">
        <div
          @click="jumpdetails(item.goods_id)"
          class="titen_box"
          :class="index%2 == 1 ? 'fl' : 'fr'"
          v-for="(item,index) in setgoodslist"
          :key="index"
        >
          <div class="titen_img">
            <img :src="item.picurl" alt />
          </div>
          <div class="titen_text">
            <h1>{{item.goods_name}}</h1>
            <div class="price_list clearfix">
              <h1>￥{{item.price_after}}</h1>
              <del>￥{{item.price}}</del>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isLogin" class="tijiao"></div>
    </div>

    <van-submit-bar v-show="isLogin" :disabled="isTijiao" class="tijiao" @submit="tijiao" :price="price" button-text="提交订单">
      <van-checkbox :disabled="jinyong" @click="addcheckbox" v-model="isCheckbox">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");
export default {
  data() {
    return {
      // 判断是否登录
      isLogin: false,
      isHas:false,
      time: 24 * 60 * 60 * 1000,
      h: 0,
      m: 0,
      s: 0,
      //   商品详情
      setgoodslist: [],
      //   秒杀商品
      getmiaosha: [],
      // 购物车商品
      gwclist:[],
      // 单选框
      siOlt:false,
      // 全选框
      isCheckbox:false,
      // 金额
      price:0,
      // 提交订单
      tijiaoddan:[],
      // 禁用全选
      jinyong:false,
      // 禁用提交订单
      isTijiao:true
    };
  },
  created() {
    // this.gouwuche()
    this.goodslist();
    this.timeData();
    this.getlist();
    // 

  // localStorage.removeItem('__Gwc')
    if(localStorage.getItem('__Tk')){
      this.isLogin = true;

      // console.log(this.ShoppingCartDataListData.length)
      if(this.ShoppingCartDataListData.length>0){
        this.isHas = true;
        this.gouwuche();
        this.quanxian();
        this.pricelist();
      }
    }
    if(this.gwclist.length == 0){
        this.isCheckbox = false;
        this.jinyong = true;
      }
    this.jinyongddan();

    // console.log(JSON.parse(localStorage.getItem('__Gwc')).length)
  },
  computed: {
    ...mapState(["HomePageCacheData", "ShoppingCacheData","ShoppingCartDataListData","ShoppingDindanListData"])
  },
  methods: {
    // 禁用提交订单
    jinyongddan(){
      for(let i=0;i<this.gwclist.length;i++){
        if(this.gwclist[i].isActive){
          this.isTijiao = false;
          return;
        }else{
          this.isTijiao = true;
        }
      }
    },
    // 删除订单
    sanchu(index){
      
      this.gwclist.splice(index,1)
      this.kong();
      this.jinyongddan();
    },
    // 判断购物车为空
    kong(){
      if(this.gwclist.length == 0){
        this.isCheckbox = false;
        this.jinyong = true;
        this.isHas = false;
      }
    },

    // 提交订单
    tijiao(){
      for(let i=0;i<this.gwclist.length;i++){
        if(this.gwclist[i].isActive){
          this.tijiaoddan.push(this.gwclist[i])
          // this.gwclist.splice(i,1);
          // i--;
        }
      }
      // console.log(this.tijiaoddan,"===")
      this.$store.commit("homePage/ShoppingDindanData",this.tijiaoddan);
      // this.$store.commit("homePage/ShoppingCartData",this.gwclist);
      // this.pricelist();
      // this.kong();

      // this.jinyongddan();


      this.$router.push('/myorder');
    },
    // 金额
    pricelist(){
      this.price = 0;
      this.gwclist.forEach(v=>{
        if(v.isActive){
          this.price += v.result.price_after * v.count * 100
        }
      })
    },
    // 判断是否全选
    quanxian(){
      for(let i=0;i<this.gwclist.length;i++){
        if(this.gwclist[i].isActive == false){
          this.isCheckbox = false;
          return
        }else{
          this.isCheckbox = true;
        }
        // this.gwclist[i].isActive = this.isCheckbox
      }
    },
    // 全选框
    addcheckbox(){
      let hha = !this.isCheckbox;
      this.isCheckbox = !hha
      console.log(this.isCheckbox )

      for(let i=0;i<this.gwclist.length;i++){
        this.gwclist[i].isActive = this.isCheckbox
      }
      this.pricelist();
      this.jinyongddan();
    },
    // 单选框
    addact(index){
      this.jinyongddan();
      // for(var i=0;i<this.ShoppingCartDataListData.length;i++){
        // this.siOlt = !this.gwclist[index].isActive
        let iST = !this.gwclist[index].isActive;
        this.gwclist[index].isActive = !iST
        // console.log(this.gwclist[index].isActive)
        this.$store.commit("homePage/ShoppingCartData",this.gwclist);
        this.quanxian();
        this.pricelist();
      // }
    },
    //   倒计时
    timeData() {
      let _this = this;
      let time = setInterval(function() {
        _this.time -= 1;
        _this.h = parseInt((_this.time / 3600) % 24); //小时数
        _this.m = parseInt((_this.time / 60) % 60); //分钟
        _this.s = parseInt(_this.time % 60); //秒数
        _this.h = _this.h < 10 ? "0" + _this.h : _this.h;
        _this.m = _this.m < 10 ? "0" + _this.m : _this.m;
        _this.s = _this.s < 10 ? "0" + _this.s : _this.s;
      }, 1000);
    },
    // 特别推荐请求
    goodslist() {
      // 判断vuex是否有数据
      if (this.HomePageCacheData.length > 0) {
        this.setgoodslist = this.HomePageCacheData;
        // 
        return;
      }

      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/goodslist",
        params: {
          apikey: "95c765fcf2939bc8"
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            let list = result.data.data.data;

            let getlist = [];
            list.forEach(v => {
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
                  pf_cname3: v.pf_cname3
                }
              });
            });
            this.setgoodslist = getlist;
            // 
            // 缓存数据
            this.$store.commit("homePage/CacheData", {
              getlist
            });
          }
        })
        .catch(err => {
          
        });
    },
    // 跳转详情页
    jumpdetails(goods_id) {
      this.$router.push({
        name: "Details",
        query: {
          goods_id
        }
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
          apikey: "95c765fcf2939bc8"
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            result.data.data.data.forEach(v => {
              this.getmiaosha.push(v.goodslist[0]);
            });

            let getlist = this.getmiaosha;
            // 缓存数据
            this.$store.commit("homePage/ShoppingData", {
              getlist
            });
          }
        })
        .catch(err => {
          
        });
    },
    // 购物车数据
    gouwuche(){
      // this.gwclist.push(JSON.stringify(localStorage.getItem('__Gwc')));
      // console.log(this.gwclist,'==>')
      this.gwclist = this.ShoppingCartDataListData
      
      console.log(this.gwclist,'===')
    },
    // 登录
    login(){
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.ppoogs {
  position: fixed;
  top: 46px;
  left: 0;
  bottom: 50px;
  width: 100%;
  overflow-y: auto;
  background-color: #f2f2f2;
  .gwuclist {
    min-height: 400px;
    background-color: #fff;
    .trolley_box{
      padding-top: 60px;
    }
    .delete-button {
      height: 100%;
    }
    .van-cell {
      padding: 0;
    }
    .swipt-cli {
      height: 100px;
      width: 100%;
      //   border-bottom: 1px solid #ccc;
      .swipt_box {
        float: left;
        margin-top: 40px;
        margin-left: 10px;
      }
      .swipt_img {
        width: 80px;
        height: 80px;
        margin: 10px;
        float: left;
        background-color: cornsilk;
      }
      .swipt_text {
        float: left;
        width: 60%;
        height: 80px;
        margin: 10px 0;
        .Tswipt {
          width: 100%;
          height: 50px;
          div {
            height: 30px;
            line-height: 30px;
            span {
              margin-left: 10px;
              padding: 2px 6px;
              font-size: 12px;
              border-radius: 10px;
              border: 1px solid pink;
            }
          }
          p {
            height: 22px;
            line-height: 22px;
            margin-left: 10px;
            overflow: hidden;
            font-size: 14px;
            text-overflow: ellipsis;
          }
        }
        .Bswipt {
          width: 100%;
          height: 30px;
          div {
            line-height: 30px;
            text-indent: 10px;
            float: left;
            font-size: 16px;
            font-weight: 600;
            color: red;
          }
          .Rice {
            margin-right: 10px;
            float: right;
          }
        }
      }
    }
  }
}
.trolley {
  width: 100%;
  background-color: #fff;
  border-radius: 0 0 16px 16px;
  .trolley_text {
    height: 60px;
    line-height: 60px;
    div {
      width: 70%;
      margin: 0 auto;
      font-size: 12px;
      position: relative;
      button {
        width: 60px;
        height: 30px;
        line-height: 30px;
        margin-top: 15px;
        border-radius: 20px;
        background-color: #f42e12;
        color: #fff;
        font-size: 14px;
        border: none;
        position: absolute;
        top: 0;
        left: 75%;
      }
    }
  }
}
.nagive {
  height: 200px;
  padding-bottom: 10px;
  width: calc(100% - 20px);
  margin: 0 10px;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 20px;
  .nagive_top {
    height: 36px;
    .nagive_left {
      padding-left: 10px;
      line-height: 36px;
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
.titen {
  // padding-bottom: 10px;
  padding: 0 8px;
  box-sizing: border-box;
  .titen_box {
    background-color: #fff;
    width: 49%;
    height: 240px;
    margin-bottom: 10px;
    .titen_img {
      width: 90%;
      margin: 10px auto;
      overflow: hidden;
      height: 160px;
    }
    .titen_text {
      h1 {
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      p {
        padding: 0 20px;
        margin-top: 5px;
        font-size: 14px;
      }
      .price_list {
        width: 100%;
        height: 35px;
        color: red;
        h1 {
          font-weight: 700;
          line-height: 40px;
          font-size: 20px;
          float: left;
        }
        del {
          float: left;
          font-size: 14px;
          margin: 12px 0 0 6px;
          color: #666;
        }
      }
    }
  }
}
.tijiao {
  margin-bottom: 50px;
}
</style>