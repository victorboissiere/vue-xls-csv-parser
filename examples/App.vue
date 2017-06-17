<template>
  <div class="app">
    Example
    <br>
    <xls-csv-parser></xls-csv-parser>
  </div>
</template>

<script>
  import XlsCsvParser from '../src/index';

  export default {
    name: 'App',
    components: {
      XlsCsvParser,
    },
    data() {
      return {
      };
    },
  };
</script>
