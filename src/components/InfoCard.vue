<template>
  <div id="info-card">
    <p id="name">{{ name }}
      <Icon :type="arrowDir" @click="toggleCollapse"></Icon>
    </p>
    <div v-show="!collapse">
      <ul id="tags">
        <li v-for="(item, index) in tags">{{ item }}</li>
      </ul>
      <p class="info-item">成绩</p>
      <div>
        <div id="circles">
          <i-circle percent="0" stroke-color="white" stroke-width="1" trail-width="1">
            <p style="font-size:24px">615</p>
            <br/>
            <p style="font-size: 6px">最近总分</p>
          </i-circle>
          <i-circle percent="0" stroke-color="white" stroke-width="1" trail-width="1">
            <p>
              <span style="font-size:24px">15</span>
              <span style="font-size:6px">&nbsp&nbsp/600</span>
            </p>
            <br/>
            <p style="font-size: 6px">最近年级排名</p>
          </i-circle>
        </div>
        <div id="chart"></div>
      </div>
      <!--    <p class="info-item">重大荣誉</p>-->
      <!--    <ul>-->
      <!--      <li v-for="(item, index) in honors">{{ item }}</li>-->
      <!--    </ul>-->
      <!--    <p class="info-item">参与活动</p>-->
      <!--    <ul>-->
      <!--      <li v-for="(item,index) in activities">{{ item }}</li>-->
      <!--    </ul>-->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "InfoCard",
  props: {
    name: String
  },
  data() {
    return {
      tags: ["高二（12)班", "17岁", "男"],
      honors: ["2019年度 全国数学竞赛一等奖", "2019年度 校级田径比赛三等奖"],
      activities: ["2020年度 学生会主席", "2019年校联欢会主持人", "2019年省博览会志愿者"],
      time: ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月'],
      scores: [500, 580, 498, 638, 512, 511, 575, 515, 624, 521],
      ranks: null,
      collapse: false
    }
  },
  methods: {
    drawChart() {
      var myChart = echarts.init(document.getElementById('chart'));

      // 指定图表的配置项和数据
      var option = {
        // title: {
        //   text: 'ECharts 入门示例'
        // },
        tooltip: {},
        // legend: {
        //   data:['销量']
        // },
        xAxis: {
          data: this.time,
          axisLine: {
            symbol: ['none', 'arrow'],
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '分数',
          interval: 200,
          splitLine: {
            lineStyle: {
              color: 'rgb(106,106,109)'
            }
          },
          nameTextStyle: {
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1,
            }
          }
        },
        series: [{
          name: 'score',
          type: 'bar',
          itemStyle: {
            color: 'rgb(59,86,162)'
          },
          data: this.scores
        }, {
          name: 'rank',
          type: 'line',
          itemStyle: {
            color: '#ffffff'
          },
          data: this.ranks
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    toggleCollapse(){
      this.collapse = !this.collapse;
      this.drawChart();
    }
  },
  computed: {
    arrowDir() {
      return this.collapse ? "ios-arrow-down" : "ios-arrow-up";
    }
  },
  mounted() {
    this.ranks = this.scores.map(d => d * 1.2);
    this.drawChart();
  }
}
</script>

<style scoped>
#info-card {
  background: rgb(41, 41, 47);
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
  color: white;
  padding: 10px 10px;
}

#name {
  color: white;
  font-size: 140%;
  margin-left: 5%;
}

#name >i {
  float: right;
  margin-right: 5%;
}

#tags {
  list-style: none;
  width: 90%;
  margin-left: 5%;
  margin-top: 10px;
}

#tags li {
  background: rgb(121, 121, 121);
  display: inline-block;
  padding: 3px 15px;
  border-radius: 5px;
  margin: 0 10px;
}

#tags li:first-child {
  margin-left: 0;
}

.info-item {
  margin-left: 5%;
  margin-top: 20px;
}

#circles {
  width: 90%;
  margin-left: 5%;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 50% 50%;
}

#chart {
  height: 300px;
  width: 300px;
  margin-left: 20px;
}
</style>
