<template>
  <div id="tool-side-bar">
    <ul id="tool-list">
      <li @click="reset('校园业务')">
        <Icon type="ios-home" size="32"></Icon>
      </li>
      <li @click="showMenu">
        <Icon type="ios-menu" size="32"></Icon>
      </li>
      <li @click="toHome">
        <Icon type="ios-contract" size="32"></Icon>
      </li>
      <li>
        <Icon type="ios-search" size="32"></Icon>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ToolSideBar",
  props:{
    showMenu: Function,
    reset: Function
  },
  methods: {
    toHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
#tool-list i {
  color: white;
}

#tool-side-bar {
  display: flex;
  align-items: center;
  height: 100%;
}

#tool-list {
  list-style: none;
  margin-left: 30%;
}

#tool-list li {
  margin: 15px 0;
}

#tool-list li:nth-child(2) {
  margin-bottom: 70px;
}
</style>
