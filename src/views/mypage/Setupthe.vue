<template>
  <div>
    <van-nav-bar title="个人中心" left-text="返回" left-arrow @click-left="onClickLeft" />

    <div class="portrait">
      头像
      <div class="fr portrait_img">
        <img :src="userimage ? userimage : ''" alt />
      </div>
      <div class="tempale">
        <van-uploader :after-read="afterRead" />
      </div>
    </div>
    <div class="personal">
      账户
      <div class="fr">{{accout}}</div>
    </div>
    <div class="personal" @click="showPopup({key:'nickName',url:'/updateNickName'})">
      用户名
      <div class="fr">{{userlist.nickName}}</div>
    </div>
    <div class="personal" @click="showPopup({key:'desc',url:'/updateDesc'})">
      简介
      <div class="fr">{{userlist.desc ? userlist.desc : '无'}}</div>
    </div>

    <van-popup class="poput" v-model="show" position="bottom">
        <input type="text" v-model="name">
        <button @click="add">确认</button>
    </van-popup>

    <div class="logout" @click="outgin">退出登录</div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            userlist:[],
            show: false,
            name:'',
            userimage:'',
            list:[],
            accout:''
        }
    },
    created(){
      if(localStorage.getItem('__Tk')){

        this.getUserInfo();
        let accountString = localStorage.getItem("__Zh");
        if(accountString.length>0){
          this.accout = accountString
        }
      }
    },
  methods: {
      //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          if (result.data.code == "A001") {
            this.userlist = result.data.result[0];
            this.userimage = this.userlist.userImg;
            // console.log(result)
          }
        })
        .catch(err => {});
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );
      //获取图片类型
      let imgType = file.file.type.split("/")[1];

      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          if (result.data.code == "H001") {
            // this.userInfo.userImg = result.data.userImg;
            
            this.userimage = result.data.userImg;
            this.$toast(result.data.msg);
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {});
    },
    // 修改昵称，简介
    updateUserInfo(){
        
        let tokenString = localStorage.getItem("__Tk");
        // 
        this.axios({
            method:'post',
            url:'http://www.kangliuyong.com:10002'+ this.list.url +'',
            data:{
                appkey:this.appkey,
                tokenString,
                [this.list.key]:this.name
            }
        }).then(result=>{
            console.log(result,"result==>")
            this.$toast(result.data.msg);
        }).catch(err=>{
            console.log(err,'err=>')
        })
    },
    // 弹出层
    showPopup(list) {
        this.show = true;
        this.list = list;
    },

    // 修改昵称，简介
    add(){
        this.show = false;
        if(this.name !== ''){
            this.userlist[this.list.key] = this.name;
            this.updateUserInfo();
            this.name = '';
        }
    },

    // 退出登录
    outgin(){
        let tokenString = localStorage.getItem("__Tk");

        this.axios({
            method:'post',
            url:'http://www.kangliuyong.com:10002/logout',
            data:{
                appkey:this.appkey,
                tokenString
            }
        }).then(result=>{
            this.$toast(result.data.msg);
            localStorage.removeItem("__Tk");
            localStorage.removeItem("__Zh");
            this.$router.push('/login')
        }).catch(err=>{
            this.$toast(result.data.msg);
        })
    }
  }
};
</script>

<style lang="less" scoped>
.portrait {
  width: 100%;
  height: 80px;
  line-height: 80px;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  position: relative;
  .portrait_img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin: 10px 0;
    background-color: aquamarine;
    box-shadow: 0px 0px 5px #333333;
    img{
        width: 60px;
        height: 60px;
    }
  }
  .tempale {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    .van-uploader{
        width: 60px;
        height: 60px;
    }
  }
}
.personal {
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  margin-top: 1px;
  div{
      max-width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
  }
}
.logout {
  width: 200px;
  height: 40px;
  border-radius: 20px;
  background-color: aquamarine;
  position: fixed;
  bottom: 20px;
  left: 50%;
  margin-left: -100px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
}
.poput{
    width: 100%;
    height: 200px;
    input{
        width: 60%;
        height: 40px;
        text-align: center;
        font-size: 16px;
        display: block;
        margin: 40px auto;
        border-bottom: 1px solid #ddd;
    }
    button{
        display: block;
        width: 180px;
        height: 38px;
        font-size: 14px;
        border: none;
        border-radius: 20px;
        margin: 60px auto 0;
    }
}
</style>