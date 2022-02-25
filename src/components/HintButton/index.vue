<template>
  <a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
}
</script>

<style>
</style>
