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
        <Icon type="ios-search" size="32" @click="showSearchBox" v-if="searchFlag"></Icon>
        <SideSearch ref="sidesearch" :jump-to="jumpTo" :toggle-search="hideSearchBox" v-else></SideSearch>
      </li>
    </ul>
    <div @click="home" id="home">
      <Icon type="ios-home" size="32"></Icon>
    </div>
  </div>
</template>

<script>
import SideSearch from "./SideSearch";
export default {
  name: "ToolSideBar",
  components: {SideSearch},
  props:{
    showMenu: Function,
    reset: Function,
    locate: Function,
    jumpTo: Function
  },
  data(){
    return {
      searchFlag: true
    }
  },
  methods: {
    toSelected() {
      this.locate();
    },
    home(){
      this.$router.push('/');
    },
    showSearchBox(event){
      this.searchFlag = false;
      event.stopPropagation();
    },
    hideSearchBox(){
      this.searchFlag = true;
    }
  },
  mounted() {
    // let search = $("#tool-list li:nth-child(3)")[0];
    // this.$refs.sidesearch.setPosition(search.offsetTop);
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
  margin-left: 10px;
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
  margin-left: 10px;
}
</style>
