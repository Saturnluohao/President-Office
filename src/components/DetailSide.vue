<template>
  <div id="detail">
    <div id="intro-card">
      <p id="intro-title">{{ lastFocus }}
        <Icon :type="arrowDir" @click="toggleCollapse"></Icon>
      </p>
      <p id="intro-desc" v-if="!collapse">
        描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
      </p>
    </div>
    <div v-if="!collapse">
      <div id="choices" :class="choicesClass" v-if="!isDecision">
        <button :style="{color: btn1_color}" @click="setState('business')">业务</button>
        <button :style="{color: btn2_color}" @click="setState('role')" v-if="currentFocus.length < 3">角色</button>
      </div>
      <div id="indicators" v-else>
        <ul id="indicator-list">
          <li>选拔指标重要程度</li>
          <li v-for="(item, index) in indicators" class="indicator">{{ item }}
            <ul class="ind-level">
              <li v-for="(level, i) in levels" @click="setIndicator(index, i)">
                <div><p>{{ level }}</p></div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="roles" v-if="currentState === 'role' && currentFocus.length < 3">
        <Collapse>
          <Panel name="1">
            史蒂夫·乔布斯
            <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
          </Panel>
          <Panel name="2">
            斯蒂夫·盖瑞·沃兹尼亚克
            <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
              Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
              Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
          </Panel>
          <Panel name="3">
            乔纳森·伊夫
            <p slot="content">
              乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
          </Panel>
        </Collapse>
      </div>
      <div id="business" v-else>
        <ul id="detailpage-decision-list">
          <li v-for="(item,i) in menuItems" @click="jumpTo(item)">
            {{ item }}
            <img src="../assets/arrow.svg"/>
          </li>
        </ul>
      </div>
    </div>

    <InfoCard v-if="infoCard" :name="name"></InfoCard>
  </div>
</template>

<script>
import InfoCard from "./InfoCard";

export default {
  name: "DetailSide",
  components: {InfoCard},
  props: {
    currentFocus: Array,
    navi: Function,
    jumpTo: Function,
    disableCandidate: Function
  },
  data() {
    return {
      infoCard: false,
      name: String,
      currentState: "business",
      indicators: ['成绩', '荣誉', '竞赛'],
      levels: [1, 2, 3, 4, 5],
      collapse: false
    }
  },
  methods: {
    setState(state) {
      this.currentState = state;
    },
    setIndicator(index, value) {
      let ind = document.querySelectorAll('.indicator')[index];
      let levels = ind.querySelectorAll('li');
      levels.forEach((level, index) => {
        level.style.background = index === value ? "rgb(48,59,94)" : "none";
      });
      this.disableCandidate(value % 3);
    },
    showInfoCard(name) {
      this.name = name;
      this.infoCard = true;
      this.collapse = true;
    },
    toggleCollapse(){
      this.collapse = !this.collapse;
    }
  },
  computed: {
    btn1_color() {
      return this.currentState === "business" || this.currentFocus.length > 2 ? "white" : "#66646F";
    },
    btn2_color() {
      return this.currentState === "role" ? "white" : "#66646F";
    },
    choicesClass() {
      return this.currentFocus.length < 3 ? "two-choices" : "single-choice";
    },
    menuItems() {
      let menu = [];
      if (this.$store.state.circle_pack_data) {
        let cursor = this.$store.state.circle_pack_data;
        for (let i = 1; i < this.currentFocus.length; i++) {
          cursor = cursor.children.filter(d => d.name === this.currentFocus[i])[0];
        }
        for (let i = 0; cursor.children && i < cursor.children.length; i++) {
          menu.push(cursor.children[i]);
        }
      }
      return (menu.length > 5 ? menu.slice(0, 5) : menu).map(d => d.name);
    },
    arrowDir() {
      return this.collapse ? "ios-arrow-down" : "ios-arrow-up";
    },
    isDecision() {
      return this.lastFocus === "2020清华夏令营";
    },
    lastFocus() {
      return this.currentFocus[this.currentFocus.length - 1];
    }
  }
}
</script>

<style scoped>
#detail {
  position: absolute;
  /*height: 100%;*/
  width: 24%;
  top: 15%;
  right: 0;
}

#intro-card {
  background: rgb(41, 41, 47);
  height: 30%;
  width: 90%;
  margin-left: 5%;
  color: white;
  padding-bottom: 10px;
}

#intro-card i {
  color: white;
}

#intro-title {
  display: block;
  font-size: 140%;
  height: 10%;
  padding-top: 20px;
  padding-left: 20px;
}

#intro-title > i {
  float: right;
  margin-right: 8%;
}

#intro-desc {
  width: 90%;
  height: 75%;
  display: block;
  margin-left: 5%;
  margin-top: 5%;
  padding: 30px 20px;
  background: rgb(55, 55, 62);
}

.two-choices {
  width: 90%;
  margin-left: 5%;
  margin-top: 0;
  padding: 0 0 10px 0;
  background: rgb(41, 41, 47);
  display: grid;
  grid-template-columns: 50% 50%;
}

.single-choice {
  width: 90%;
  margin-left: 5%;
  margin-top: 0;
  padding: 0 0 10px 0;
  background: rgb(41, 41, 47);
  display: grid;
}


#choices button {
  border: none;
  background: transparent;
  display: inline-block;
  outline: none;
}

#indicators {
  margin-top: 0;
  width: 90%;
  margin-left: 5%;
  color: white;
  background: rgb(41, 41, 47);
}

#indicators ul {
  list-style: none;
}

#indicator-list {
  width: 90%;
  margin-left: 5%;
  padding: 5px 0;
}

#indicator-list > li {
  margin: 5px 0;
}

#indicator-list > li:first-child {
  font-size: 130%;
  margin-top: 0;
}

#indicator-list ul {
  height: 35px;
  border: 3px solid rgb(102, 102, 104);
  border-radius: 5px;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(5, 20%);
}

#indicator-list ul li {
  text-align: center;
  height: 100%;
  cursor: pointer;
}

#indicator-list ul li > div {
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
}

#indicator-list ul li > div p {
  text-align: center;
  width: 100%;
}

.ind-level>li:nth-child(3) {
  background: rgb(48,59,94);
}

#roles {
  width: 90%;
  margin-left: 5%;
  margin-top: 5%;
}

#roles .ivu-collapse {
  border: none;
}

#roles .ivu-collapse-item {
  background: rgb(41, 41, 47);
  border: none;
  color: white;
}

#roles >>> .ivu-collapse-header {
  border: none;
  color: white;
}

#roles >>> .ivu-collapse-content {
  background: rgb(41, 41, 47);
  color: white;
  border: none;
}

#detailpage-decision-list {
  list-style: none;
  width: 90%;
  margin-left: 5%;
}

#detailpage-decision-list li {
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  text-align: left;
  color: white;
  background: rgb(55, 55, 62);
  cursor: pointer;
}

#detailpage-decision-list img {
  width: 16px;
  float: right;
}
</style>
