<template>
  <div id="circle-pack">
    <svg id="circle-pack-svg"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {
  name: "CirclePack",
  props: {
    first_focus: String,
    width: Number,
    height: Number,
    svg_height: Object,
    svg_width: Object,
    display_theme: String,
    root_font_size: Number,
    children_font_size: Number,
    setFocus: Function,
    showInfoCard: Function
  },
  data() {
    return {
      vargroup: Object,
      circle_group: Object,
      group1: null,
      group2: null,
      defs: Object,
      relations: Map,
      circles: Object,
      labels: Object,
      svg: Object,
      view: Object,
      focus: Object,
      focus_selection: null,
      currentRelations: [],
      color: ["#2A427A", "#2D4A88", "#1E3B7A", "#183474", "#132A62", "#091E54", "#091A44", "#000000"],
      state: "nav",
      funcId: Number
    };
  },
  methods: {
    pack: function (data) {
      let self = this;
      let id = 0;

      function construct_circlepack(hierarchy) {
        hierarchy.id = id++;
        if (hierarchy.height == 0) {
          return;
        }
        if (!hierarchy.parent) {
          hierarchy.r = self.width / 2;
          hierarchy.x = self.width / 2;
          hierarchy.y = self.height / 2;
        }
        let children_length = hierarchy.children.length;
        let sin_value = Math.sin(Math.PI / children_length);
        let sr = hierarchy.r;
        let cr = children_length === 1 ? sr / 2 : (sr * sin_value) / (1 + sin_value);
        let angle_offset = children_length === 1 ? -Math.PI / 2 : 0;
        for (let i = 0; i < children_length; i++) {
          hierarchy.children[i].r = cr;
          hierarchy.children[i].x =
            hierarchy.x +
            Math.cos((2 * i * Math.PI) / children_length + angle_offset) * (sr - cr);
          hierarchy.children[i].y =
            hierarchy.y -
            Math.sin((2 * i * Math.PI) / children_length + angle_offset) * (sr - cr);
          construct_circlepack(hierarchy.children[i]);
        }
        return hierarchy;
      }

      return construct_circlepack(d3.hierarchy(data));
    },

    disableCandidate(id){
      this.group1.cg.selectAll('circle').attr('filter', d => d.v2 === id ? 'url(#redify)' : 'none');
      this.group1.mg.selectAll('circle').style('display', d => d.circle === id ? 'inline' : 'none');
    },

    addKV(selection, k, v){
      let node = selection.node();
      if (!node.__data__){
        node.__data__ = {}
      }
      node.__data__[k] = v;
    },

    //从Transform字符串中获取Transform对象
    getTransform: function (selection) {
      let trans_str = selection
        .attr("transform")
        .match(/\(.+?\)/g)
        .map((d) => d.replaceAll("(", "").replaceAll(")", ""));
      let translation = [0, 0],
        scale = 1;
      if (trans_str.length === 0) {
        return d3.zoomIdentity;
      } else if (trans_str.length === 1) {
        if (trans_str[0].indexOf(",") < 0) {
          scale = +trans_str[0];
        } else {
          translation = trans_str[0].split(",").map((d) => +d);
        }
      } else {
        trans_str[0].split(",").map((d) => +d);
        scale = +trans_str[1];
      }
      return d3.zoomIdentity
        .translate(translation[0], translation[1])
        .scale(scale);
    },
    drawLine(option, groups){
      let direction = option.direction, x1 = option.pos[0], y1 = option.pos[1], x2 = option.pos[2], y2 = option.pos[3];
      let factor = direction > 90 && direction < 270 ? 4 : -4;
      let angle = (direction * Math.PI) / 180;
      let text_angle = direction > 90 && direction < 270 ? 180 - direction : -direction;
      let text_x = (x1 + x2) / 2 + Math.sin(angle) * factor,
          text_y = (y1 + y2) / 2 + Math.cos(angle) * factor;
      let text = groups.tg
        .append("text")
        .attr("transform", `translate(${text_x}, ${text_y})rotate(${text_angle})`)
        .attr("text-anchor", "middle")
        .attr("fill", option.textColor ? option.textColor : "white")
        .text(option.text)
        .attr('id', option.id)
        .style("font-size", option.fontSize ? option.fontSize : "8px");
      let line = groups.lg
        .append("line")
        .attr("id", option.id)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", option.color ? option.color : "white")
        .attr("stroke-width", option.width ? option.width : 1);
      this.addKV(line, "v1", option.v1);
      this.addKV(line, "v2", option.v2);
      this.addKV(text, "v1", option.v1);
      this.addKV(text, "v2", option.v2);

      return line;
    },

    drawRelation(option, groups){
      function getCordByRatio(a, b, ratio){
        return a + ratio * (b - a);
      };
      let c1 = this.circles.filter(d => d.id === option.v1);
      let c2 = groups.cg.selectAll('circle').filter(d => d.v2 === option.v2);

      let transform1 = this.getTransform(c1), transform2 = this.getTransform(c2);
      let x1 = transform1.x, y1 = transform1.y, x2 = transform2.x, y2 = transform2.y;
      let r1 = c1.attr("r"), r2 = c2.attr("r"), dis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      let line_x1 = getCordByRatio(x1, x2, r1 / dis), line_y1 = getCordByRatio(y1, y2, r1 / dis);
      let line_x2 = getCordByRatio(x1, x2, 1 - r2 / dis), line_y2 = getCordByRatio(y1, y2, 1 - r2 / dis);
      let direction = (Math.atan2(y1- y2, x2 - x1) * 180 / Math.PI + 180) % 180;

      this.drawLine({
        pos: [line_x1, line_y1, line_x2, line_y2],
        direction: direction,
        width: 0.5,
        fontSize: "6px",
        text: option.text,
        v1: option.v1,
        v2: option.v2
      }, groups)
    },

    //生成关系
    generateRelation(option, groups) {
      let self = this;
      let direction = option.direction,
          distance = option.distance,
          radius = option.radius;
      let c = this.circles.filter(d => d.id === option.v1);
      let transform = this.getTransform(c);
      let x1 = transform.x, y1 = transform.y, r = +c.attr("r");
      let angle = (option.direction * Math.PI) / 180;
      let x2 =
        Math.cos(angle) * (r + distance + radius) + x1;
      let y2 =
        -Math.sin(angle) * (r + distance + radius) + y1;

      let line_x1 = x1 + Math.cos(angle) * r, line_y1 = y1 - Math.sin(angle) * r;
      let line_x2 = x1 + Math.cos(angle) * (r + distance), line_y2 = y1 - Math.sin(angle) * (r + distance);

      // function dragStarted() {
      //   // d3.select(this).raise();
      //   this.line_group.attr("cursor", "grabbing");
      // }
      //
      // function dragged() {
      //   console.log(d3.event.dx, d3.event.dy);
      //   let self = d3.select(this);
      //   let line = this.relations.get(self);
      //   self.attr("cx", d3.event.x).attr("cy", d3.event.y);
      // }
      //
      // function dragEnded() {
      //   console.label("Event is " + event);
      // }

      this.drawLine({
        pos: [line_x1, line_y1, line_x2, line_y2],
        direction: direction,
        width: option.width,
        v1: option.v1,
        v2: option.v2
      }, groups);

      let new_circle = groups.cg
        .append("circle")
        .attr("transform", `translate(${x2},${y2})`)
        .attr("fill", option.fill ? option.fill : "red")
        .attr("r", radius)
        .attr("stroke", option.stroke ? option.stroke : "none")
        .attr("stroke-width", option.strokeWidth ? option.strokeWidth : "1");

      let tf_mark_radius = radius / 4;
      let trueMark = groups.mg
        .append('circle')
        .attr('transform', `translate(${x2 - radius / 2},${y2})`)
        .attr('fill', 'url(#true)')
        .attr('r', tf_mark_radius)
        .attr('stroke', 'none')
        .style('display', 'none')
        .on('click', function (e, d){
          self.group1.cg.selectAll('circle').filter(d => d.v2 === option.v2).attr('filter', 'none');
          self.group1.mg.selectAll('circle').filter(d => d.circle === option.v2).style('display', 'none');
        });
      let falseMark = groups.mg
        .append('circle')
        .attr('transform', `translate(${x2 + radius / 2},${y2})`)
        .attr('fill', 'url(#false)')
        .attr('r', tf_mark_radius)
        .attr('stroke', 'none')
        .style('display', 'none')
        .on('click', function(e, d){
          self.$store.commit('removeStudent', option.v2);
          self.drawStudents();
        });

      this.addKV(new_circle, "v2", option.v2);
      this.addKV(new_circle, "v1", option.v1);
      this.addKV(trueMark, 'circle', option.v2);
      this.addKV(falseMark, 'circle', option.v2);
      new_circle.on(option.listener.event, option.listener.callback);
    },

    highlight(event, data){
      let highlightId = data.v2;
      this.group1.lg.selectAll('line').style("opacity", d => d.v2 === highlightId ? 1 : 0.1);
      this.group1.cg.selectAll('circle').style("opacity", d => d.v2 === highlightId ? 1 : 0.1);
      this.group1.tg.selectAll('text').style("opacity", d => d.v2 === highlightId ? 1 : 0.1);

      this.circles.style('opacity', 1);
      // this.labels.style('opacity', 1);

      this.showInfoCard(highlightId);
    },

    addCandidate(event, data) {
      event.preventDefault();
      let to_add = this.$store.getters.getCandidate(data.v2);
      to_add.v1 = this.funcId;
      this.$store.commit('addStudent', to_add);
      this.$store.commit('removeCandidate', data.v2);

      this.drawStudents();
      this.drawCandidates();
    },

    drawStudents(){
      let self = this;
      if (this.group1){
        Object.values(this.group1).forEach(d => d.remove());
      }
      this.group1 = {
        lg: this.vargroup.append('g'),
        tg: this.vargroup.append('g'),
        cg: this.vargroup.append('g'),
        mg: this.vargroup.append('g')
      }
      if (this.$store.getters.hasStudents){
        self.generateGraph(this.$store.state.student_data, {
          event: "click",
          callback: self.highlight
        }, self.group1, true);
      }else{
        axios.get('/relations').then(res => {
          self.$store.state.student_data = res.data;
          self.generateGraph(res.data, {
            event: "click",
            callback: self.highlight
          }, self.group1);
        });
      }
      self.state = "fun";
    },

    drawCandidates(){
      let self = this;
      if (this.group2){
        Object.values(this.group2).forEach(d => d.remove());
      }
      this.group2 = {
        lg: this.vargroup.append('g'),
        tg: this.vargroup.append('g'),
        cg: this.vargroup.append('g'),
        mg: this.vargroup.append('g')
      }
      if (this.$store.getters.hasCandidates){
        self.generateGraph(this.$store.state.candidate_data, {
          event: "contextmenu",
          callback: self.addCandidate
        }, self.group2);
      }else{
        axios.get('/extra_candidates').then(res => {
          self.$store.state.candidate_data = res.data;
          self.generateGraph(res.data, {
            event: "contextmenu",
            callback: self.addCandidate
          }, self.group2);
        });
      }
    },

    toggleCandidate(event, data){
      if (!this.group2){
        this.drawCandidates();
      }else{
        Object.values(this.group2).forEach(s => s.remove());
        this.group2 = null;
      }
    },

    drawGraph(relations, groups){
      let self = this;
      relations.forEach(relation => {
        if (relation.type === 1){
          self.drawRelation(relation, groups);
        }else if (relation.type === 2){
          self.generateRelation(relation, groups);
        }
      })
    },

    generateGraph(relations, listener, groups, notZoom){
      let cnt = 0, relCnt = 0; //新增圆数量
      let currentAngle = 0, angleDelta;
      let self = this, highlights = [], funcCircleId = 0;
      relations.forEach(relation => cnt += (relation.type - 1));
      angleDelta = 360 / cnt;

      let x = 0, y = 0, r = 0;

      this.circles.style("display", "inline");
      this.labels.style("display", "inline");
      this.labels.style("font-size", "50%");

      relations.forEach(relation => {
        if (relation.type === 2){
          relation.direction = currentAngle;
          relation.distance = 20;
          relation.radius = 20;
          relation.width = 2;
          self.defs.append("pattern")
            .attr("id", "icon" + relation.v2)
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("image")
            .attr("xlink:href", "/static/image/student_" + relation.v2 + ".png")
            .attr("width", 1)
            .attr("height", 1);
          relation.fill = "url(#icon" + relation.v2 + ")";
          relation.stroke = "#ffffff";
          relation.strokeWidth = 1;
          relation.listener = listener;

          currentAngle += angleDelta;
          funcCircleId = relation.v1;

          relation.onclick = onclick;

          self.circles.filter(d => d.id === relation.v1)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", "2");
        }else{
          highlights.push(relation.v1);
          let c = self.circles.filter(d => d.id === relation.v1);
          x += c.datum().x;
          y += c.datum().y;
          relCnt++;

          relation.text = "获得";

          self.circles.filter(d => d.parent && d.parent.id === relation.v1).style("display", "none");
          self.labels.filter(d => d.parent && d.parent.id === relation.v1).style("display", "none");
        }
      });
      highlights.push(funcCircleId);

      if (relCnt !== 0 && !notZoom) {
        x = x / relCnt;
        y = y / relCnt;
        r = this.focus.r * 8;
        this.focus = {
          x: x,
          y: y,
          r: r
        };
        this.specialZoom(this.drawGraph, relations, groups);3
        this.circles.style("opacity", d => highlights.indexOf(d.id) < 0 ? 0.05 : 1)
        this.labels.style("opacity", d => highlights.indexOf(d.id) < 0 ? 0.05 : 1);
      }else{
        this.drawGraph(relations, groups);
      }
    },

    //聚焦到点击的园
    zoomTo(v) {
      const k = this.width / v[2];
      this.view = v;
      this.labels.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      this.circles.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      this.circles.attr("r", (d) => d.r * k);
    },

    specialZoom(callback, arg1, arg2){
      let self = this;
      const transition = this.svg
        .transition()
        .duration(750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(this.view, [
            self.focus.x,
            self.focus.y,
            self.focus.r * 2.4,
          ]);
          return (t) => this.zoomTo(i(t));
        })
        .on("end", function () {
          if (callback){
            callback(arg1, arg2);
          }
        });

      this.labels
        .transition(transition);
    },

    initDefs(){
      this.defs.append("pattern")
        .attr('id', 'true')
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("xlink:href", "/static/icon/true.png")
        .attr("width", 1)
        .attr("height", 1);

      this.defs.append("pattern")
        .attr('id', 'false')
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("image")
        .attr("xlink:href", "/static/icon/false.png")
        .attr("width", 1)
        .attr("height", 1);

      let f = this.defs.append('filter')
        .attr('id', 'redify');
      f.append('feColorMatrix')
        .attr('type', 'matrix')
        .attr('values', '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0')
    },

    //文本的显示与隐藏
    zoom(event, callback, arg) {
      let self = this;
      const transition = this.svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(this.view, [
            self.focus.x,
            self.focus.y,
            self.focus.r * 2.4,
          ]);
          return (t) => this.zoomTo(i(t));
        })
        .on("end", function () {
          let focus_label = self.labels.filter(d => d === self.focus);
          if (focus_label.datum().children && focus_label.datum().children.length === 2) {
            focus_label.transition().duration(500).attr("transform", (d) => `translate(0,-150)`);
          } else if (focus_label.datum().children && focus_label.datum().children.length === 1) {
            focus_label.transition().duration(500).attr("transform", (d) => `translate(0,-120)`)
          };

          if (callback){
            callback(arg);
          }
        });
      this.labels
        .transition(transition)
        // .style("fill-opacity", d => d.parent === self.focus || d === self.focus ? 1 : 0)
        .style("font-size", d => (d === self.focus ? "25px" : "10px"))
        .style('display', d => d.parent === self.focus || d === self.focus ? 'inline' : 'none')
    },

    getPath(hierarchy) {
      let path = [];
      while (hierarchy) {
        path.unshift(hierarchy.data.name);
        hierarchy = hierarchy.parent;
      }
      return path;
    },

    //绘制圆堆积图
    drawCirclePack: function (data) {
      let self = this;

      //整个svg的平移缩放
      function zoomed(event) {
        circle_pack_group.attr("transform", event.transform);
      }

      const root = this.pack(data); //根节点
      let circle_pack_group = this.cpgroup = this.svg.append('g').attr('id', 'circle-pack-group');

      //设置视窗
      this.svg
        .attr("viewBox", `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("cursor", "pointer")
        .attr("height", this.svg_height)
        .attr("width", this.svg_height)
        .on("click", (event) => {
          console.log("Clicked: ", event.x, event.y);
        });

      this.circle_group = circle_pack_group
        .append("g")
        .attr("id", "circles")
        .on("click", (event) => console.log("Clicked: ", event.x, event.y));

      //画圆
      let circles = this.circles = this.circle_group
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("fill", (d) => this.color[d.depth])
        // .attr("pointer-events", (d) => (!d.children ? "none" : null))
        .on("click", function (event, data) {
          //移除上一次选中的圆的高亮
          if (self.focus_selection) {
            self.focus_selection.attr("stroke", null);
          }

          if (data.data.name === "候选学生"){
            self.funcId = data.id;
            self.drawStudents();
            return;
          }

          if (self.state === "fun"){
            if (data.id === 197){
              self.toggleCandidate();
            }
            return;
          }

          if (data !== self.focus) {
            self.focus = data;
            circles.style("display", (d) =>
              d.depth <= self.focus.depth ||
              (d.depth === self.focus.depth + 1 && d.parent === self.focus)
                ? "inline"
                : "none"
            );

            self.focus_selection = d3.select(this)
              .attr("stroke-width", 3)
              .attr("stroke", "#ffffff");
            ;
          }
          if (self.setFocus) {
            self.setFocus(self.getPath(data));
          }
          self.zoom(event);
          console.log(data.data.name + ":" + data.id);
        });


      this.svg.call(d3.zoom().scaleExtent([0.01, 100]).on("zoom", zoomed));

      //显示文本
      this.labels = circle_pack_group
        .append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr('fill', 'white')
        .text((d) => d.data.name);

      this.defs = circle_pack_group.append("defs");
      this.vargroup = circle_pack_group.append('g');

      this.initDefs();

      //首次聚焦
      switch (this.display_theme) {
        case "0":
          this.zoomTo([root.x, root.y, root.r * 2.2]);

          this.labels.filter(d => d === this.focus).style('font-size', '25px');
          this.labels.style("display", d => d.parent === root || d === root ? 'inline' : 'none')
            .style("font-size", d => d.parent === root ? this.children_font_size : this.root_font_size);
          this.svg.on("click", function (event) {
            self.$router.push({
              name: 'detail'
            })
          });
          this.circles.on("click", null);
          break;
        case "1":
          this.zoomTo([root.x, root.y, root.r * 2.4]);
          this.focus = root;
          this.focus_selection = circles.filter((d) => d.depth === 0)
            .attr("stroke-width", 3)
            .attr("stroke", "#ffffff");
          this.circles.style("display", (d) =>
            d.depth <= this.focus.depth + 1
              ? "inline"
              : "none"
          );
          this.labels.filter(d => d === this.focus).style('font-size', '25px');
          this.labels.style("display", d => d.parent === root || d === root ? 'inline' : 'none');
          break;
        case "2":
          this.zoomTo([root.x, root.y, root.r * 2.4]);
          this.jumpTo(this.first_focus);
          break;
      }
    }
    ,
    jumpTo(name) {
      let selected = this.circles.filter(d => d.data.name === name).datum();
      let path = this.getPath(selected);
      this.setFocus(path);

      if (this.focus_selection) {
        this.focus_selection.attr('stroke', 'none');
      }
      this.focus_selection = this.circles.filter(d => d.data.name === name)
        .attr("stroke-width", 3)
        .attr("stroke", "#ffffff");
      this.focus = this.focus_selection.datum();

      this.circles.style("display", (d) =>
        d.depth <= this.focus.depth ||
        (d.depth === this.focus.depth + 1 && d.parent === this.focus)
          ? "inline"
          : "none"
      );
      this.zoom({})
    },
    locate() {
      this.svg.select("#circle-pack-group").attr('transform', d3.zoomIdentity);
    }
  },
  mounted() {
    this.svg = d3.select('#circle-pack-svg');
    Object.assign(this.$props, this.$route.params);
    let data_url = '/circle_pack_data';
    if(this.$store.getters.dataInited){
      this.drawCirclePack(this.$store.state.circle_pack_data);
    }else {
      axios.get(data_url)
        .then(res => {
          this.$store.commit('setData', res.data);
          this.drawCirclePack(this.$store.state.circle_pack_data);
        })
        .catch(e => console.log(e));
    }
  }
}
;
</script>

<style scoped>
</style>>
