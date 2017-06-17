<template>
  <div class="xls-csv-parser">
    <parse-file @fileDataReceived="fileDataReceived"></parse-file>
    <column-chooser v-if="showColumnChooser"
      :userColumns="userColumns"
      :columns="columns"
      @onValidate="onValidate"
    ></column-chooser>
    <div class="parser-hidden-columns-input" v-for="(result, i) in results">
      <input type="hidden" :name="`column[${i}]`" :value="result.column">
      <input type="hidden" v-for="(data, j) in result.data" :name="`data[${i}][${j}]`" :value="data">
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import ColumnChooser from './ColumnChooser';
  import ParseFile from './ParseFile';

  export default {
    name: 'XlsCsvParser',
    components: { ColumnChooser, ParseFile },
    props: {
      // TODO: test and refactor
      columns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'value')),
      },
    },
    methods: {
      fileDataReceived(fileData) {
        this.results = [];
        if (fileData.length < this.columns.length) {
          // TODO: display list of required columns in alert box
          alert(`You do not have enough columns. Required : ${this.columns.join(', ')}`); // eslint-disable-line
          return;
        }
        this.userColumns = fileData;
        this.showColumnChooser = true;
      },
      onValidate(results) {
        this.results = results;
        this.$emit('onValidate', results);
      },
    },
    data() {
      return {
        showColumnChooser: false,
        showHiddenInputs: false,
        results: [],
        userColumns: [],
      };
    },
  };
</script>
