 
<template>
    
  <div v-if="col.type == 'select'" :key="col.name">
        <a-select style="width: 200px" :value="text" @change="handleSelect">
            <a-select-option
        v-for="item in map"
        :value="item.id"
        :key="item.id"
        >{{ item.name }}</a-select-option
      >
          </a-select
    >
      
  </div>

    
  <div v-else-if="col.type == 'input'" :key="col.name">
        <a-input style="margin: -5px 0" :value="text" @change="handleInput" />
      
  </div>
</template>
<script>
export default {
  name: "selectKey",
  props: {
    map: {
      type: Array,
      default: () => {
        return [];
      },
    },
    col: {
      type: Object,
      default: () => {
        return { id: "", name: "" };
      },
    },
    text: {
      type: String,
      default: " ",
    },
  },
  data() {
    return {};
  },
  methods: {
    handleSelect(e) {
      console.log(e);
      this.$emit("getVal", e);
    },
    handleInput(e) {
      // const newData = [...this.data];
      // const target = newData.filter(item => key === item.key)[0];
      // if (target) {
      //   target[column] = value;
      //   this.data = newData;
      // }
      //this.data[index][column] = value
      this.$emit("getVal", e.target.value);
    },
  },
};
</script>
