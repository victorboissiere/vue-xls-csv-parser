<template>
  <div class="xls-csv-parser">
    <parse-file @fileDataReceived="fileDataReceived"></parse-file>
    <column-chooser v-if="showColumnChooser"
      :userColumns="userColumns"
      :requiredColumns="requiredColumns"
      :optionalColumns="optionalColumns"
      @onValidate="onValidate"
    ></column-chooser>
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
        this.userColumns = fileData;
        this.showColumnChooser = true;
      },
      onValidate(result) {
        console.log('reuslt', result);
      },
    },
    data() {
      return {
        showColumnChooser: false,
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
