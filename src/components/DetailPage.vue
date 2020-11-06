<template>
  <div id="detail-page">
    <Row>
      <i-col span="2">
        <div id="tool-side-bar">
          <ul id="tool-list">
            <li>
              <Icon type="ios-home" size="32"></Icon>
            </li>
            <li>
              <Icon type="ios-menu" size="32"></Icon>
            </li>
            <li>
              <Icon type="ios-contract" size="32"></Icon>
            </li>
            <li>
              <Icon type="ios-search" size="32"></Icon>
            </li>
          </ul>
        </div>
      </i-col>
      <i-col span="11">
        <div id="circle-pack">
          <CirclePack width=400 height=400 svg_height=600 display_theme=1></CirclePack>
        </div>
      </i-col>
      <i-col span="11">
        <div id="detail">
          <div id="intro-card">
            <p id="intro-title">校园业务</p>
            <p id="intro-desc">
              描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述
            </p>
          </div>
          <div id="choices">
            <button>业务</button>
            <button>角色</button>
          </div>
          <div id="roles">
            <Collapse v-model="value1">
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
          <div id="business">

          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CirclePack from "./CirclePack";

export default {
  name: "DetailPage",
  components: {CirclePack},
  methods: {}
}
</script>

<style scoped>
#detail-page {
  height: 100%;
}
#detail-page .ivu-row, .ivu-col{
  height: 100%;
}
#tool-list i {
  color: white;
}

#tool-side-bar {
  display: flex;
  align-items: center;
  height: 100%;
}

#tool-list {
  list-style: none;
  margin-left: 30%;
}

#tool-list li {
  margin: 15px 0;
}

#tool-list li:nth-child(2) {
  margin-bottom: 70px;
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
  color: white;
  display: inline-block;
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
</style>
