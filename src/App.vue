<template>
  <div id="app">
<!--    <HomePage></HomePage>-->
<!--    <DetailPage></DetailPage>-->
<!--    <NewDecision></NewDecision>-->
    <router-view></router-view>
<!--    <CirclePack width=500 height=500 svg_height=700 display_theme=0></CirclePack>-->
  </div>
</template>

<script>
import CirclePack from "./components/CirclePack";
import HomePage from "./pages/HomePage";
import NewDecision from "./components/NewDecision";
import DetailPage from "./pages/DetailPage";
export default {
  name: 'App',
  components: {DetailPage, NewDecision, HomePage, CirclePack},
}

</script>

<style>
  html, body {
    background: rgb(17, 16, 21);
    height: 100%;
  }

  #app {
    height: 100%;
  }
</style>
