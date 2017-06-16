<template>
  <div class="xls-csv-parser">
    <parse-file @fileDataReceived="fileDataReceived"></parse-file>
    <column-chooser v-if="showColumnChooser"
      :userColumns="userColumns"
      :requiredColumns="requiredColumns"
      :optionalColumns="optionalColumns"
      @onValidate="onValidate"
    ></column-chooser>
    <div class="parser-hidden-columns-input" v-for="(result, i) in results">
      <input type="hidden" :name="`column[${i}]`" :value="result.column">
      <input type="hidden" v-for="(data, j) in result.data" :name="`data[${i}][${j}]`" :value="data">
    </div>
  </div>
</template>

<script>
  import ColumnChooser from './ColumnChooser';
  import ParseFile from './ParseFile';

  export default {
    name: 'XlsCsvParser',
    components: { ColumnChooser, ParseFile },
    methods: {
      fileDataReceived(fileData) {
        this.results = [];
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
        requiredColumns: [
          {
            name: 'Required name',
            value: 'name',
          },
          {
            name: 'Required Description',
            value: 'description',
          },
        ],
        optionalColumns: [
          { name: 'other', value: 'other' },
        ],
      };
    },
  };
</script>
