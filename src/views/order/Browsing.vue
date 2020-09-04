<template>
    <div>
        <van-nav-bar title="浏览记录" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div v-show="isHas">
            <div class="shoupli">
                <div class="shoupli_box clearfix" v-for="(item,index) in listDatas" :key="index" @click="jumpdetails(item.goods_id)">
                    <div class="shoupli_image fl">
                        <img :src="item.picurl" alt="">
                    </div>
                    <div class="shoupli_text fl">
                        <h1>{{item.goods_name}}</h1>
                        <h2>{{item.goods_desc}}</h2>
                        <h3 class="clearfix">
                            <span class="fl">{{item.pf_cname1}}</span>
                            <span class="fl">{{item.pf_cname2}}</span>
                            <span class="fl">{{item.pf_cname3}}</span>
                        </h3>
                        <p class="clearfix">
                            <span class="fl">￥{{item.price_after}}</span>
                            <i class="fr" @click.stop="removes(index)">X</i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="!isHas">
            <van-empty
                image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                description="暂无浏览记录"
            />
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");
    export default {
        data(){
            return{
                listDatas:[],
                isHas:true,
            }
        },
        created(){
            console.log(this.BrowsingHistory)
            if(this.BrowsingHistory.length == 0){
                this.isHas = false;
            }else{
                this.isHas = true;

                // if(this.BrowsingHistory.length > 0){
                    for(let i=0;i<this.BrowsingHistory.length;i++){
                        this.list(this.BrowsingHistory[i]);
                }
            }
            // }
            
        },
        computed:{
            ...mapState(["BrowsingHistory","HomePageCacheData"])
        },
        methods:{
            onClickLeft(){
                this.$router.go(-1);
            },
            list(pid){
                this.axios({
                    method: "get",
                    url: "/index.php/v1/api/jd/goodsdetail",
                    params: {
                        apikey: "95c765fcf2939bc8",
                        goods_id: pid
                    }
                }).then(res=>{
                    if(res.data.status_code == 200){
                        this.listDatas.unshift(res.data.data)
                    }
                }).catch(err=>{
                    
                })
            },
            removes(index){
                this.listDatas.splice(index,1);
                this.$store.commit("homePage/RemoveBrowsingHistoryData", {
                    index
                });
                if(this.listDatas.length == 0){
                    this.isHas = false;
                }
            },
            jumpdetails(goods_id){
                this.$router.push({
                    name:'Details',
                    query:{
                        goods_id
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
.shoupli{
    position: fixed;
    top: 46px;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #ddd;
    .shoupli_box{
        margin: 10px 0;
        width: 100%;
        height: 90px;
        padding: 10px 10px;
        // box-sizing: border-box;
        background-color: #fff;
        .shoupli_image{
            width: 90px;
            height: 90px;
            // margin: 6px;
            background-color: aquamarine;
        }
        .shoupli_text{
            width: calc(100% - 120px);
            height: 90px;
            margin-left: 10px;
            // background-color: blueviolet;
            h1{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 24px;
                line-height: 24px;
                color: #333;
            }
            h2{
                width: 95%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                margin: 2px 0 4px 0;
                color: #666;
            }
            h3{
                width: 100%;
                span{
                    border: 1px solid #ee0a24;
                    font-size: 12px;
                    padding: 0px 4px;
                    margin-right: 4px;
                    color: #ee0a24;
                    border-radius: 4px;
                }
            }
            p{
                margin-top: 2px;
                span{
                    font-size: 14px;
                    margin-top: 2px;
                }
                i{
                    margin-top: 5px;
                    margin-right: 5px;
                    font-style: 14px;
                    font-style: normal;
                }
            }
        }
    }
}
</style>