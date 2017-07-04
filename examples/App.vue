<template>
  <div class="app">
    Example
    <br>
    <xls-csv-parser :columns="columns" validateButtonId="validate" @onValidate="onValidate"></xls-csv-parser>
    <a href="https://gitcommit.fr" id="validate">Validate</a>
    <br><br>
    <div class="results" v-if="results">
      <h3>Results:</h3>
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
  import XlsCsvParser from '../src/index';

  export default {
    name: 'App',
    components: {
      XlsCsvParser,
    },
    methods: {
      onValidate(results) {
        this.results = results;
      },
    },
    data() {
      return {
        columns: [
          { name: 'Student login', value: 'login' },
          { name: 'Student firstname', value: 'firstname' },
          { name: 'Student lastname', value: 'lastname' },
          { name: 'Other', value: 'other', isOptional: true },
        ],
        results: null,
      };
    },
  };
</script>
