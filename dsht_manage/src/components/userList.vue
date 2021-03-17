<template>
  <div>
    <h1>userList</h1>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
  mounted() {
    this.$store.commit("modify_nov", "用户管理");
    this.$store.commit("modify_nov_son", "用户列表");
  },
};
</script>

<style scoped lang="less">
</style>
