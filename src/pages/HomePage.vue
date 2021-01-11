<template>
  <div id="homepage">
    <Rows id="content">
      <i-col span="6">
        <div id="school"></div>
        <HomeSide v-if="state === 'home_side'" :setState="setState"></HomeSide>
        <NewDecision v-else :setState="setState"></NewDecision>
      </i-col>
      <i-col span="18">
        <div id="homepage-map">
          <div id="map">
            <!--            <embed src="/static/school.svg" id="map-container"/>-->
          </div>
          <div id="time">
            <p>{{ this.dateStr }}</p>
            <p>{{ this.timeStr }}</p>
          </div>

          <div class="box" id="old-school">
            <span class="triangle left"></span>
            <div class="pop-card">
              <p class="title">老校友代表座谈会<Icon type="md-close" @click="hidePops"></Icon></p>
              <p class="sub-title">办公楼二层东接待室</p>
              <Carousel loop>
                <CarouselItem>
                  <div class="my-carousel-item" id="first_os"></div>
                </CarouselItem>
                <CarouselItem>
                  <div class="my-carousel-item" id="second_os"></div>
                </CarouselItem>
                <CarouselItem>
                  <div class="my-carousel-item" id="third_os"></div>
                </CarouselItem>
              </Carousel>
              <p class="desc">
                6月2日上午，学校邀请部分老校友代表举行座谈会。山东师大附中校长荆兆晶，党委书记孟宪喆，纪委书记、副校长陈德海，副校长、本校区执行校长刘从军出席座谈会。<br/>
                座谈会在办公楼二层东接待室进行，刘从军主持座谈会并从办学理念、师资力量、教学设施、教育质量、办学特色几个方面向老校友介绍了附中的发展情况。荆兆晶代表学校对老校友的到来表示热烈欢迎，对老校友关心学校发展表示感谢，向老校友简要介绍了学校下一步全面发展提升的规划和举措，期待老校友继续关注支持学校的全面发展。<br/>
                应邀参加座谈会的有六十年代入校的赵乐成、李象新、赵世范、孙经先、白凤海五位老校友。各位老校友分别介绍了自己当年在校学习情况，从自身的学习经历和后来的发展经历中提炼出学校、老师对自己的深刻影响，对曾经培养自己的学校、老师表达了深厚的感激之情，表示要积极筹划，为学校七十周年校庆贡献智慧，尽绵薄之力。李象新向学校捐献了自己当年的学校数学竞赛和三好学生证书。<br/>
              </p>
            </div>
          </div>
          <div class="box" id="ai">
            <span class="triangle left"></span>
            <div slot="content" class="pop-card">
              <p class="title">人工智能实验室<Icon type="md-close" @click="hidePops"></Icon> </p>
              <p class="sub-title">实验楼A座一层大厅103&nbsp&nbsp2010年建成&nbsp&nbsp356平方米</p>
              <Carousel loop>
                <CarouselItem>
                  <div class="my-carousel-item" id="first_ai"></div>
                </CarouselItem>
              </Carousel>
              <p class="desc">
                学生在人工智能实验室通过人工智能课程的学习，将具备一定的应用人工智能知识处理实际问题、参与公共事务的能力，并通过图形化编程实现算法思维。
              </p>
              <Divider></Divider>
              <div id="contact">
                <div>
                  <Avatar src="static/ai/image_person.png" size="48"></Avatar>
                </div>
                <div>
                  <p>负责人</p>
                  <p style="font-size: 130%">李老师</p>
                </div>
                <div>
                  <Icon type="ios-call-outline" size="16"></Icon>
                  15211015430
                </div>
              </div>
            </div>
          </div>
        </div>
      </i-col>
    </Rows>
  </div>
</template>

<script>
import CirclePack from "../components/CirclePack";
import NewDecision from "../components/NewDecision";
import HomeSide from "../components/HomeSide";
import * as d3 from 'd3';

export default {
  name: "HomePage",
  components: {HomeSide, NewDecision, CirclePack},
  data() {
    return {
      state: "home_side",
      dateStr: null,
      timeStr: null,
      poptip1: false,
      poptip2: false,
      img_group1: [1, 2, 3],
      img_group2: [1]
    }
  },
  methods: {
    setState(state) {
      this.state = state;
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
    },
    hidePops(){
      let pops = document.getElementsByClassName("box");
      for(let i = 0; i < pops.length; i++){
        pops[i].style.display = "none";
      }
    }
  },
  mounted() {
    let self = this;
    this.timer = setInterval(function () {
      self.getDateStr();
    }, 1000);
    d3.svg("http://49.235.244.95/static/school.svg").then(function (data) {
      let svg = data.documentElement;
      svg.id = "map-container";
      document.getElementById("map").appendChild(svg);
      let mapParent = document.getElementById("homepage-map");
      svg = d3.select(svg);
      svg.attr("width", mapParent.clientWidth);
      svg.attr("height", mapParent.clientHeight);
      svg.call(d3.zoom().scaleExtent([1, 1]).on("zoom", function (event) {
        svg.select("g").attr("transform", event.transform);
        self.hidePops();
      }));
      svg.on("click", () => self.hidePops());

      let os = svg.select("#old-school-icon");
      let ai = svg.select("#ai-icon");
      let osText = svg.select("#old-school-text");
      let aiText = svg.select("#ai-text");
      os.node().style.cursor = "pointer";
      ai.node().style.cursor = "pointer";
      osText.node().style.cursor = "pointer";
      aiText.node().style.cursor = "pointer";
      let os_click = function (event) {
        event.stopPropagation();
        let pop = document.getElementById("old-school");
        pop.style.display = "block";
        pop.style.left = event.x + "px";
        pop.style.top = (event.y - 275) + "px";
      };
      let ai_click = function (event){
        event.stopPropagation();
        let pop = document.getElementById("ai");
        pop.style.display = "block";
        pop.style.left = event.x + "px";
        pop.style.top = (event.y - 275) + "px";
      }
      os.on("click", os_click);
      osText.on("click", os_click);
      ai.on("click", ai_click);
      aiText.on("click", ai_click);
    })
  },
beforeDestroy()
{
  if (this.timer) {
    clearInterval(this.timer);
  }
}
}
</script>

<style>
#homepage {
  background: rgb(41, 41, 47);
  height: 100%;
  overflow: hidden;
}

#school {
  height: 5%;
  background-image: url("../assets/school.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 10%;
  margin-top: 14px;
}

#homepage .ivu-col {
  height: 100%;
}

#homepage-map {
  background-color: black;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

#time {
  position: absolute;
  top: 10px;
  right: 20px;
  color: white;
}

.title {
  font-size: 200%;
  margin-top: 10%;
}

.title > i {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
  cursor: pointer;
}

.sub-title {
  margin-bottom: 5%;
}

.desc {
  white-space: pre-line;
}

.pop-card {
  color: white;
  width: 380px;
  height: 500px;
  overflow: scroll;
  overflow-x: hidden;
  padding-left: 15px;
  padding-bottom: 20px;
}

.my-carousel-item {
  background-size: contain;
  height: 200px;
  background-repeat: no-repeat;
}

#first_os {
  background-image: url('../assets/old_schoolmate/image_1.jpg');
}

#second_os {
  background-image: url('../assets/old_schoolmate/image_2.jpg');
}

#third_os {
  background-image: url('../assets/old_schoolmate/image_3.jpg');
}

#first_ai {
  background-image: url("../assets/ai/image_1.png");
}

#contact {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#contact div:first-child {
  margin-right: 20px;
}

#contact div:last-child {
  flex: 1;
  text-align: right;
}

.box {
  height: 500px;
  margin: 25px;
  background-color: black;
  border-radius: 3.25px;
  position: fixed;
  background-color: black;
  border: 1px solid white;
}
.box .triangle {
  width: 13px;
  height: 13px;
  position: absolute;
  background: black;
  z-index: 1;
  border: 1px solid transparent;
}
.box .triangle.left {
  border-left-color: white;
  border-bottom-color: white;
  left: -7px;
  top: 50%;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
