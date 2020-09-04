<template>
  <div>
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="logo">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class v-if="isActive">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="openpass" />
        <van-cell title="注销账号" is-link @click="removess" />
      </van-cell-group>
      <div class="toubag">
        <van-button :round="true" @click="logout" :block="true" type="danger">退出登录</van-button>
      </div>
    </div>
    <div class v-else>
      <van-form @submit="commit">
        <van-field v-model="pwds.oldPassword" label="旧密码" placeholder="旧密码" />
        <van-field v-model="pwds.password" type="text" label="新密码" placeholder="新密码" />
        <div class="toubag">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import validForm from "../../assets/js/validForm";
export default {
  data() {
    return {
      isActive: true,
      pwds: {
        oldPassword: "",
        password: ""
      }
    };
  },
  created() {
    this.isActive = true;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    openpass() {
      this.isActive = false;
    },
    //提交修改密码
    commit() {
      if (!validForm.validUserForm(this.pwds)) {
        return;
      }

      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          //新的密码
          password: this.pwds.password,
          //旧密码
          oldPassword: this.pwds.oldPassword
        }
      })
        .then(result => {
          //关闭修改密码弹出框
          this.isOpen = false;
          if (result.data.code == "E001") {
            //清除token
            localStorage.removeItem("__Tk");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 注销账号
    removess() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "一旦注销，数据无法恢复"
        })
        .then(() => {
          // on confirm
          //发起注销请求

          let tokenString = localStorage.getItem("__Tk");

          this.axios({
            method: "POST",
            url: "http://www.kangliuyong.com:10002/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              if (result.data.code == "G001") {
                //清除token
                localStorage.removeItem("__Tk");
                this.$router.push({ name: "Login" });
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              
            });
        })
        .catch(err => {
          
        });
    },
    // 退出登录
    logout() {
      localStorage.removeItem("__Tk");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="less" scoped>
.logo {
  width: 200px;
  height: 200px;
  margin: 50px auto;
}
.toubag {
  margin: 40px 20px;
  button {
    background-color: cadetblue;
    border-color: cadetblue;
  }
}
</style>