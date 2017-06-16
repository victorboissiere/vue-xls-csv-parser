<template>
  <div class="xls-csv-parser">
    <parse-file></parse-file>
    <catalog-column-chooser
      :userColumns="userColumns"
      :requiredColumns="requiredColumns"
      :optionalColumns="optionalColumns"
    ></catalog-column-chooser>
  </div>
</template>

<script>
  import CatalogColumnChooser from './ColumnChooser';
  import ParseFile from './ParseFile';

  export default {
    name: 'XlsCsvParser',
    components: { CatalogColumnChooser, ParseFile },
    data() {
      return {
        userColumns: [
          { name: 'column1', data: ['row1', 'row2'] },
          { name: 'column2', data: ['row1', 'row2'] },
        ],
        requiredColumns: [
          {
            name: 'Required name',
            value: 'name',
          },
          {
            name: 'Required Description',
            value: 'name',
          },
        ],
        optionalColumns: [
          { name: 'other', value: 'other' },
        ],
      };
    },
  };
</script>
