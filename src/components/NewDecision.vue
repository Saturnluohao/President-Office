<template>
  <div id="new-decision">
    <ul id="decision-item">
      <li>新建决策项</li>
      <li>决策项标题</li>
      <li><Input v-model="title"></Input></li>
      <li>相关节点</li>
      <li>二级节点</li>
      <li>
        <Select
          v-model="level2"
          @on-select="secondLevel"
          filterable>
          <Option v-for="(item,index) in option2" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </li>
      <li>三级节点</li>
      <li>
        <Select
          v-model="level3"
          @on-select="thirdLevel"
          filterable>
          <Option v-for="item in option3" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </li>
      <li>四级节点</li>
      <li>
        <Select
          v-model="level4"
          @on-select="forthLevel"
          filterable>
          <Option v-for="item in option4" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </li>
      <li>五级节点</li>
      <li>
        <Select
          v-model="level5"
          @on-select="fifthLevel"
          filterable>
          <Option v-for="item in option5" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </li>
      <li>六级节点</li>
      <li>
        <Select
          v-model="level6"
          @on-select="sixthLevel"
          filterable>
          <Option v-for="item in option6" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </li>
    </ul>
    <div id="button">
      <button @click="addItem">创建</button>
      <button @click="backHome">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewDecision",
  props: {
    setState: Function
  },
  data() {
    return {
      title: '',
      level2: '',
      level3: '',
      level4: '',
      level5: '',
      level6: '',
      data: [],
      option2: [],
      option3: [],
      option4: [],
      option5: [],
      option6: [],
      lastLevel: 0,
      tmpData: null
    }
  },
  methods: {
    backHome(){
      this.setState('home_side');
    },
    secondLevel(item){
      this.data[1] = this.data[0].filter(d => d.name === item.value)[0].children;
      this.option3 = this.data[1].map(d => d.name);
      this.lastLevel = 1;
    },
    thirdLevel(item){
      this.data[2] = this.data[1].filter(d => d.name === item.value)[0].children;
      this.option4 = this.data[2].map(d => d.name);
      this.lastLevel = 2;
    },
    forthLevel(item){
      this.data[3] = this.data[2].filter(d => d.name === item.value)[0].children;
      this.option5 = this.data[3].map(d => d.name);
      this.lastLevel = 3;
    },
    fifthLevel(item){
      this.data[4] = this.data[3].filter(d => d.name === item.value)[0].children;
      this.option6 = this.data[4].map(d => d.name);
      this.lastLevel = 4;
    },
    sixthLevel(item){
      this.data[5] = this.data[4].filter(d => d.name === item.value)[0].children;
      this.lastLevel = 5;
    },
    addItem(){
      let newNode = {
        name: this.title
      }
      this.data[this.lastLevel].push(newNode);
      this.$store.commit('setData', this.tmpData);
      this.$Message.success('新建决策项成功: ' + this.title);
    }
  },
  mounted() {
    this.data = new Array(5);
    this.tmpData = this.$store.state.circle_pack_data;
    this.data[0] = this.tmpData.children;
    this.option2 = this.data[0].map(d => d.name);
  }
}
</script>

<style scoped>
#new-decision {
  height: 100%;
}

#decision-item {
  list-style: none;
  color: white;
  width: 60%;
  margin-left: 20%;
}

#decision-item >>> .ivu-select-selection {
  border: none;
  background: rgb(55, 55, 62);
}

#decision-item >>> .ivu-select-dropdown {
  background: rgb(55, 55, 62);
}

#decision-item >>> .ivu-select-dropdown li {
  color: white;
  border: 1px solid rgb(55, 55, 62);
}

#decision-item >>> .ivu-select-dropdown li:hover {
  border-color: white;
  background: rgb(55, 55, 62);
}

#decision-item >>> .ivu-input {
  background: rgb(55, 55, 62);
  border: none;
  color: white;
  border: none;
}

#decision-item >>> .ivu-select-input {
  color: white;
}

#decision-item li {
  margin: 10px 0;
}

#decision-item li:first-child {
  font-size: 150%;
  margin: 20px 0;
}

#decision-item li:nth-child(2) {
  font-size: 120%;
}

#decision-item li:nth-child(4) {
  margin-top: 20px;
  font-size: 120%;
}

#button {
  margin-top: 20%;
  margin-left: 20%;
  margin-bottom: 20%;
  width: 60%;
}

#button button {
  border: 1px solid rgb(55, 55, 62);
  background: rgb(55, 55, 62);
  color: white;
  padding: 5px 20px;
  float: right;
  margin: 0 5px;
  outline: none;
}

#button button:hover {
  border-color: white;
}
</style>
