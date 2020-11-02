<template>
  <div id="app">
    <CirclePack width=500 height=500 svg_height=700></CirclePack>
  </div>
</template>

<script>
import CirclePack from "./components/CirclePack";
export default {
  name: 'App',
  components: {CirclePack}
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
