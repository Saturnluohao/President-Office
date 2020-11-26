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
    setFocus: Function
  },
  data() {
    return {
      circle_group: Object,
      line_group: Object,
      relations: Map,
      circles: Object,
      labels: Object,
      svg: Object,
      view: Object,
      focus: Object,
      focus_selection: null,
      color: ["#2A427A", "#2D4A88", "#1E3B7A", "#183474", "#132A62", "#091E54", "#091A44", "#000000"]
    };
  },
  methods: {
    pack: function (data) {
      let self = this;

      function construct_circlepack(hierarchy) {
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
        for (let i = 0; i < children_length; i++) {
          hierarchy.children[i].r = cr;
          hierarchy.children[i].x =
            hierarchy.x +
            Math.cos((2 * i * Math.PI) / children_length) * (sr - cr);
          hierarchy.children[i].y =
            hierarchy.y -
            Math.sin((2 * i * Math.PI) / children_length) * (sr - cr);
          construct_circlepack(hierarchy.children[i]);
        }
        return hierarchy;
      }

      return construct_circlepack(d3.hierarchy(data));
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

    //生成关系
    drawRelation: function (c, direction, radius, distance) {
      let transform = this.getTransform(c);
      let x1 = transform.x;
      let y1 = transform.y;
      let r = c.datum().r;

      let x2 =
        Math.cos((direction * Math.PI) / 180) * (r + distance + radius) + x1;
      let y2 =
        -Math.sin((direction * Math.PI) / 180) * (r + distance + radius) + y1;

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

      let new_line = this.line_group
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "red")
        .attr("stroke-width", 2);
      this.circle_group.node().append(c.node());
      let new_circle = this.circle_group
        .append("circle")
        .attr("transform", d3.zoomIdentity.translate(x2, y2))
        .attr("fill", "red")
        .attr("r", radius)
        .call(d3.drag().on("start", dragStarted).on("drag", dragged))
      // .on("end", dragEnded);
      this.relations.set(new_circle, new_line);
    },

    getDepth(json) {
      let depth = 0;

      function traverse(data, self_depth) {
        self_depth += 1;
        depth = self_depth > depth ? self_depth : depth;
        if (data.children) {
          for (let i = 0; i < data.children.length; i++) {
            traverse(data.children[i], self_depth);
          }
        }
      }

      traverse(json, 0);
      return depth;
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

    //文本的显示与隐藏
    zoom(event) {
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
        });
      this.labels
        .transition(transition)
        .style("fill-opacity", d => d.parent === self.focus || d === self.focus ? 1 : 0)
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
      let circle_pack_group = this.svg.append('g').attr('id', 'circle-pack-group');
      // let color = d3.scaleLinear()
      //   .domain([0, this.getDepth(data) - 1])
      //   .range(["rgb(122,134,168)", "rgb(13,26,71)"])
      //   .interpolate(d3.interpolateRgb);

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
      this.line_group = circle_pack_group.append("g").attr("id", "lines");

      //画圆
      let circles = this.circles = this.circle_group
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("fill", (d) => this.color[d.depth])
        .attr("pointer-events", (d) => (!d.children ? "none" : null))
        .on("click", function (event, data) {
          if (data !== self.focus) {
            self.focus = data;
            circles.style("display", (d) =>
              d.depth < self.focus.depth ||
              d.depth === self.focus.depth ||
              (d.depth === self.focus.depth + 1 && d.parent === self.focus)
                ? "inline"
                : "none"
            );

            //移除上一次选中的圆的高亮
            if (self.focus_selection) {
              self.focus_selection.attr("stroke", null);
            }
            self.focus_selection = d3.select(this)
              .attr("stroke-width", 3)
              .attr("stroke", "#ffffff");
            ;
          }
          if (self.setFocus) {
            self.setFocus(self.getPath(data));
          }
          self.zoom(event);
        })
        .on('contextmenu', function (event, d) {
          event.preventDefault();
          let clickedCircle = d3.select(this);
          self.drawRelation(clickedCircle, 60, 50, 10);
        });


      this.svg.call(d3.zoom().scaleExtent([0.5, 10]).on("zoom", zoomed));

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

      //首次聚焦
      switch (this.display_theme) {
        case "0":
          this.zoomTo([root.x, root.y, root.r * 2.2]);

          this.labels.filter(d => d === this.focus).style('font-size', '25px');
          this.labels.style("display", d => d.parent === root || d === root ? 'inline' : 'none')
            .style("font-size", d => d.parent === root ? this.children_font_size : this.root_font_size);
          this.svg.on("click", function(event) {
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
    locate(){
      this.svg.select("#circle-pack-group").attr('transform', d3.zoomIdentity);
    }
  },
  mounted() {
    this.svg = d3.select('#circle-pack-svg');
    Object.assign(this.$props, this.$route.params);
    let data_url = '/circle_pack_data';
    axios.get(data_url)
      .then(res => {
        this.$store.commit('setData', res.data);
        this.drawCirclePack(this.$store.state.circle_pack_data);
      })
      .catch(e => console.log(e));
  }
}
;
</script>

<style scoped>
</style>>
