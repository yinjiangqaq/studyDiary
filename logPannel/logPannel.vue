<template>
  <!-- 用的样式框架是antd-v -->
  <div>
    <div
      style="
        width: 100%;
        height: 380px;
        padding: 10px;
        overflow-y: auto;
        background-color: black;
        margin-left: 5px;
        scroll-behavior: smooth;
      "
      id="logPanel"
    >
      <a-tooltip placement="left" title="回到顶部">
        <a-icon
          type="up-circle"
          theme="filled"
          class="up-to-top"
          :style="{ fontSize: '30px', color: '#e6f7ffde' }"
          @click="backToTop"
        />
      </a-tooltip>
      <a-tooltip placement="left" title="停止滚动">
        <a-icon
          type="pause-circle"
          theme="filled"
          v-show="!stop"
          class="up-to-top-2"
          :style="{ fontSize: '30px', color: '#e6f7ffde' }"
          @click="stopScroll"
        />
      </a-tooltip>
      <a-tooltip placement="left" title="启动滚动">
        <a-icon
          type="right-circle"
          theme="filled"
          v-show="stop"
          class="up-to-top-2"
          :style="{ fontSize: '30px', color: '#e6f7ffde' }"
          @click="stopScroll"
        />
      </a-tooltip>
      <p
        v-for="(item, index) of log"
        :key="item + index"
        style="
          font-size: 13px;
          font-family: monospace;
          word-break: break-all;
          white-space: pre-wrap;
          word-wrap: break-word;
          margin-bottom: 5px;
        "
        v-html="item.replace(/\n|\r/g)"
        :style="{
          color:
            item.indexOf('[ERROR]') !== -1
              ? 'red'
              : item.indexOf('[WARN]') !== -1
              ? 'yellow'
              : item.indexOf('[DEBUG]') !== -1
              ? 'green'
              : 'white',
        }"
      ></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "logPannel",
  props: {
    log: {
      type: Array,
      default: () => {
        return [];
      },
    },
    level: {
      type: Number,
    },
  },
  data() {
    return {
      stop: false,
    };
  },
  watch: {
    log: {
      deep: true,
      async handler(newVal, oldVal) {
        if (newVal.length > oldVal.length && !this.stop) {
          //console.log(document.getElementById('logPanel').scrollHeight);
          document.getElementById(
            "logPanel"
          ).scrollTop = await document.getElementById("logPanel").scrollHeight;
        } else {
          console.log("不滚动");
        }
      },
    },
  },
  methods: {
    backToTop() {
      //有了css scroll-behavior事件中之后，直接一句话解决，不用定时器了
      document.getElementById("logPanel").scrollTop = 0;
      //let timer = this.timer;
      // cancelAnimationFrame(timer);
      // timer = requestAnimationFrame(function fn() {
      // let logPanel = document.getElementById('logPanel');
      // var oTop = document.getElementById('logPanel').scrollTop;
      // console.log(oTop);
      // if (oTop > 0) {
      // 	logPanel.scrollTop -= 500;
      // 	timer = requestAnimationFrame(fn);
      // } else {
      // 	cancelAnimationFrame(timer);
      // }
      // });
    },
    stopScroll() {
      if (this.stop === false) this.stop = true;
      else this.stop = false;
    },
  },
};
</script>

<style>
.up-to-top {
  position: absolute;
  right: 40px;
  bottom: 30px;
}
.up-to-top-2 {
  position: absolute;
  right: 40px;
  bottom: 70px;
}
</style>
