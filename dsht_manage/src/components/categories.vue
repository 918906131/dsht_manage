<template>
  <div>
    <h1>categories</h1>
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
    this.$store.commit("modify_nov", "商品管理");
    this.$store.commit("modify_nov_son", "商品分类");
  },
};
</script>

<style scoped lang="less">
</style>
