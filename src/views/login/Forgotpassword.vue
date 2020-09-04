<template>
  <div>
    <van-nav-bar
      title="找回密码"
      left-text="返回"
      right-text="关闭"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div>
      <van-form>
        <van-field
          v-model="first.email"
          name="邮箱号"
          label="邮箱号"
          placeholder="邮箱号"
          :rules="[{ required: true, message: '请填写邮箱号' }]"
        />

        <van-field key="code" type="text" v-model="first.code" label="验证码" placeholder="6位验证码">
          <template #button>
            <van-button size="small" @click="add" type="info" :disabled="isSend">{{text}}</van-button>
          </template>
        </van-field>

        <div style="margin: 16px;">
          <van-button round block type="info" @click="next">下一步</van-button>
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
      first: {
        email: "",
        code: ""
      },
      text: "发送验证码",
      isSend: false
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.push("/homepage");
    },
    // 获取验证码
    add() {
      if (!validForm.validUserForm({ email: this.first.email })) {
        return;
      }
      //获取邮箱验证码
      let time = 60;
      this.text = time + "秒后重新发送";
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.text = time + "秒后重新发送";
        }
      }, 1000);

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.first.email
        }
      })
        .then(result => {
          
          this.$toast(result.data.msg);
        })
        .catch(err => {
          
        });
    },
    // 下一步
    next() {
      if (!validForm.validUserForm(this.first)) {
        return;
      }

      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.first.code
        }
      })
        .then(result => {
          if (result.data.code == "K001") {
                this.$router.push("/retrievepassword");
          this.$toast(result.data.msg);
          } else {
                this.$toast(result.data.msg);
          }
        })
        .catch(err => {
    
          this.$toast.clear();
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>