<template>
  <div id="side-menu">
    <Drawer placement="left" :closable="false" v-model="shouldDisplay" :width="25">
      <ul id="detailpage-decision-list">
        <li>决策事项</li>
        <li v-for="(item,i) in menuItems" @click="onClick(item)">{{item}}
          <Icon type="ios-arrow-forward"/>
        </li>
      </ul>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    setFocus: Function,
    jumpTo: Function
  },
  data(){
    return {
      shouldDisplay: false
    }
  },
  methods:{
    showMenu(){
      this.shouldDisplay = true;
    },
    onClick(name){
      this.shouldDisplay = false;
      this.jumpTo(name);
    }
  },
  computed: {
    menuItems(){
      let menu = [], queue = [];
      if (this.$store.state.circle_pack_data){
        queue.push(this.$store.state.circle_pack_data);
        while (queue.length !== 0){
          let p = queue.shift();
          if (p.children){
            for(let i = 0; i < p.children.length; i++){
              queue.push(p.children[i]);
            }
          }else {
            menu.push(p);
          }
        }
      }
      return menu.slice(0, 5).map(d => d.name);
    }
  }
}
</script>

<style scoped>
>>> .ivu-drawer-body {
  background: rgb(41, 41, 47);
}

#detailpage-decision-list {
  list-style: none;
  width: 80%;
  margin-left: 10%;
}

#detailpage-decision-list li {
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  text-align: left;
  color: white;
  background: rgb(55, 55, 62)
}

#detailpage-decision-list li:first-child {
  padding-left: 0;
  border: none;
  background: rgb(41, 41, 47);
  font-size: 150%;
}

#detailpage-decision-list i {
  float: right;
}
</style>
