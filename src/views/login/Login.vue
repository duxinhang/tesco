<template>
  <div>
    <van-nav-bar
      title="登录"
      left-text="注册"
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
        v-model="userInfo.password"
        :type="isHas ? 'text' : 'password'"
        label="密码"
        left-icon="goods-collect-o"
        :right-icon="isHas ? 'eye-o' : 'closed-eye'"
        placeholder="请输入以字母开头的(6-16)密码"
        @click-right-icon="isHas = !isHas"
        maxlength="16"
      />
      <div class="wj fr" @click="forgot">忘记密码</div>
      <div style="margin:10% 20px 0 20px;">
        <van-button round block type="info" native-type="submit">确认</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("homePage");
// 导入验证模块
import validForm from "../../assets/js/validForm";
export default {
  data() {
    return {
      // 用户注册信息
      userInfo: {
        phone: "",
        password: ""
      },
      isHas: false
    };
  },
  methods: {
    onClickLeft() {
      
      this.$router.push('/registered')
    },
    onClickRight() {
      
      this.$router.push('/homepage')
    },
    // 忘记密码
    forgot(){
      this.$router.push("/forgotpassword")
    },
    //登录
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
          url: "http://www.kangliuyong.com:10002/login",
          //post传递参数需要写在data
          data
        })
          .then(result => {
            if (result.data.code == 200) {
                //存储token，用于后面登录验证
              localStorage.setItem('__Tk', result.data.token);
              localStorage.setItem('__Zh', this.userInfo.phone);
              //跳转到菜单
              this.$router.push('/homepage')
              this.$toast(result.data.msg);
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            
          });
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
.wj{
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
  margin-top: 10px;
  color: #666;
}
.van-form {
  .van-field {
    margin-top: 5px;
  }
}
</style>