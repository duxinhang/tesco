<template>
<div>

     <van-nav-bar title="我的订单" left-text="关闭" left-arrow @click-left="onClickLeft" />
     <div v-if="isActive">
        <van-tabs v-model="active">
          <van-tab :title="l.title" v-for="(l,o) in tablist" :key="o">
            <div class="active_tab"  v-show="isPas">
              <div class="order_list" v-for="(item,index) in l.name < 1 ? orderDataList : l.name > 1 ? receiving : received" :key="index">
                <div class="top_order clearfix">
                  <p class="fl">{{item.oid}}</p>
                  <span class="fr" v-show="item.isHas">
                    <span>已收货</span>
                    <div class="fr">
                      <van-icon @click="removeOrder(index)" name="close" />
                    </div>
                  </span>
                  <span class="fr" v-show="!item.isHas" @click="confirm(index)">确认收货</span>
                </div>
                <div class="cer_order clearfix" v-for="(val,i) in item.data" :key="i">
                  <div class="cer_order_img fl">
                    <img :src="val.result.picurl" alt="">
                  </div>
                  <div class="fl order_box">
                    <h1>{{val.result.goods_name}}</h1>
                    <h2>{{val.pf_cname}}/{{val.pf_cid}}</h2>
                    <div class="clearfix">
                      <p class="fl">￥{{val.result.price_after}}</p>
                      <span class="fr">X{{val.count}}</span>
                    </div>
                  </div>
                </div>
                <div class="btn_order">
                  <p class="fl">{{item.time}}</p>
                  <span class="fr">￥{{item.total}}</span>
                </div>
              </div>
            </div>
            <div v-show="!isPas">
              <div class="trolley_text">
                  <van-empty
                      class="custom-image"
                      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                      description="暂无数据"
                  />
              </div>
            </div>
          </van-tab>
          <!-- <van-tab title="待收货">待收货</van-tab>
          <van-tab title="已收货">已收货</van-tab> -->
        </van-tabs>
        
     </div>
     <div v-else>
        <div class="ppoogs">
            <div class="trolley">
                <div class="trolley_text">
                    <div>
                    登录后可同步账户订单中的商品
                    <button @click="login">登录</button>
                    </div>
                    <van-empty
                        class="custom-image"
                        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                        description="登录后同步订单中商品"
                    />
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
        // 验证是否登录
      isActive:false,
      isPas:true,
      tablist: [
        {
          title: "全部订单",
          name: "0"
        },
        {
          title: "待收货",
          name: "1"
        },
        {
          title: "已收货",
          name: "2"
        }
      ],
      // 订单数据
      orderDataList:[],
      active: 0,
      tablist: [
        {
          title: "全部订单",
          name: "0",
        },
        {
          title: "待收货",
          name: "1",
        },
        {
          title: "已收货",
          name: "2",
        },
      ],
    };
  },
  created() {
    if(localStorage.getItem('__Tk')){
        this.isActive = true;
    }else{
        this.isActive = false;
    }

    this.orderDataList = this.OrderData;
    

    if(this.orderDataList.length == 0){
      // console.log('5')
      this.isPas = false;
    }

    this.active = parseInt(this.$route.params.num);

  },
  computed: {
    ...mapState(["OrderData"]),
    // 待收货
    receiving(){
      let arr = [];
      this.orderDataList.forEach(v=>{
        if(v.isHas){
          arr.push(v);
        }
      })
      return arr
    },
    // 已收货
    received(){
      let arr = [];
      this.orderDataList.forEach(v=>{
        if(!v.isHas){
          arr.push(v);
        }
      })
      return arr
    }
  },
  methods: {
      onClickLeft(){
        this.$router.push("/my")
      },
      login(){
          this.$router.push("/login")
      },
      // 确认收货
      confirm(index){
        this.orderDataList[index].isHas = true;
      },
      // 删除订单
      removeOrder(index){
        this.orderDataList.splice(index,1);
        if(this.orderDataList.length == 0){
          // console.log('5')
          this.isPas = false;
        }
      }
  }
};
</script>

<style lang="less" scoped>
.indent {
  width: 100%;
  height: auto;
  .active_tab {
    position: fixed;
    top: 90px;
    left: 0;
    bottom: 50px;
    background-color: #ddd;
    overflow-y: auto;
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    padding-bottom: 0;
    height: auto;
    .order_list {
      min-height: 100px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: 10px;
      .top_order {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border-bottom: 1px solid #ccc;
        p {
          margin-left: 10px;
        }
        span {
          margin-right: 10px;
          div {
            font-size: 16px;
            margin: 3px 0 0 0px;
          }
        }
      }
      .cer_order {
        width: 100%;
        // height: 80px;
        padding: 10px 10px;
        box-sizing: border-box;
        .cer_order_img {
          width: 80px;
          height: 80px;
        }
        .order_box {
          width: calc(~"100% - 90px");
          height: 80px;
          margin-left: 10px;
          h2 {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            // margin: 6px 0;
          }
          div {
            width: 100%;
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .btn_order {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border-top: 1px solid #ccc;
        p {
          margin-left: 10px;
        }
        span {
          margin-right: 10px;
        }
      }
    }
  }
}
.trolley {
  width: 100%;
  background-color: #fff;
  border-radius: 0 0 16px 16px;
  border-bottom: 1px solid #ddd;
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
.active_tab {
    position: fixed;
    top: 90px;
    left: 0;
    bottom: 0px;
    background-color: #ddd;
    overflow-y: auto;
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    padding-bottom: 0;
    height: auto;
    .order_list {
      min-height: 100px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: 10px;
      .top_order {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border-bottom: 1px solid #ccc;
        p {
          margin-left: 10px;
        }
        span {
          margin-right: 10px;
          div {
            font-size: 16px;
            margin: 3px 0 0 0px;
          }
        }
      }
      .cer_order {
        width: 100%;
        // height: 80px;
        padding: 10px 10px;
        box-sizing: border-box;
        .cer_order_img {
          width: 80px;
          height: 80px;
        }
        .order_box {
          width: calc(~"100% - 90px");
          height: 80px;
          margin-left: 10px;
          h1{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h2 {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            // margin: 6px 0;
          }
          div {
            width: 100%;
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .btn_order {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border-top: 1px solid #ccc;
        p {
          margin-left: 10px;
        }
        span {
          margin-right: 10px;
        }
      }
    }
  }
</style>