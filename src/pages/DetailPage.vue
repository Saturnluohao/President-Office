<template>
  <div id="detail-page">
    <div id="circle-pack">
      <CirclePack width=600 height=600 svg_height="100%" svg_width="100%" :display_theme="display_theme" :first_focus="currentFocus" :setFocus="setFocus" :showInfoCard="showInfoCard" ref="circlepack"></CirclePack>
    </div>
    <div id="tool-bar">
      <ToolSideBar ref=sidebar :showMenu="showMenu" :reset="jumpTo" :locate="locate" :jumpTo="jumpTo"></ToolSideBar>
    </div>
    <DetailSide :currentFocus="currentFocus" :navi="navi" :jumpTo="jumpTo" ref="side" :disableCandidate="disableCandidate"></DetailSide>
    <SideMenu ref="sidemenu" :setFocus="setFocus" :jumpTo="jumpTo"></SideMenu>
    <ul id="bottom-navi">
      <li v-for="(item,i) in currentFocus.slice(0, currentFocus.length - 1)" @click="navi(item, i)">
        {{item}}<Icon type="ios-arrow-forward"></Icon>
      </li>
      <li>{{currentFocus[currentFocus.length - 1]}}</li>
    </ul>
    <div id="detailpage-school"></div>
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
import DetailSide from "../components/DetailSide";

export default {
  name: "DetailPage",
  data(){
    return {
      display_theme: "1",
      currentFocus: ['校园业务'],
      bar_or_menu: true,
      dateStr: null,
      timeStr: null,
      timer: null,
      options: [],
      list: [],
      candidates: ["葛亚特", "学生B", "学生C"]
    }
  },
  components: {DetailSide, SideSearch, SideMenu, ToolSideBar, CirclePack},
  methods: {
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
    showInfoCard(id){
      this.$refs.side.showInfoCard(this.candidates[id]);
    },
    disableCandidate(id){
      this.$refs.circlepack.disableCandidate(id);
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
  mounted() {
    // if (this.$route.params.first_focus){
    //   this.currentFocus = this.$route.params.first_focus;
    //   this.display_theme = "2";
    // };
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

#detailpage-school {
  height: 8%;
  width: 16%;
  background-image: url("../assets/school.png");
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
