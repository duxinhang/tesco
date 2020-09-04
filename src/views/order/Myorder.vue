<template>
  <div>
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="onClickLeft" />

    <!-- <van-contact-card add-text="选择地址" @click="openPopup"/> -->
    <!-- <van-contact-card
        :type="cardType"
        :name="userAddress.address"
        :tel="userAddress.phone"
        @click="openPopup"
    />-->
    <!-- @click="showList = true" -->

    <div class="order_list">
      <div class="address" @click="openPopup">地址：{{userAddress.address}}</div>
      <!-- 选择地址 -->
      <!-- <div class="address" @click="openPopup">{{userAddress.address}}</div> -->
      <div class="order">
        <div class="order_box clearfix" v-for="(item,index) in orderlist" :key="index">
          <div class="Lorder fl">
            <img :src="item.result.picurl" alt />
          </div>
          <div class="Rorder fl">
            <div class="rod1">
              <h1 class="fl">{{item.result.goods_desc}}</h1>
              <span class="fr">￥{{item.result.price_after}}</span>
            </div>
            <div class="rod2"></div>
            <div class="rod3">
              <p class="fl">{{item.pf_cid}}/{{item.pf_cname}}</p>
              <span class="fr">x{{item.count}}</span>
            </div>
          </div>
        </div>

        <div class="total">共计{{counts}}件商品 合计:￥{{total}}</div>
      </div>
    </div>

    <!-- <div class="orders" v-for="(item,index) in orderlist" :key="index">
            <div class="order_title">
                <div class="order_licon fl">
                    <van-icon name="shop-o" />
                </div>
                <div class="order_con fl">{{item.result.shopname}}</div>
                <div class="order_licon fr">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="order_content">
                <div class="order_images fl">
                    <img :src="item.result.picurl" alt="">
                </div>
                <div class="f1">{{item.result.goods_desc}}</div>
            </div>
            <div class="tail"></div>
    </div>-->
    <van-submit-bar :price="total * 100" button-text="立即结算" button-type="info" @submit="commit" />
    <van-popup class="popup-box" v-model="isOpen" position="bottom">
      <van-address-list
        v-model="aid"
        :list="addressList"
        default-tag-text="默认"
        @add="addAddress"
        @edit="editaddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");
export default {
  data() {
    return {
      // 弹出地址
      isOpen: false,
      aid: "",
      // 地址信息
      userAddress: {
        address: "请选择收货地址...",
        phone: "",
        receiver: "",
      },
      //地址数据
      addressList: [],
      // 订单数据
      orderlist: [],
      // 商品总数量
      counts: 0,
      // 总金额
      total: 0,
    };
  },
  created() {
    // 获取订单数据
    this.orderlist = this.ShoppingDindanListData;
    
    // 获取订单数量价格
    this.orderlist.forEach((v) => {
      this.counts += v.count;
      this.total += v.count * v.result.price_after;
    });
    this.total = this.total.toFixed(2);

    this.getAddressData();
  },
  computed: {
    ...mapState(["ShoppingDindanListData","OrderData"]),
    cardType() {
      return this.chosenContactId !== null ? "edit" : "add";
    },
  },
  methods: {
    //   显示选择地址
    openPopup() {
      this.isOpen = true;
    },
    // 返回上一级
    onClickLeft() {
      this.$router.go(-1);
    },
    commit() {
      // console.log(this.orderlist)
      if (this.userAddress.address == "请选择收货地址...") {
        this.$toast("请选择收货地址...");
        return;
      }

      // 缓存数据
      // 订单时间
      let time = new Date();
      let n = time.getFullYear();
      let y = (time.getMonth()+1) > 9 ? (time.getMonth()+1) : "0" + (time.getMonth()+1);
      let r = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();

      let s = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
      let f = (time.getMinutes() > 9 ? time.getMinutes(): "0" + time.getMinutes());
      let m = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
      let date =  n + "-" + y + "-" + r + " " + s + ":" + f + ":" + m;

      // 订单编号
      let nums = parseInt(Math.random()*(1900000-1000000)+1000000);

      // 总价格
      let total = 0;
      this.orderlist.forEach((v,index)=>{
        total += v.count * v.result.price_after
      })
      let aaa = {};
      aaa = {
        data:this.orderlist,
        oid: "NO.198" + nums,
        time: date,
        total:total,
        isHas:false
      }
      
        this.$store.commit("homePage/OrderData", {
            aaa
        });
        // console.log(this.OrderData)
    
    this.$router.push(
      {
        name:"Order",
        params:{
          num:'0'
        }
      })
    // this.orderlist = [];
    },
    // 获取地址数据
    getAddressData() {
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "get",
        url: "http://www.kangliuyong.com:10002/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          if (result.data.code == 20000) {
            result.data.result.forEach((v) => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault),
              };

              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;

                //如果存在默认地址，则默认选择默认地址
                this.userAddress.address = currentAddress.address;
              }

              this.addressList.push(currentAddress);
            });
          }
        })
        .catch((err) => {});
    },
    // 选择地址
    selectAddress(item) {
      this.isOpen = false;

      this.userAddress = {
        address: item.address,
        phone: item.tel,
        receiver: item.name,
      };
      
    },
    addAddress() {
      this.$router.push({ name: "NewAddress" });
    },
    editaddress(newAddress) {
      // this.$router.push('/newAddress')
      let list = {
        name: "NewAddress",
      };

      if (newAddress) {
        list.params = {
          aid: this.aid,
        };
      }

      // 跳转编辑新增
      this.$router.push(list);
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  width: 100%;
  height: 32px;
  line-height: 32px;
  background-color: #fff;
  margin-bottom: 10px;
  text-indent: 10px;
}
// .orders{
//     width: calc(100% - 20px);
//     border-radius: 10px;
//     // height: 200px;
//     margin: 0 10px;
//     // margin-top: 80px;
//     padding: 5px 0;
//     border: 1px solid #ccc;
//     background-color: #ddd;
//     .order_title{
//         height: 30px;
//         line-height: 30px;
//         padding: 0 10px;
//         .order_licon{
//             .van-icon{
//                 font-size: 19px;
//                 padding: 5px 0;
//             }
//         }
//         .order_con{
//             margin-left: 10px;
//             font-size: 16px;
//         }
//     }
//     .order_content{
//         width: 100%;
//         height: 140px;
//         padding: 11px 10px;
//         box-sizing: border-box;
//         background-color: blanchedalmond;
//         .order_images{
//             width: 120px;
//             height: 120px;
//             background-color: blueviolet;
//         }
//     }
//     .tail{
//         height: 20px;
//     }
// }

.order_list {
  position: fixed;
  top: 46px;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ddd;
  box-sizing: border-box;
  padding: 10px;
  .address {
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: #fff;
    margin-bottom: 10px;
    text-indent: 10px;
  }
  .order {
    box-sizing: border-box;
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .order_box {
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
      .Lorder {
        width: 80px;
        height: 80px;
        // background-color: blueviolet;
      }
      .Rorder {
        margin-bottom: 10px;
        box-sizing: border-box;
        padding: 2px 4px;
        width: calc(~"100% - 80px");
        height: 80px;
        // background-color: burlywood;
        .rod1 {
          width: 100%;
          height: 24px;
          line-height: 24px;
          h1 {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .rod2 {
          width: 100%;
          height: 20px;
          line-height: 20px;
          margin: 2px 0;
        }
        .rod3 {
          width: 100%;
          height: 24px;
          line-height: 24px;
        }
      }
    }
    .total {
      width: 100%;
      font-size: 14px;
      margin-top: 8px;
      height: 20px;
      line-height: 20px;
      text-align: right;
    }
  }
}
</style>