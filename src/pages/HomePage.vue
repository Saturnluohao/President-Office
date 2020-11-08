<template>
  <div id="homepage">
    <Row>
      <i-col span="6">
        <HomeSide v-if="state === 'home_side'" :setState="setState"></HomeSide>
        <NewDecision v-else :setState="setState"></NewDecision>
      </i-col>
      <i-col span="18">
        <div id="homepage-map">
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CirclePack from "../components/CirclePack";
import NewDecision from "../components/NewDecision";
import HomeSide from "../components/HomeSide";

export default {
  name: "HomePage",
  components: {HomeSide, NewDecision, CirclePack},
  data() {
    return {
      state: "home_side"
    }
  },
  methods: {
    setState(state){
      this.state = state;
    }
  }
}
</script>

<style>
#homepage {
  background: rgb(41, 41, 47);
  height: 100%;
}

#homepage .ivu-col, .ivu-row{
  height: 100%;
}
</style>
