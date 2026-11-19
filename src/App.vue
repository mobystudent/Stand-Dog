<template>
  <div class="container-wrapper">
    <GlobalHeader />
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import GlobalHeader from './components/GlobalHeader.vue'
export default {
  components: { GlobalHeader }
}
</script>

<style lang="scss">
.container-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.container {
  position: relative;
  flex: 1 1 auto;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    min-height: 584px;
    background: url('/static/img/bg.png') bottom/cover no-repeat;
    z-index: -1;
  }
}
</style>
