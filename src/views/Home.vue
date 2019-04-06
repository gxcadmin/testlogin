<template>
  <div class="home">
    <index />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import index from '@/components/Index/Index.vue';

@Component({
  components: {
    index,
  },
})
export default class Home extends Vue {}
</script>
