<template>
  <div id="search" @click="preventHide">
    <Select
      @on-select="onSelected"
      filterable
      prefix="ios-search"
      placeholder="输入以搜索"
      :remote-method="remoteMethod">
      <Option v-for="(option, index) in options" :value="option.value" :key="index">{{ option.label }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  name: "SideSearch",
  props: {
    jumpTo: Function,
    toggleSearch: Function
  },
  data(){
    return {
      show: false,
      options: [],
      list: []
    }
  },
  methods: {
    remoteMethod(query) {
      if (this.list.length === 0) {
        this.flatten(this.$store.state.circle_pack_data);
      }
      if (query !== '') {
        const list = this.list.map(item => {
          return {
            value: item,
            label: item
          };
        });
        this.options = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
      } else {
        this.options = [];
      }
    },
    flatten(json) {
      this.list.push(json.name);
      if (json.children) {
        for (let i = 0; i < json.children.length; i++) {
          this.flatten(json.children[i]);
        }
      }
    },
    onSelected(item) {
      this.jumpTo(item.value);
      this.show = false;
      this.toggleSearch();
    },
    setPosition(top){
      document.getElementById("search").style.top = top;
    },
    preventHide(event){
      event.stopPropagation();
    }
  }
}
</script>

<style scoped>
#search {
  width: 200px;
}

#search >>> .ivu-icon {
  color: white;
}

#search >>> .ivu-select-selection {
  background: rgb(55, 55, 62);
  border: none;
}

#search >>> .ivu-select-input {
  color: white;
}

#search >>> .ivu-select-dropdown {
  background: rgb(55, 55, 62);
}

#search >>> .ivu-select-dropdown-list li {
  color: white;
  border: 1px solid rgb(55, 55, 62);
}

#search >>> .ivu-select-dropdown-list li:hover {
  background: rgb(55, 55, 62);
  border: 1px solid white;
}
</style>
