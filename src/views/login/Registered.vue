<template>
  <div>
    <van-nav-bar
      title="注册"
      left-text="登录"
      right-text="关闭"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="logo">
      <img src="../../assets/logo.png" alt />
    </div>

    <van-form @submit="register">
      <van-field
        v-model="userInfo.phone"
        type="text"
        label="手机号"
        left-icon="phone-o"
        placeholder="请输入11位手机号"
        maxlength="11"
      />
      <van-field
        v-model="userInfo.nickName"
        type="text"
        label="称昵"
        left-icon="manager-o"
        placeholder="请输入称昵"
        maxlength="8"
      />
      <van-field
        v-model="userInfo.password"
        :type="isHas ? 'text' : 'password'"
        label="密码"
        left-icon="goods-collect-o"
        :right-icon="isHas ? 'eye-o' : 'closed-eye'"
        placeholder="请输入以字母开头的(6-16)密码"
        @click-right-icon="isHas = !isHas"
        maxlength="16"
      />
      <div style="margin:10% 20px 0 20px;">
        <van-button round block type="info" native-type="submit">确认</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入验证模块
import validForm from "../../assets/js/validForm";
export default {
  data() {
    return {
      // 用户注册信息
      userInfo: {
        phone: "",
        nickName: "",
        password: ""
      },
      isHas: false,
      //false: 闭合，true：睁开
      isEye: false
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("/login");
    },
    onClickRight() {
      this.$router.push("/homepage");
    },
    //注册
    register() {
      //进行验证表单
      if (validForm.validUserForm(this.userInfo)) {
        //复制对象
        let data = Object.assign({}, this.userInfo);

        //请求密钥
        data.appkey = this.appkey;

        //发起注册请求
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/register",
          //post传递参数需要写在data
          data
        })
          .then(result => {
            if (result.data.code == 100) {
              //跳转到登录页面
              this.$router.push("/login");
              this.$toast(result.data.msg);
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {});
      }
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
.van-form {
  .van-field {
    margin-top: 5px;
  }
}
</style>