<template>
  <div>
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="Shuffling">
      <!-- 轮播图 -->
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
      <!-- 价格 -->
      <div class="price clearfix">
        <div class="price_list clearfix">
          <span>￥</span>
          <h1>{{price}}</h1>
          <del>￥{{GoodsDetails.price}}</del>
        </div>

        <div @click="collection" class="fr price_right">
          <div>
            <van-icon :color="isHas ? 'red' : '#ccc'" :name="isHas ? 'like' : 'like-o'" />
          </div>
          <span style="color:red" v-if="isHas">已收藏</span>
          <span v-else>收藏</span>
        </div>
      </div>
      <!-- 标题 -->
      <div class="title">
        <div class="title_text">{{GoodsDetails.goods_name}}</div>
        <div class="title_desc">{{GoodsDetails.goods_desc}}</div>
      </div>
      <!-- 放心购 -->
      <div class="assured">
        <van-notice-bar left-icon="volume-o" text="放心购 ：送运费险  · 闪电退款  · 极速审核" />
      </div>
      <!-- 店铺 -->
      <div class="store">
        <div class="store_left">
          <img class="fl" :src="GoodsDetails.picurl" alt />
          <h1 class="fl">{{GoodsDetails.shopname}}</h1>
        </div>
        <div class="store_baioq">
          <h1 class="fl">店铺标签:</h1>
          <div class="fl">
            <span v-for="(item,index) in Detailsbiao" :key="index">{{item.pf_cname}}</span>
          </div>
        </div>
        <div class="store_btn">
          <span class="fl">评级:</span>
          <p class="fl">
            <van-rate v-model="value" />
          </p>
        </div>
        <div class="store_btn">
          <span class="fl">评论数:</span>
          <span class="fl">{{GoodsDetails.comments}}+</span>
        </div>
        <div class="store_btn">
          <h3 @click="store">进入店铺</h3>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comments">
        <h1>评论:</h1>

        <div v-if="comments.length == 0" class="com_text">暂无评论...</div>

        <div v-else class="comments_box" v-for="(item,index) in comments" :key="index">
          <div class="my clearfix">
            <div class="my_img fl">
              <img src="../assets/logo.png" alt />
            </div>
            <div class="my_text fl">匿名用户...</div>
          </div>
          <div class="com_btn" v-show="item.imageList.length > 0">
            <img :src="item.imageList" alt />
          </div>
          <p>{{item.content}}</p>
        </div>
      </div>
      <!-- 商品图片 -->
      <div class="limgs">
        <div v-for="(item,index) in images" :key="index">
          <img :src="item" alt />
        </div>
      </div>
      <!-- 底部 -->
      <div class="borders">
        <img src="../assets/pinket.gif" alt />
      </div>
    </div>
    <!-- 购物车 -->
    <van-goods-action>
      <van-goods-action-icon @click="store" icon="shop-o" text="店铺" />
      <van-goods-action-icon @click="shoppings" icon="cart-o" text="购物车" :badge="badge>0 ? badge : ''"/>
      <van-goods-action-button @click="layer" type="warning" text="加入购物车" />
      <van-goods-action-button type="danger" @click="Buynow" text="立即购买" />
    </van-goods-action>
    <!-- 弹出层 -->
    <van-popup v-model="isLayer" position="bottom">
      <div class="layer">
        <div class="layer_box clearfix">
          <div class="layer_img fl">
            <img :src="GoodsDetails.picurl" alt />
          </div>
          <div class="layer_text fl">
            <div class="price_list clearfix">
              <span>￥</span>
              <h1>{{price}}</h1>
              <del>￥{{GoodsDetails.price}}</del>
            </div>
            <div class="layer_title">{{GoodsDetails.goods_name}}</div>
          </div>
        </div>
        <div class="layer_list">
          <div class="layer_list_box clearfix">
            <h1>规格一</h1>
            <p
              class="fl"
              @click="listab1(index)"
              :class="(item.isActive==true ? 'active' : '')"
              v-for="(item,index) in Detailsbiao"
              :key="index"
            >{{item.pf_cname}}</p>
          </div>
          <div class="layer_list_box clearfix">
            <h1>规格二</h1>
            <p
              class="fl"
              @click="listab2(index)"
              :class="(item.isActive==true ? 'active' : '')"
              v-for="(item,index) in Detailsbian"
              :key="index"
            >{{item.pf_cid}}</p>
          </div>
          <div class="number clearfix">
            <div class="Lnumber fl">数量</div>
            <div class="Rnumber fr">
              <van-stepper v-model="list" theme="round" button-size="22" disable-input />
            </div>
          </div>
          <div class="layer_btn">
            <van-button type="primary" @click="join" color="#EE0A24" round block>确定</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations,mapActions } = createNamespacedHelpers("homePage");
export default {
  data() {
    return {
      show: false,
      // 数量
      list: 1,
      // 好评
      value: 2.5,
      // 商品id
      goods_id: "",
      //   商品标签
      Detailsbiao: [],
      // 商品编码
      Detailsbian: [],
      // 商品详情
      GoodsDetails: [],
      //   商品详情轮播图
      images: [],
      //   商品评论
      comments: [],
      // 商品价格
      price: "",
      // 收藏
      isHas: false,
      // 弹出层
      isLayer: false,
      // 购物车总数量
      badge:0,

      ShoppingCartDataList: [],

      num:1
    };
  },
  computed: {
    ...mapState(["ShoppingCartDataListData"])
  },
  created() {
    this.goods_id = this.$route.query.goods_id;
    this.addlist();


    if(!localStorage.getItem('__Tk')){
        this.badge = '';
      }
    let goods_id = this.goods_id;
    this.$store.commit("homePage/BrowsingHistoryData", {
      goods_id
    });
    console.log(goods_id,"goods_id")
  },
  methods: {
    //   返回上一级
    onClickLeft() {
      this.$router.go(-1);
    },
    //   获取商品详情信息
    addlist() {
      // 判断vuex是否有数据
      // console.log(this.ShoppingCartDataList,'[[[')
      if (this.ShoppingCartDataListData.length > 0) {
        this.ShoppingCartDataList = this.ShoppingCartDataListData;
        this.badge = this.ShoppingCartDataList.length;
        
      }
      // if(localStorage.getItem('__Gwc')){
      //   // localStorage.removeItem('__Gwc')
      //   // 
      //   // 
      //   this.ShoppingCartDataList = JSON.parse(localStorage.getItem('__Gwc'))
      //   this.badge = this.ShoppingCartDataList.length;
      //   console.log(this.ShoppingCartDataList)
      // }
      
      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/goodsdetail",
        params: {
          apikey: "95c765fcf2939bc8",
          goods_id: this.goods_id
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            // 商品详情
            this.GoodsDetails = result.data.data;
            // 轮播图
            this.images = result.data.data.picurls.split(",");
            //   商品标签
            this.Detailsbiao.push(
              {
                pf_cname: result.data.data.pf_cname1,
                isActive: true
              },
              {
                pf_cname: result.data.data.pf_cname2,
                isActive: false
              },
              {
                pf_cname: result.data.data.pf_cname3,
                isActive: false
              }
            );
            // 商品标签
            this.Detailsbian.push(
              {
                pf_cid: result.data.data.pf_cid1,
                isActive: true
              },
              {
                pf_cid: result.data.data.pf_cid2,
                isActive: false
              },
              {
                pf_cid: result.data.data.pf_cid3,
                isActive: false
              }
            );
            // 星际评分
            let num = result.data.data.goodcommentsshare / 10 / 2;
            this.value = num;
            if (this.value <= 1) {
              this.value = 1;
            }
            // 商品评论
            if (result.data.data.commentInfo.commentList) {
              result.data.data.commentInfo.commentList.forEach(v => {
                this.comments.push({
                  content: v.content,
                  imageList: v.imageList ? v.imageList[0].url : ""
                });
              });
            }

            // let arr = result.data.data.price_after.split(".");
            this.price = result.data.data.price_after;
            // 
            // console.log(result.data.data.price_after)

            // 
          }
        })
        .catch(err => {
          
        });
    },
    // 店铺
    store() {
      this.$toast("店铺维护中...");
    },
    // 收藏
    collection() {
      if(localStorage.getItem('__Tk')){
        this.isHas = !this.isHas;
      }else{
        this.$toast("请先登录")
      }
    },
    // 弹出层
    layer() {
      if(localStorage.getItem('__Tk')){
        this.isLayer = true;
      }else{
        this.$toast("请先登录")
      }
    },
    // 切换标签
    listab1(index) {
      if (this.Detailsbiao[index].isActive) {
        return;
      }
      for (let i = 0; i < this.Detailsbiao.length; i++) {
        if (this.Detailsbiao[i].isActive) {
          this.Detailsbiao[i].isActive = false;
          break;
        }
      }
      this.Detailsbiao[index].isActive = true;
    },
    // 切换标签
    listab2(index) {
      if (this.Detailsbian[index].isActive) {
        return;
      }
      for (let i = 0; i < this.Detailsbian.length; i++) {
        if (this.Detailsbian[i].isActive) {
          this.Detailsbian[i].isActive = false;
          break;
        }
      }
      this.Detailsbian[index].isActive = true;
    },
    // 加入购物车
    join() {

      this.isLayer = false;

      let ShoppingCartData = {
        isActive: false,
        count: 0,
        pf_cname:'',
        pf_cid:''
      };

      for (let i = 0; i < this.Detailsbiao.length; i++) {
        if (this.Detailsbiao[i].isActive) {
          ShoppingCartData.pf_cname = this.Detailsbiao[i].pf_cname;
          // 
          break;
        }
      }
      for (let i = 0; i < this.Detailsbian.length; i++) {
        if (this.Detailsbian[i].isActive) {
          ShoppingCartData.pf_cid = this.Detailsbian[i].pf_cid;
          break;
        }
      }

      ShoppingCartData.isActive = false;
      ShoppingCartData.count = this.list;
      ShoppingCartData.pid = this.goods_id;
      ShoppingCartData.result = this.GoodsDetails;

      // 用来判断是否已经存在物品
      let lis = ShoppingCartData.pf_cname+ShoppingCartData.pf_cid

        let arr = [];
      if(this.ShoppingCartDataList.length == 0){
        this.ShoppingCartDataList.push(ShoppingCartData);
      }else{  
        let arr = ''
        this.ShoppingCartDataList.forEach(v=>{
          arr += v.pf_cname+v.pf_cid
        })
        if(arr.indexOf(lis) > -1){
          // 
          let res = [];
            this.ShoppingCartDataList.forEach((v,index)=>{
              res.push(v.pf_cname+v.pf_cid)
            })
          //   // console.log(res)
            for(let i=0;i<res.length;i++){
              if(res[i].indexOf(lis) > -1){
                this.ShoppingCartDataList[i].count = this.ShoppingCartDataList[i].count + ShoppingCartData.count
                break;
                // console.log(this.ShoppingCartDataList,"55")
              }
            }
        }else{
          this.ShoppingCartDataList.unshift(ShoppingCartData);
        }
      }
        this.badge = this.ShoppingCartDataList.length;
          // console.log(arr)  
          


      // console.log(this.ShoppingCartDataList)
      // this.changse(this.ShoppingCartDataList)

      this.$store.commit("homePage/ShoppingCartData",this.ShoppingCartDataList);

      // localStorage.setItem('__Gwc',JSON.stringify(this.ShoppingCartDataList))
      if(this.num == 1){
        this.$toast("添加购物车成功");
      }else{
        this.$router.push('/shopping')
        this.num = 1;
      }
      
    // console.log(this.ShoppingCartDataListData,'...')
    // 
      
      // this.$commit()
    },
    // 跳转到购物车
    shoppings(){
      this.$router.push('/shopping')
    },
    // 立即购买
    Buynow(){
      console.log("55")

      if(localStorage.getItem('__Tk')){
        this.isLayer = true;
        this.num = 2;
      }else{
        this.$toast("请先登录")
      }

      // let ShoppingCartData = {
      //   isActive: false,
      //   count: 0,
      //   pf_cname:'',
      //   pf_cid:''
      // };
    }



    // changse(data){
    //   return this.$store.dispatch('homePage/changse',data)
    // }
  }
};
</script>

<style lang="less" scoped>
.Shuffling {
  position: fixed;
  top: 46px;
  left: 0;
  bottom: 50px;
  width: 100%;
  overflow-y: auto;
  background-color: #f2f2f2;
  .price {
    padding: 12px 18px;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    .price_list {
      float: left;
      height: 35px;
      color: red;
      span {
        font-weight: 700;
        font-size: 18px;
        margin-top: 12px;
        float: left;
      }
      h1 {
        font-weight: 700;
        line-height: 40px;
        font-size: 30px;
        float: left;
      }
      i {
        float: left;
        font-size: 30px;
        margin-top: 4px;
      }
      h2 {
        float: left;
        font-weight: 600;
        margin-top: 16px;
      }
      del {
        float: left;
        font-size: 14px;
        margin: 16px 0 0 6px;
        color: #ccc;
      }
    }
    .price_right {
      height: 35px;
      div {
        width: 20px;
        font-size: 20px;
        margin: 0 auto;
        .van-icon {
          margin-left: 2px;
        }
      }
      span {
        margin-top: -6px;
        float: left;
      }
    }
  }
  .title {
    padding: 0 18px 12px 18px;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    .title_text {
      font-weight: 700;
      line-height: 22px;
      font-size: 16px;
      color: #262626;
    }
    .title_desc {
      font-size: 12px;
      line-height: 16px;
      padding-top: 18px;
    }
  }
  .assured {
    height: 36px;
    background-color: #fbf0fd;
  }
  .store {
    width: 100%;
    min-height: 100px;
    margin-top: 26px;
    border-radius: 20px;
    background-color: #fff;
    padding: 10px 0;
    .store_left {
      width: 100%;
      height: 50px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 10px;
        background-color: #fff;
      }
      h1 {
        width: calc(100% - 70px);
        height: 50px;
        line-height: 50px;
        font-size: 20px;
      }
    }
    .store_btn {
      width: 100%;
      height: 40px;
      span {
        height: 40px;
        line-height: 40px;
        margin-left: 15px;
        font-size: 16px;
      }
      p {
        height: 4px;
        margin-left: 10px;
        .van-rate {
          margin-top: 9px;
        }
      }
      h3 {
        width: 120px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        margin: 5px auto;
        border: 1px solid #ccc;
        border-radius: 20px;
      }
    }
    .store_baioq {
      width: 100%;
      height: 40px;
      margin-top: 10px;
      h1 {
        line-height: 40px;
        font-size: 16px;
        margin-left: 10px;
      }
      div {
        height: 40px;
        line-height: 40px;
        span {
          padding: 4px 6px;
          margin: 0 6px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .comments {
    width: 100%;
    min-height: 60px;
    border-radius: 16px;
    background-color: #fff;
    padding: 6px 0;
    margin: 20px 0;
    .com_text {
      margin: 4px 0 0 10px;
    }
    h1 {
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
    }
    .comments_box {
      margin: 10px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #ccc;
      .my {
        height: 40px;
        width: 100%;
        margin-bottom: 10px;
        .my_img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        .my_text {
          height: 40px;
          line-height: 40px;
          margin-left: 10px;
          font-size: 16px;
        }
      }
      .com_btn {
        margin: 10px 0;
        width: 80px;
      }
    }
  }
  .limgs {
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
    div {
      margin: 10px 0;
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .borders {
    margin: 20px 0;
  }
}
.layer {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 10px;
  height: 424px;
  position: relative;
  .layer_box {
    box-sizing: border-box;
    padding: 10px 10px 10px 10px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .layer_img {
      width: 100px;
      height: 100px;
      border-radius: 10px;
      overflow: hidden;
      background-color: #ccc;
    }
    .layer_text {
      width: 230px;
      padding-top: 16px;
      padding-right: 10px;
      margin-left: 10px;
      .price_list {
        width: 100%;
        height: 35px;
        color: red;
        span {
          font-weight: 700;
          font-size: 18px;
          margin-top: 12px;
          float: left;
        }
        h1 {
          font-weight: 700;
          line-height: 40px;
          font-size: 30px;
          float: left;
        }
        del {
          float: left;
          font-size: 14px;
          margin: 16px 0 0 6px;
          color: #ccc;
        }
      }
      .layer_title {
        margin-top: 10px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .layer_list {
    position: absolute;
    top: 120px;
    left: 0px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    .layer_list_box {
      margin-top: 10px;
      h1 {
        font-size: 16px;
      }
      p {
        width: 30%;
        margin: 10px;
        padding: 4px 10px;
        border-radius: 10px;
        text-align: center;
        border: 1px solid #ccc;
        margin-bottom: 0px;
        &.active {
          background-color: #ee0a24;
          color: #fff;
        }
      }
    }
    .number {
      // background-color: aqua;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      .Lnumber {
        font-size: 16px;
      }
    }
    .layer_btn {
      width: 80%;
      margin: 0 auto;
      margin-top: 10px;
    }
  }
}
</style>