<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg
        t="1645882143508"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2038"
        data-darkreader-inline-fill=""
        width="16"
        height="16"
      >
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="2039"
          fill="#8a8a8a"
          data-darkreader-inline-fill=""
          style="--darkreader-inline-fill: #938f8a"
        />
      </svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts" />
    </div>
    <dic class="card-footer">
      <slot name="footer" />
    </dic>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
  font-size: 12px;
}
.card-footer {
  border-top: 1px solid #eee;
  font-size: 12px;
  padding-top: 10px;
}
</style>
