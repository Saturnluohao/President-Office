<template>
  <div id="new-decision">
    <ul id="decision-item">
      <li>新建决策项</li>
      <li>决策项标题</li>
      <li><Input></Input></li>
      <li>相关节点</li>
      <li>二级节点</li>
      <li>
        <Select
          v-model="model11"
          filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </li>
      <li>三级节点</li>
      <li>
        <Select
          v-model="model11"
          filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </li>
      <li>四级节点</li>
      <li>
        <Select
          v-model="model11"
          filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </li>
      <li>五级节点</li>
      <li>
        <Select
          v-model="model11"
          filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </li>
      <li>六级节点</li>
      <li>
        <Select
          v-model="model11"
          filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </li>
    </ul>
    <div id="button">
      <button>创建</button>
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
      model14: [],
      loading2: false,
      options2: [],

      model11: '',
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
    }
  },
  methods: {
    backHome(){
      this.setState('home_side');
    }
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
