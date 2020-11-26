<template>
  <div id="detail-page">
    <div id="circle-pack">
      <CirclePack width=600 height=600 svg_height="100%" svg_width="100%" :display_theme="display_theme" :first_focus="currentFocus" :setFocus="setFocus" ref="circlepack"></CirclePack>
    </div>
    <div id="tool-bar">
      <ToolSideBar ref=sidebar :showMenu="showMenu" :reset="jumpTo" :locate="locate" :jumpTo="jumpTo"></ToolSideBar>
    </div>
    <div id="detail">
      <div id="intro-card">
        <p id="intro-title">{{currentFocus[currentFocus.length - 1]}} </p>
        <p id="intro-desc">
          描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
        </p>
      </div>
      <div id="choices">
        <button :style="{color: btn1_color}" @click="setState('business')">业务</button>
        <button :style="{color: btn2_color}" @click="setState('role')">角色</button>
      </div>
      <div id="roles" v-if="currentState === 'role'">
        <Collapse>
          <Panel name="1">
            史蒂夫·乔布斯
            <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
          </Panel>
          <Panel name="2">
            斯蒂夫·盖瑞·沃兹尼亚克
            <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
          </Panel>
          <Panel name="3">
            乔纳森·伊夫
            <p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
          </Panel>
        </Collapse>
      </div>
      <div id="business" v-else>
        <ul id="detailpage-decision-list">
          <li v-for="(item,i) in menuItems" @click="jumpTo(item)">
            {{item}}
            <img src="/static/arrow.svg"/>
          </li>
        </ul>
      </div>
    </div>
    <SideMenu ref="sidemenu" :setFocus="setFocus" :jumpTo="jumpTo"></SideMenu>
    <ul id="bottom-navi">
      <li v-for="(item,i) in currentFocus.slice(0, currentFocus.length - 1)" @click="navi(item, i)">
        {{item}}<Icon type="ios-arrow-forward"></Icon>
      </li>
      <li>{{currentFocus[currentFocus.length - 1]}}</li>
    </ul>
    <div id="school"></div>
    <div id="time">
      <p>{{ this.dateStr }}</p>
      <p>{{ this.timeStr }}</p>
    </div>
  </div>
</template>

<script>
import CirclePack from "../components/CirclePack";
import ToolSideBar from "../components/ToolSideBar";
import SideMenu from "../components/SideMenu";
import SideSearch from "../components/SideSearch";

import $ from 'jquery';

export default {
  name: "DetailPage",
  data(){
    return {
      display_theme: "1",
      currentState: "role",
      currentFocus: ['校园业务'],
      bar_or_menu: true,
      dateStr: null,
      timeStr: null,
      timer: null,
      options: [],
      list: []
    }
  },
  components: {SideSearch, SideMenu, ToolSideBar, CirclePack},
  methods: {
    setState(state){
      this.currentState = state;
    },
    setFocus(focus){
      this.currentFocus = focus;
    },
    showMenu(){
      this.$refs.sidemenu.showMenu();
    },
    jumpTo(name){
      this.$refs.circlepack.jumpTo(name);
    },
    navi(item, index){
      this.setFocus(this.currentFocus.slice(0, index + 1));
      this.jumpTo(item);
    },
    locate(){
      this.$refs.circlepack.locate();
    },
    getDateStr() {
      let date = new Date();
      let day;
      switch (date.getDay()) {
        case 0:
          day = "日";
          break;
        case 1:
          day = '一'
          break
        case 2:
          day = '二'
          break
        case 3:
          day = '三'
          break
        case 4:
          day = '四'
          break
        case 5:
          day = '五'
          break
        case 6:
          day = '六'

      }
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      this.dateStr = date.getFullYear() + "年" +
        date.getMonth() + "月" +
        date.getDate() + "日    星期" + day;
      this.timeStr = date.getHours() + ":" + minutes + ":" + seconds;
    }
  },
  computed: {
    btn1_color(){
      return this.currentState === "business" ? "white" : "#66646F";
    },
    btn2_color(){
      return this.currentState === "role" ? "white" : "#66646F";
    },
    menuItems(){
      let menu = [];
      if (this.$store.state.circle_pack_data){
        let cursor = this.$store.state.circle_pack_data;
        for (let i = 1; i < this.currentFocus.length; i++){
          cursor = cursor.children.filter(d => d.name === this.currentFocus[i])[0];
        }
        for(let i = 0; cursor.children && i < cursor.children.length; i++){
          menu.push(cursor.children[i]);
        }
      }
      return (menu.length > 5 ? menu.slice(0, 5) : menu).map(d => d.name);
    }
  },
  mounted() {
    if (this.$route.params.first_focus){
      this.currentFocus = this.$route.params.first_focus;
      this.display_theme = "2";
    };
    let self = this;
    this.timer = setInterval(function () {
      self.getDateStr();
    }, 1000);
    document.onclick = function (event){
      self.$refs.sidebar.hideSearchBox();
    }
  },
  beforeCreate(){
    // 添加背景色
    document.querySelector('body').setAttribute('style', 'background-color:black')
  },
  beforeDestroy(){
    document.querySelector('body').setAttribute('style', '');
    document.onclick = null;
    if (this.timer){
      clearInterval(this.timer);
    }
  },
}
</script>

<style scoped>
#detail-page {
  height: 100%;
  background: black;
}

#time {
  position: absolute;
  top: 10px;
  right: 20px;
  color: white;
}

#school {
  height: 8%;
  width: 16%;
  background-image: url("/static/school.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  left: 14px;
  top: 14px;
}

#circle-pack {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}

#tool-bar {
  position: absolute;
  height: 100%;
  top: 0;
  left: 20px;
}

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
}

#intro-card i{
  color: white;
}

#intro-title {
  display: block;
  font-size: 120%;
  height: 10%;
  padding-top: 20px;
  padding-left: 20px;
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

#choices {
  width: 90%;
  margin-left: 5%;
  margin-top: 0;
  padding: 10px 0;
  background: rgb(41, 41, 47);
  display: grid;
  grid-template-columns: 50% 50%;
}

#choices button{
  border: none;
  background: transparent;
  display: inline-block;
  outline: none;
}

#roles {
  width: 90%;
  margin-left: 5%;
  margin-top: 5%;
}

#roles .ivu-collapse {
  border: none;
}

#roles .ivu-collapse-item{
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

#bottom-navi {
  width: 50%;
  height: 32px;
  background: #37373e;
  position: absolute;
  bottom: 20px;
  left: 25%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

#bottom-navi li,i {
  color: rgb(142,142,146);
  cursor: pointer;
}

#bottom-navi li:last-child {
  color: white;
}
</style>
