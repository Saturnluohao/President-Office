<template>
  <div id="tool-side-bar">
    <ul id="tool-list">
      <li @click="showMenu">
        <Icon type="ios-menu" size="32"></Icon>
      </li>
      <li @click="toSelected">
        <svg>
          <circle r="12" stroke="white" stroke-width="2px" cx="16" cy="16">
          </circle>
          <circle r="6" stroke="white" stroke-width="2px" cx="16" cy="16"></circle>
        </svg>
      </li>
      <li>
        <Icon type="ios-search" size="32" @click="showSearch"></Icon>
      </li>
    </ul>
    <div @click="home" id="home">
      <Icon type="ios-home" size="32"></Icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolSideBar",
  props:{
    showMenu: Function,
    reset: Function,
    locate: Function,
    showSearch: Function
  },
  methods: {
    toSelected() {
      this.locate();
    },
    home(){
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
#tool-side-bar {
  display: flex;
  align-items: center;
  height: 100%;
}

#tool-side-bar i {
  color: white;
  cursor: pointer;
}

#tool-list {
  list-style: none;
  margin-left: 30%;
}

#tool-list li {
  margin: 20px 0;
}

#tool-list li:nth-child(2) svg {
  height: 32px;
  width: 32px;
}

#home {
  position: absolute;
  bottom: 5%;
  margin-left: 30%;
}
</style>
