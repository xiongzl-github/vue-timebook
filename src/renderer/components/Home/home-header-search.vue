<!--  -->
<template>
  <div class="home-header-search">
    <Input v-model="searchValue">
        <Button slot="append" icon="ios-search"></Button>
    </Input>
  </div>

</template>

<script>
export default {
  data() {
    return {
      searchValue: ""
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang='less' scoped>

</style>