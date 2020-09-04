<template>
  <div>
    <div class="title_box">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in imageslist" :key="index">
          <img :src="item.src" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="serchlist">
      <div class="Llist fl">
        <div
          @click="tablist(index)"
          :class="item.isActive ? 'active' : ''"
          class="list_name"
          v-for="(item,index) in searchlist"
          :key="index"
        >{{item.title}}</div>
      </div>
      <div class="list_box">
        <div
          class="fl"
          :class="item.isActive ? 'active' : ''"
          v-for="(item,index) in listbox"
          :key="index"
        >
          <span @click="listboxs(index)" class="fl">{{item.title}}</span>
          <p @click="listicon(index)" v-if="index == 0 ? false : true" class="fl">
            <!-- <van-icon name="arrow-up" /> -->
            <van-icon :name="item.isHas ? 'arrow-down' : 'arrow-up'" />
          </p>
        </div>
      </div>
      <div class="Rlist clearfix fr">
        <div
          @click="jumpdetails(item.goods_id)"
          class="Rlist_list"
          :class="index%2==1 ? 'fr' : 'fl'"
          v-for="(item,index) in chaielist"
          :key="index"
        >
          <div class="list_img">
            <img :src="item.picurl" alt />
          </div>
          <div class="list_title">{{item.goods_name}}</div>
          <div class="list_text">{{item.goods_desc}}</div>
          <div class="list_price">
            <p class="fl">
              ￥
              <span>{{item.price_after}}</span>
            </p>
            <del class="fr">￥{{item.price}}</del>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("Cation");
export default {
  data() {
    return {
      searchlist: [
        {
          title: "热推榜",
          isActive: true,
          name: "PushList"
        },
        {
          title: "热销榜",
          isActive: false,
          name: "SearchList"
        },
        {
          title: "热搜榜",
          isActive: false,
          name: "HotCakes"
        },
        {
          title: "月销榜",
          isActive: false,
          name: "SalesList"
        }
      ],
      chaielist: [],
      listbox: [
        {
          title: "综合排序",
          isActive: true,
          isHas: true
        },
        {
          title: "销量",
          isActive: false,
          isHas: true
        },
        {
          title: "价格",
          isActive: false,
          isHas: true
        },
        {
          title: "信誉",
          isActive: false,
          isHas: true
        }
      ],
      imageslist:[
        {src:require('../../assets/figure/1.jpg')},
        {src:require('../../assets/figure/2.jpg')},
        {src:require('../../assets/figure/3.jpg')},
        {src:require('../../assets/figure/4.jpg')},
        {src:require('../../assets/figure/5.jpg')},
        {src:require('../../assets/figure/6.jpg')}
      ],
    };
  },

  created() {
    this.PushList();
    // this.SearchList();
  },
  computed: {
    ...mapState(["PushListData","SearchListData","HotCakesData","SalesListData"])
  },

  methods: {
    // ...mapMutations(['PushListDataCation']),
    // 热推榜
    PushList() {
      // console.log('this.PushListData.length',this.PushListData.length)
      // // 判断vuex是否有数据
      if(this.PushListData){
        if (this.PushListData.length > 0) {
          this.chaielist = this.PushListData;
          
          return;
        }
      }
      // console.log('PushListData',this.PushListData)

      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/getgoodshot",
        params: {
          apikey: "95c765fcf2939bc8"
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            this.chaielist = result.data.data.data;
            let data = this.chaielist;
            // console.log('axios',this.chaielist)
            this.$store.commit('Cation/PushListDataCation',data)
          }
        })
        .catch(err => {
          
        });
    },
    // 热销榜
    SearchList() {
      // 判断vuex是否有数据
      // console.log('this.SearchListData.length',this.SearchListData.length)
      if(this.SearchListData){
        
        if (this.SearchListData.length > 0) {
          this.chaielist = this.SearchListData;
          
          return;
        }
      }
      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/getgoodsbd",
        params: {
          apikey: "95c765fcf2939bc8",
          activityid: 10000
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            this.chaielist = result.data.data.data;
            let data = result.data.data.data;
            console.log(data,"data")
            this.$store.commit('Cation/SearchListDataCation',data)
          }
        })
        .catch(err => {
          
        });
    },
    // 热搜榜
    HotCakes() {
      // console.log(this.HotCakesData)
      if(this.HotCakesData){

        if (this.HotCakesData.length > 0) {
          this.chaielist = this.HotCakesData;
          
          return;
        }
      }
      this.axios({
        method: "get",
        url: "/index.php/v1/api/jd/getgoodsbd",
        params: {
          apikey: "95c765fcf2939bc8",
          activityid: 10001
        }
      })
        .then(result => {
          if (result.data.status_code == 200) {
            this.chaielist = result.data.data.data;
            let data = result.data.data.data;
            console.log(data,"data")
            this.$store.commit('Cation/HotCakesDataCation',data)
          }
        })
        .catch(err => {
          
        });
    },
    // 月销榜
    SalesList() {
      if(this.SalesListData){

        if (this.SalesListData.length > 0) {
          this.chaielist = this.SalesListData;
          
          return;
        }
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
            this.chaielist = result.data.data.data;
            let data = result.data.data.data;
            console.log(data,"data")
            this.$store.commit('Cation/SalesListDataCation',data)
          }
        })
        .catch(err => {
          
        });
    },

    // tab切换
    tablist(index) {
      if (this.searchlist[index].isActive) {
        return;
      }

      for (let i = 0; i < this.searchlist.length; i++) {
        if (this.searchlist[i].isActive) {
          this.searchlist[i].isActive = false;
          break;
        }
      }

      this.searchlist[index].isActive = true;

      if (index == 0) {
        if(this.PushListData){
          if (this.PushListData.length > 0) {
            this.chaielist = this.PushListData;
            
            return;
          }
        }
        this.PushList();
      } else if (index == 1) {
        if(this.SearchListData){
        
          if (this.SearchListData.length > 0) {
            this.chaielist = this.SearchListData;
            
            return;
          }
        }
        this.SearchList();
      } else if (index == 2) {
        if(this.HotCakesData){

          if (this.HotCakesData.length > 0) {
            this.chaielist = this.HotCakesData;
            
            return;
          }
        }
        this.HotCakes();
      } else {
        if(this.SalesListData){
          if (this.SalesListData.length > 0) {
            this.chaielist = this.SalesListData;
            
            return;
          }
        }
        this.SalesList();
      }

        // 格式排序下标
      for (let i = 0; i < this.listbox.length; i++) {
        this.listbox[i].isActive = false;
        this.listbox[i].isHas = true;
      }
      this.listbox[0].isActive = true;
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

    // 排序
    listboxs(index) {
      for (let i = 0; i < this.listbox.length; i++) {
        if (this.listbox[i].isActive) {
          this.listbox[i].isActive = false;
          break;
        }
      }
      this.listbox[index].isActive = true;

      // 综合排序
      if (index == 0) {
        for (let i = 0; i < this.searchlist.length; i++) {
          if (this.searchlist[i].isActive) {
            let resuce = this.searchlist[i].name;
            if (resuce == "PushList") {
              this.PushList();
            } else if (resuce == "SearchList") {
              this.SearchList();
            } else if (resuce == "HotCakes") {
              this.HotCakes();
            } else {
              this.SalesList();
            }
          }
        }
      }
      //   销量
      else if (index == 1) {
        let prices = "sales";
        if (this.listbox[index].isHas) {
          this.listpaix(prices);
        } else {
          this.listshenxu(prices);
        }
      }
      // 价格
      else if (index == 2) {
        let prices = "price_after";
        if (this.listbox[index].isHas) {
          this.listpaix(prices);
        } else {
          this.listshenxu(prices);
        }
      }
      //   信誉
      else if (index == 3) {
        let prices = "goodcommentsshare";
        if (this.listbox[index].isHas) {
          this.listpaix(prices);
        } else {
          this.listshenxu(prices);
        }
      }
    },

    listicon(index) {
      this.listbox[index].isHas = !this.listbox[index].isHas;
      this.listboxs(index);
    },

    // 降序
    listpaix(prices) {
      let list = [];
      for (let i = 0; i < this.chaielist.length; i++) {
        list.push(Number(this.chaielist[i][prices]));
      }
      let num = "";
      for (let o = 0; o < list.length; o++) {
        for (let j = o + 1; j < list.length; j++) {
          if (list[o] < list[j]) {
            num = list[o];
            list[o] = list[j];
            list[j] = num;
          }
        }
      }
      let alc = [];
      for (let i = 0; i < list.length; i++) {
        this.chaielist.forEach((v, index) => {
          if (list[i] == v[prices]) {
            alc.push(v);
            this.chaielist.splice(index, 1);
          }
        });
      }
      this.chaielist = alc;
    },
    // 升序
    listshenxu(prices) {
      let list = [];
      for (let i = 0; i < this.chaielist.length; i++) {
        list.push(Number(this.chaielist[i][prices]));
      }
      let num = "";
      for (let o = 0; o < list.length; o++) {
        for (let j = o + 1; j < list.length; j++) {
          if (list[o] > list[j]) {
            num = list[o];
            list[o] = list[j];
            list[j] = num;
          }
        }
      }
      let alc = [];
      for (let i = 0; i < list.length; i++) {
        this.chaielist.forEach((v, index) => {
          if (list[i] == v[prices]) {
            alc.push(v);
            this.chaielist.splice(index, 1);
          }
        });
      }
      this.chaielist = alc;
    }
  }
};
</script>

<style lang="less" scoped>
.title_box {
  width: 100%;
  height: 148px;
  background-color: aqua;
  .van-swipe {
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
}

.serchlist {
  width: 100%;
  position: fixed;
  bottom: 50px;
  left: 0;
  top: 148px;
  margin: auto;
  .Llist {
    width: 26%;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid #ccc;
    background-color: #fff;
    overflow-y: auto;
    .list_name {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      border-bottom: 1px solid #ccc;
    }
    .active {
      background-color: #e5e5e5;
      color: red;
    }
  }
  .list_box {
    width: 74%;
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    padding-left: 12px;
    box-sizing: border-box;
    div {
      margin-right: 10px;
      height: 28px;
    }
    .active {
      border-bottom: 2px solid red;
    }
    p {
      font-size: 12px;
      margin: 1px 4px;
    }
  }
  .Rlist {
    width: 74%;
    height: 100%;
    background-color: #ddd;
    overflow-y: auto;
    padding: 35px 5px 0 5px;
    box-sizing: border-box;
    .Rlist_list {
      width: calc(50% - 3px);
      margin-bottom: 5px;
      background-color: #fff;
      .list_img {
        width: 120px;
        height: 120px;
        margin: 4px auto;
        background-color: cadetblue;
      }
      .list_title {
        height: 26px;
        line-height: 26px;
        font-size: 16px;
        text-indent: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list_text {
        text-indent: 4px;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 4px;
      }
      .list_price {
        height: 20px;
        line-height: 20px;
        p {
          text-indent: 4px;
          color: red;
          font-weight: 700;
          span {
            font-size: 16px;
          }
        }
        del {
          color: #666;
          margin: 2px 4px 0 0;
        }
      }
    }
  }
}
</style>