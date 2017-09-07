<template>
  <div class="xls-csv-parser">
    <parse-file @fileDataReceived="fileDataReceived" :help="help"></parse-file>
    <br><br>
    <column-chooser
      v-if="showColumnChooser"
      ref="columnChooser"
      :userColumns="userColumns"
      :columns="columns"
      :showValidateButton="showValidateButton"
      @onValidate="onValidate"
    ></column-chooser>
    <div class="parser-hidden-columns-input" v-for="(result, i) in results">
      <input type="hidden" v-for="(data, i) in result.data" :name="`${result.column}[${i}]`" :value="data">
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
      columns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'value')),
      },
      validateButtonId: {
        type: String,
        default: () => null,
      },
      help: {
        type: String,
      },
    },
    methods: {
      fileDataReceived(fileData) {
        this.results = [];
        const requiredColumns = this.columns.filter(column => !column.isOptional);
        if (fileData.length < requiredColumns.length) {
          // TODO: display list of required columns in alert box
          alert(`You do not have enough columns. Required columns are : ${this.columns.map(column => column.name).join(', ')}`); // eslint-disable-line
          return;
        }
        this.userColumns = fileData;
        this.showColumnChooser = true;
      },
      onValidate(results) {
        this.results = results;
        this.$emit('onValidate', results);
      },
      validate(event) {
        event.preventDefault();
        if (!this.showColumnChooser) {
          // TODO: alert box
          alert('You need to select a file'); // eslint-disable-line
        } else {
          this.$refs.columnChooser.validate();
        }
      },
    },
    mounted() {
      if (this.validateButtonId) {
        this.showValidateButton = false;
        document.getElementById(this.validateButtonId).addEventListener('click', this.validate);
      }
    },
    data() {
      return {
        showColumnChooser: false,
        showHiddenInputs: false,
        showValidateButton: true,
        results: [],
        userColumns: [],
      };
    },
  };
</script>
