<template>
    <div>
        <van-nav-bar title="工具于服务" left-text="返回" left-arrow @click-left="onClickLeft" />

        <div class="bg_extension">
            <div class="swipe_images">
                <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                    <van-swipe-item>1</van-swipe-item>
                    <van-swipe-item>2</van-swipe-item>
                    <van-swipe-item>3</van-swipe-item>
                    <van-swipe-item>4</van-swipe-item>
                </van-swipe>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            onClickLeft(){
                this.$router.go(-1);
            }
        },
    }
</script>

<style lang="less" scoped>
.bg_extension{
    width: 100%;
    height: 200px;
    background-color: aquamarine;
    .swipe_images{
        width: 80%;
        height: 150px;
        margin: 0 auto;
        background-color: #ccc;
    }
}
</style>