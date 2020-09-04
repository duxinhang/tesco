<template>
  <div>
    <van-nav-bar title="商品搜索" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="inp">
      <input type="text" v-model="value" @input="serch(value)" placeholder="请输入搜索关键词" name="" id="">
    </div>

    <div class="data clearfix">
      <div class="fl data_box" v-for="(item,index) in serchData" :key="index" @click="jumpdetails(item.goods_id)">{{item.goods_name}}</div>
    </div>

    <div class="list">
        <div class="list_tab" v-for="(item,index) in serchlist" :key="index" @click="jumpdetails(item.goods_id)">
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
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("homePage");
export default {
  data() {
    return {
      setgoodslist: [],
      serchData:[],
      value:'',
      serchlist:[]
    };
  },
  created() {
    // console.log(this.HomePageCacheData)
    this.goodslist();
  },
  computed: {
    ...mapState(["HomePageCacheData"]),
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    // 特别推荐请求
    goodslist() {
      // 判断vuex是否有数据
      if (this.HomePageCacheData.length > 0) {
        this.setgoodslist = this.HomePageCacheData;
        
        
        this.scrchdata();
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
            this.scrchdata();
          }
        })
        .catch((err) => {
          
        });

        
    },
    scrchdata(){
        this.setgoodslist.forEach((v,index)=>{
            if(index < 5){
                this.serchData.push(v);
            }
        })
      
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
    serch(value){
        this.serchlist = [];
        if(value.length == 0){
            return;
        }
        this.setgoodslist.forEach((v,index)=>{
            // console.log(v)
            if(v.goods_desc.indexOf(value) > -1){
                
                // console.log('55',value,v)
                this.serchlist.push(v)
            }
        })

    }
  },
};
</script>

<style lang="less" scoped>
.inp {
  width: 100%;
  height: 40px;
  padding-top: 4px;
  box-sizing: border-box;
  background-color: #ddd;
  input{
      width: 80%;
      height: 30px;
      display: block;
      margin: 0px auto;
      border-radius: 20px;
      border: 1px solid #ddd;
      text-indent: 16px;
  }
}
.data {
  width: 100%;
  // height: 100px;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 0 20px;
  .data_box {
    width: 40%;
    height: 24px;
    padding: 0 15px;
    box-sizing: border-box;
    // margin: 5px 5px;
    margin: 5px 12px;
    text-align: center;
    line-height: 24px;
    border-radius: 40px;
    border: 1px solid #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.lists {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  background-color: aquamarine;
}
.list_tab {
    margin-top: 20px;
      margin-bottom: 10px;
      .van-card {
        padding-top: 14px;
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
</style>