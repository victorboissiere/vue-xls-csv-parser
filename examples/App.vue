<template>
  <div class="app">
    <h3>Example - Import file with required login, firstname, lastname and optional values</h3>
    <br>
    <xls-csv-parser :columns="columns" @on-validate="onValidate" :help="help" lang="en"></xls-csv-parser>
    <br><br>
    <div class="results" v-if="results">
      <h3>Results:</h3>
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
  import { XlsCsvParser } from '../src/index';

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
        help: 'Necessary columns are: login, firstname and lastname',
      };
    },
  };
</script>
