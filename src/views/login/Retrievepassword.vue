<template>
  <div>
    <van-nav-bar title="找回密码" left-text="返回" right-text="关闭" left-arrow 
      @click-left="onClickLeft"
      @click-right="onClickRight"/>

    <van-form @submit="commit">
      <van-field
        v-model="userInfo.phone"
        type="text"
        label="手机号"
        placeholder="注册时手机号"
        left-icon="phone-o"
        maxlength="11"
      />
      <van-field
        @click-right-icon="ace"
        v-model="userInfo.password"
        :type="isEye ? 'text' : 'password'"
        label="新密码"
        placeholder="字母数字_组合(6-16位)"
        left-icon="lock"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        maxlength="16"
      />
      <div class="btn_box">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import validForm from "../../assets/js/validForm";
export default {
  data() {
    return {
      userInfo: {
        phone: "",
        password: ""
      },
      //false: 闭合，true：睁开
      isEye: false,
    };
  },
  methods: {
      onClickLeft(){
          this.$router.go(-1)
      },
      onClickRight(){
          this.$router.push('/homepage')
      },
      ace(){
          this.isEye = !this.isEye
      },
    //提交，找回密码
    commit() {
      if (!validForm.validUserForm(this.userInfo)) {
        return;
      }
      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.userInfo.phone,
          password: this.userInfo.password
        }
      })
        .then(result => {
          //   this.$toast.clear();
          

          if (result.data.code == "L001") {
            this.$router.push({ name: "Login" });
          this.$toast(result.data.msg);
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.btn_box {
  margin: 20px;
}
</style>