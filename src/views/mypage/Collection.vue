<template>
    <div>
        <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        methods:{
            onClickLeft(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>

</style>