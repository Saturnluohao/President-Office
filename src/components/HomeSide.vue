<template>
  <div id="homepage-side">
    <div id="homepage-side-top" v-if="this.$store.state.circle_pack_data">
      <ul id="homepage-decision-list">
        <li>决策事项
          <Icon type="md-add" size="24" @click="addDecision"></Icon>
        </li>
        <li v-for="(item,i) in menuItems" @click="toDecision(item)">{{item}}
          <Icon type="ios-arrow-forward"/>
        </li>
      </ul>
    </div>
    <div id="homepage-side-bottom">
      <Select
        v-model="model"
        @on-select="onSelected"
        filterable
        prefix="ios-search"
        placeholder="输入以搜索"
        :remote-method="remoteMethod">
        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{ option.label }}</Option>
      </Select>
    </div>
    <div id="thumbnail">
      <CirclePack width=100 height=100 svg_height="250" svg_width="250" display_theme=0 root_font_size=8
                  children_font_size=4></CirclePack>
    </div>
<!--    <div id="expand-icon">-->
<!--      <Icon type="ios-expand" size="32" @click="expand"></Icon>-->
<!--    </div>-->
  </div>
</template>

<script>
import CirclePack from "./CirclePack";
export default {
  name: "HomeSide",
  components: {CirclePack},
  props: {
    setState: Function
  },
  data() {
    return {
      model: [],
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
    onSelected(item) {
      this.$router.push({
        name: 'detail',
        params: {
          first_focus: item.value
        }
      })
    },
    flatten(json) {
      this.list.push(json.name);
      if (json.children) {
        for (let i = 0; i < json.children.length; i++) {
          this.flatten(json.children[i]);
        }
      }
    },
    expand(){
      this.$router.push({
        name: 'detail'
      });
    },
    addDecision(){
      this.setState('newDecision');
    },
    toDecision(name){
      this.$router.push({
        name: 'detail',
        params: {
          first_focus: name
        }
      })
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
#homepage-decision-list {
  list-style: none;
  width: 70%;
  margin-left: 15%;
}

#homepage-decision-list li {
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  text-align: left;
  color: white;
  background: rgb(55, 55, 62);
}

#homepage-decision-list li:first-child {
  padding-left: 0;
  border: none;
  background: rgb(41, 41, 47);
  font-size: 150%;
}

#homepage-decision-list i {
  float: right;
}

#homepage-side-bottom {
  width: 70%;
  margin-left: 15%;
  margin-top: 10%;
}

#homepage-side-bottom >>> .ivu-icon {
  color: white;
}

#homepage-side-bottom >>> .ivu-select-selection {
  background: rgb(55, 55, 62);
  border: none;
}

#homepage-side-bottom >>> .ivu-select-input {
  color: white;
}

#homepage-side-bottom >>> .ivu-select-dropdown {
  background: rgb(55, 55, 62);
}

#homepage-side-bottom >>> .ivu-select-dropdown-list li {
  color: white;
  border: 1px solid rgb(55, 55, 62);
}

#homepage-side-bottom >>> .ivu-select-dropdown-list li:hover {
  background: rgb(55, 55, 62);
  border: 1px solid white;
}

#thumbnail {
  width: 70%;
  margin-left: 15%;
  margin-top: 5%;
}

/*#expand-icon i {*/
/*  width: 60%;*/
/*  margin-left: 40%;*/
/*  float: right;*/
/*  color: white;*/
/*}*/
</style>
