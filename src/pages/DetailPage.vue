<template>
  <div id="detail-page">
    <Row>
      <i-col span="2">
        <ToolSideBar></ToolSideBar>
      </i-col>
      <i-col span="11">
        <div id="circle-pack">
          <CirclePack width=400 height=400 svg_height=600 display_theme=1 :setFocus="setFocus"></CirclePack>
        </div>
      </i-col>
      <i-col span="11">
        <div id="detail">
          <div id="intro-card">
            <p id="intro-title">{{currentFocus}}</p>
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
              <li v-for="(item,i) in menuItems">
                {{item}}
                <Icon type="ios-arrow-forward"/>
              </li>
            </ul>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CirclePack from "../components/CirclePack";
import ToolSideBar from "../components/ToolSideBar";

export default {
  name: "DetailPage",
  data(){
    return {
      currentState: "role",
      currentFocus: 'flare'
    }
  },
  components: {ToolSideBar, CirclePack},
  methods: {
    setState(state){
      this.currentState = state;
    },
    setFocus(focus){
      this.currentFocus = focus;
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
      let menu = [], queue = [];
      if (this.$store.state.circle_pack_data){
        queue.push(this.$store.state.circle_pack_data);
        while (queue.length !== 0){
          let p = queue.shift();
          if (p.name === this.currentFocus){
            for(let i = 0; i < p.children.length; i++){
              menu.push(p.children[i]);
            }
            break;
          }
          else if (p.children){
            for(let i = 0; i < p.children.length; i++){
              queue.push(p.children[i]);
            }
          }
        }
      }
      return menu.slice(0, 5).map(d => d.name);
    }
  },
  beforeCreate(){
    // 添加背景色
    document.querySelector('body').setAttribute('style', 'background-color:black')
  },
  beforeDestroy(){
    document.querySelector('body').setAttribute('style', '')
  },
}
</script>

<style scoped>
#detail-page {
  height: 100%;
  background: black;
}
#detail-page .ivu-row, .ivu-col{
  height: 100%;
}

#circle-pack {
  display: flex;
  align-items: center;
  height: 100%;
}

#intro-card {
  background: rgb(41, 41, 47);
  height: 40%;
  width: 80%;
  margin-left: 10%;
  margin-top: 10%;
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
  height: 65%;
  display: block;
  margin-left: 5%;
  margin-top: 5%;
  padding: 30px 20px;
  background: rgb(55, 55, 62);
}

#choices {
  width: 80%;
  margin-left: 10%;
  margin-top: 0;
  padding: 20px 0;
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
  width: 80%;
  margin-left: 10%;
  margin-top: 10%;
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

#detailpage-decision-list i {
  float: right;
}
</style>
