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
    svg_height: Number,
    display_theme: String,
    root_font_size: Number,
    children_font_size: Number
  },
  data() {
    return {
      circle_group: Object,
      line_group: Object,
      relations: Map
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
        let cr = (sr * sin_value) / (1 + sin_value);
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

    //绘制圆堆积图
    drawCirclePack: function (svg, data) {
      let self = this;

      //聚焦到点击的园
      function zoomTo(v) {
        const k = self.width / v[2];
        view = v;
        label.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        circles.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        circles.attr("r", (d) => d.r * k);
      }

      //文本的显示与隐藏
      function zoom(event) {
        const transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", () => {
            const i = d3.interpolateZoom(view, [
              focus.x,
              focus.y,
              focus.r * 2.2,
            ]);
            return (t) => zoomTo(i(t));
          });
        label
          .transition(transition)
          .style("fill-opacity", (d) =>
            d.parent === focus || d === focus ? 1 : 0
          )
          .style("font-size", (d) => (d === focus ? "25px" : "10px"))
          .style('display', d => d.parent === focus || d === focus ? 'inline' : 'none')
      }

      //整个svg的平移缩放
      function zoomed(event) {
        circle_pack_group.attr("transform", event.transform);
      }

      const root = this.pack(data); //根节点
      let focus = root;  //当前聚焦节点
      let focus_selection;  //当前聚焦的圆
      let circle_pack_group = svg.append('g').attr('id', 'circle-pack-group');
      let color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
      let view;

      //设置视窗
      svg
        .attr("viewBox", `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("cursor", "pointer")
        .attr("height", this.svg_height)
        .on("click", (event) => {
          console.log("Clicked: ", event.x, event.y);
          // focus = root;
          // focus_selection = circles.filter(d => d.depth === 0);
          // zoom(event);
        });

      this.circle_group = circle_pack_group
        .append("g")
        .attr("id", "circles")
        .on("click", (event) => console.log("Clicked: ", event.x, event.y));
      this.line_group = circle_pack_group.append("g").attr("id", "lines");

      //画圆
      let circles = this.circle_group
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
        .attr("pointer-events", (d) => (!d.children ? "none" : null))
        .on("click", function (event, data) {
          if (data !== focus) {
            focus = data;
            circles.style("display", (d) =>
              d.depth < focus.depth ||
              d.depth === focus.depth ||
              (d.depth === focus.depth + 1 && d.parent === focus)
                ? "inline"
                : "none"
            );

            //高亮选中的圆
            let self = d3.select(this);
            self.attr("stroke-width", 3);
            self.attr("stroke", "#ffffff");

            //移除上一次选中的圆的高亮
            if (focus_selection) {
              focus_selection.attr("stroke", null);
            }
            focus_selection = self;
          }
          return (zoom(event), event.stopPropagation());
        });


      svg.call(d3.zoom().scaleExtent([0.5, 10]).on("zoom", zoomed));

      //显示文本
      const label = circle_pack_group
        .append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .text((d) => d.data.name);

      //首次聚焦
      switch (this.display_theme) {
        case "0":
          zoomTo([root.x, root.y, root.r * 2.2]);

          label.filter(d => d === focus).style('font-size', '25px');
          label.style("display", d => d.parent === root || d === root ? 'inline' : 'none');
          label.style("font-size", d => d.parent === root ? this.children_font_size : this.root_font_size);
          break;
        case "1":
          zoomTo([root.x, root.y, root.r * 2.2]);
          focus = root;
          focus_selection = circles.filter((d) => d.depth === 0);
          focus_selection.attr("stroke-width", 3);
          focus_selection.attr("stroke", "#ffffff");
          circles.style("display", (d) =>
            d.depth <= focus.depth + 1
              ? "inline"
              : "none"
          );
          label.filter(d => d === focus).style('font-size', '25px');
          label.style("display", (d) => (d.parent === root || d === root ? 'inline' : 'none'))
          break;
        case "2":
          let should_focus = circles.filter(d => d.data.name === this.first_focus);
          let should_focus_data = should_focus.datum();
          zoomTo([should_focus_data.x, should_focus_data.y, should_focus_data.r * 2.2]);
          focus = should_focus_data;
          focus_selection = should_focus;

          circles.style("display", (d) =>
            d.depth <= focus.depth ||
            (d.depth === focus.depth + 1 && d.parent === focus)
              ? "inline"
              : "none"
          );
          //高亮选中的圆
          should_focus.attr("stroke-width", 3);
          should_focus.attr("stroke", "#ffffff");

          zoom({})
          break;
      }
    }
  },
  mounted() {
    let data_url = '/circle_pack_data';
    let svg = d3.select('#circle-pack-svg');
    Object.assign(this.$props, this.$route.params);
    axios.get(data_url)
      .then(res => this.drawCirclePack(svg, res.data))
      .catch(e => console.log(e));
  }
};
</script>

<style scoped>
</style>>
