<template>
  <div id="side-menu">
    <ul id="homepage-decision-list">
      <li>决策事项</li>
      <li v-for="(item,i) in menuItems">{{item}}
        <Icon type="ios-arrow-forward"/>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  data(){
    return {
      menuItems:['2020清华夏令营选拔', '市三好学生选拔', '2020清华夏令营选拔', '2020清华夏令营选拔', '2020清华夏令营选拔']
    }
  }
}
</script>

<style scoped>
#homepage-decision-list {
  list-style: none;
  width: 60%;
  margin-left: 20%;
}

#homepage-decision-list li {
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  text-align: left;
  color: white;
  background: rgb(55, 55, 62)
}

#homepage-decision-list li:first-child {
  padding-left: 0;
  border: none;
  background: rgb(41, 41, 47);
  font-size: 150%;
}

#homepage-decision-list i {
  float: right;
}
</style>
