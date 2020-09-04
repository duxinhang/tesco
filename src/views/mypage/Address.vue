<template>
  <div>
    <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="addres_bg">

    <van-address-list
      v-model="aid"
      :list="addressList"
      default-tag-text="默认"
      @add="goAddress"
      @edit="goAddress"
    />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aid: "1",
    //   地址列表
      addressList: []
    };
  },
  created() {
    this.getAddressData();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    // // 获取地址数据
    getAddressData() {
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "get",
        url: "http://www.kangliuyong.com:10002/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
            // console.log(result)
          if (result.data.code == 20000) {
            
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                addressDetail:v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };
              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;
              }
              this.addressList.push(currentAddress);
            });
          }
        })
        .catch(err => {
          
        });
    },

    goAddress(newAddress){
        // console.log(newAddress)
        let list = {
            name:'NewAddress'
        };

        if(newAddress){
            list.params = {
                aid:newAddress.id
            }
        }

        // 跳转编辑新增
      this.$router.push(list);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-radio__icon {
  display: none;
}
.van-address-list__bottom {
    bottom: 20px;
}
.addres_bg{
    position: fixed;
    top: 46px;
    bottom: 90px;
    left:0px;
    width: 100%;
    overflow-y: auto;
    padding-bottom: 20px;
}
</style>