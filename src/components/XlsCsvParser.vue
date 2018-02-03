<template>
  <div class="xls-csv-parser">
    <parse-file @fileDataReceived="fileDataReceived" :help="help" ref="parseFile" :lang="lang"></parse-file>
    <br><br>
    <column-chooser
      v-if="showColumnChooser"
      ref="columnChooser"
      :userColumns="userColumns"
      :columns="columns"
      :showValidateButton="showValidateButton"
      :lang="lang"
      @on-validate="onValidate"
    ></column-chooser>
    <div class="parser-hidden-columns-input" v-for="(result, i) in results">
      <input type="hidden" v-for="(data, i) in result.data" :name="`${result.column}[${i}]`" :value="data">
    </div>
    <simplert
      :useRadius="true"
      :useIcon="true"
      ref="simplert">
    </simplert>
  </div>
</template>

<script>
  import _ from 'lodash';
  import Simplert from 'vue2-simplert';
  import ColumnChooser from './ColumnChooser';
  import ParseFile from './ParseFile';
  import text from '../lang';

  export default {
    name: 'XlsCsvParser',
    components: { ColumnChooser, ParseFile, Simplert },
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
      lang: {
        type: String,
        validator: language => ['en', 'fr'].indexOf(language) !== -1,
        default: () => 'en',
      },
    },
    methods: {
      fileDataReceived(fileData) {
        this.results = [];
        const requiredColumns = this.columns.filter(column => !column.isOptional);
        if (fileData.length < requiredColumns.length) {
          const message = `${text[this.lang].error.columnNumber}<br> ${this.columns.map(column => column.name).join('<br> ')}`;
          this.showError(message);
          return;
        }
        this.userColumns = fileData;
        this.showColumnChooser = true;
      },
      onValidate(results) {
        this.results = results;
        this.$emit('on-validate', results);
      },
      validate(event) {
        event.preventDefault();
        if (!this.showColumnChooser) {
          this.showError(text[this.lang].error.fileNumber);
        } else {
          this.$refs.columnChooser.validate();
        }
      },
      showError(message) {
        this.$refs.simplert.openSimplert({
          title: text[this.lang].error.title,
          message,
          type: 'error',
          customCloseBtnText: text[this.lang].close,
          onClose: () => {
            this.$refs.parseFile.reset();
          },
        });
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

