<template>
  <div id="report">
    <div id="reports1" :style="{ width: '1200px', height: '600px' }"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash"; //深拷贝
import { data_list } from "./../assets/js/request";
export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  components: {},
  mounted() {
    this.$store.commit("modify_nov", "数据统计");
    this.$store.commit("modify_nov_son", "数据报表");
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("reports1"));
    data_list().then((res) => {
      const result = _.merge(res.data, this.options);
      myChart.setOption(result);
    });
    let option = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };
    myChart.setOption(option);
  },
};
</script>

<style scoped lang="less">
</style>
