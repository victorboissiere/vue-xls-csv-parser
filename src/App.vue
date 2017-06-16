<template>
  <div id="app">
    <xls-csv-parser></xls-csv-parser>
  </div>
</template>

<script>
import XlsCsvParser from './components/XlsCsvParser';

export default {
  name: 'app',
  components: {
    XlsCsvParser,
  },
};
</script>
