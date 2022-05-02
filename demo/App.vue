<template>
  <div class="box">
    <hello-world v-drag="{limit: 1, classList:['draging'], dragArea:'parent'}"/>
    <hello-world v-drag="{limit: 1, classList:['draging'], dragArea:'parent'}"/>
    <hello-world v-drag="{limit: 1, classList:['draging']}"/>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from './src/HelloWorld.vue'
import { vDrag } from '../src/directives/vue-drag-directive'
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
.box{
  width: 700px;
  height: 500px;
  border: solid black 20px;
  position: absolute;
  margin: 0 auto;
  left: 50px;
}
.draging{
  opacity: 0.5;
  cursor: grab;
}
</style>
