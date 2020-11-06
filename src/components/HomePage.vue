<template>
  <div id="homepage">
    <Row>
      <i-col span="6">
        <div id="homepage-side">
          <div id="homepage-side-top">
            <ul id="homepage-decision-list">
              <li>决策事项
                <Icon type="md-add" size="24"></Icon>
              </li>
              <li>2020清华夏令营选拔
                <Icon type="ios-arrow-forward"/>
              </li>
              <li>市三好学生选拔
                <Icon type="ios-arrow-forward"/>
              </li>
              <li>2020清华夏令营选拔
                <Icon type="ios-arrow-forward"/>
              </li>
              <li>2020清华夏令营选拔
                <Icon type="ios-arrow-forward"/>
              </li>
              <li>2020清华夏令营选拔
                <Icon type="ios-arrow-forward"/>
              </li>
            </ul>
          </div>
          <div id="homepage-side-bottom">
<!--            <Dropdown placement="bottom-start" trigger="custom">-->
<!--              <Input-->
<!--                search-->
<!--                placeholder="输入决策项内容"-->
<!--                @on-change="onChange"></Input>-->
<!--              <DropdownMenu slot="list">-->
<!--                <DropdownItem>驴打滚</DropdownItem>-->
<!--                <DropdownItem>炸酱面</DropdownItem>-->
<!--                <DropdownItem>豆汁儿</DropdownItem>-->
<!--                <DropdownItem>冰糖葫芦</DropdownItem>-->
<!--                <DropdownItem>北京烤鸭</DropdownItem>-->
<!--              </DropdownMenu>-->
<!--            </Dropdown>-->
            <Select
              v-model="model14"
              @on-select="onSelected"
              filterable
              :remote-method="remoteMethod2"
              :loading="loading2">
              <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
          </div>
          <div id="thumbnail">
            <CirclePack width=100 height=100 svg_height="250" display_theme=0 root_font_size=8 children_font_size=4></CirclePack>
          </div>
          <div id="expand-icon">
            <Icon type="ios-expand" size="32"></Icon>
          </div>
        </div>
      </i-col>
      <i-col span="18">
        <div id="homepage-map">
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CirclePack from "./CirclePack";
export default {
  name: "HomePage",
  components: {CirclePack},
  data() {
    return {
      model14: [],
      loading2: false,
      options2: [],
      list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
    }
  },
  methods: {
    remoteMethod2(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          const list = this.list.map(item => {
            return {
              value: item,
              label: item
            };
          });
          this.options2 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
        }, 200);
      } else {
        this.options2 = [];
      }
    },
    onChange(event) {
      console.log(event);
    },
    onSelected(item) {
      this.$router.push({
        name: 'circle_pack',
        params: {
          first_focus: 'analytics',
          width: 500,
          height: 500,
          svg_height: 700,
          display_theme: "2"
        }
      })
    }
  }
}
</script>

<style>
#homepage {
  background: rgb(41, 41, 47);
}

#homepage-decision-list {
  list-style: none;
  width: 60%;
  margin-left: 20%;
}

#homepage-decision-list li {
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  text-align: left;
  color: white;
  background: rgb(55, 55, 62)
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
  width: 60%;
  margin-left: 20%;
  margin-top: 10%;
}

#thumbnail {
  width: 60%;
  margin-left: 20%;
  margin-top: 5%;
}

#expand-icon i{
  width: 60%;
  margin-left: 40%;
  float: right;
  color: white;
}
</style>
