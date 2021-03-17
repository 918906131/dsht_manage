<template>
  <div id="app" class="">
    <div :class="{ shadow: this.$store.state.shadow_active }"></div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {
      state: "",
    };
  },
};
</script>
<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.shadow {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>
