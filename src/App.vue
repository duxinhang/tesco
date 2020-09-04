<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
*{
  margin: 0;
  padding: 0;
}
.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
input{
  border:none;
  outline:medium;
}
h1,h2,h3,h4,h5,h6{
  font-weight: normal;
  font-size: 16px;
}
a{
  text-decoration: none;
  color: #ccc;
}
img{
  display: block;
  width: 100%;
}
</style>
