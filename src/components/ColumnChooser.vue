<template>
  <div class="catalog-column-chooser">
    <a href="#" class="header-tool" @click="toggleHeaders">
      {{ withHeaders ? 'This file does not include headers' : 'This file includes headers' }}
    </a>
    <br><br>
    <div v-for="(column, index) in localUserColumns">
      <div class="row">
        <div class="col-md-6">
          <div class="panel panel-success" :class="{ 'panel-success': column.selection, 'panel-danger': !column.selection }">
            <div class="panel-heading">
              <p v-if="column.selection">{{ column.selection.name }}</p>
              <p v-else>Choisir une colonne</p>
            </div>
            <div class="panel-body">
              <multiselect
                :id="index"
                v-model="column.selection"
                deselect-label=""
                selected-label="Selected"
                select-label="Select"
                track-by="name"
                label="name"
                placeholder="Please choose a column"
                :options="column.options"
                :searchable="false"
                :allow-empty="false"
                @select="onSelectChange"
              ></multiselect>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="panel panel-primary">
            <div class="panel-heading">
              Data for column <i>"{{ column.name }}"</i>
            </div>
            <div class="panel-body">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th class="text-center">{{ column.name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="data in column.displayedData">
                      <td>{{ data }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right" v-if="showValidateButton">
      <button @click="validate" id="validate-columns" class="btn btn-primary">Submit</button>
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import _ from 'lodash';

  export default {
    name: 'ColumnChooser',
    components: { Multiselect },
    props: {
      // TODO: refactor and test
      userColumns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'data')),
      },
      columns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'value')),
      },
      showValidateButton: {
        type: Boolean,
        default: () => true,
      },
    },
    watch: {
      userColumns(newColumns) {
        this.fillLocalUserColumns(newColumns);
      },
    },
    methods: {
      onSelectChange({ value: selectedValue }, id) { // eslint-disable-line
        if (this.optionalValues.indexOf(selectedValue) !== -1) return;

        _.forEach(this.localUserColumns, (column, index) => {
          if (index !== id) {
            const hasSelectionConflict = column.selection && column.selection.value === selectedValue;
            if (hasSelectionConflict) {
              column.selection = null; // eslint-disable-line
            }
          }
        });
      },
      validate() {
        const hasMadeAllSelections = this.localUserColumns.every(column => column.selection !== null);
        if (!hasMadeAllSelections) {
          alert('You need to select all columns'); // eslint-disable-line
        } else {
          const selectedRequiredValues = _
            .map(this.localUserColumns, 'selection.value')
            .filter(value => this.requiredValues.indexOf(value) !== -1);

          const missingValues = _.difference(this.requiredValues, selectedRequiredValues);
          if (missingValues.length > 0) {
            alert(`Missing required columns: ${missingValues.join(', ')}`); // eslint-disable-line
            return;
          }

          this.results = this.localUserColumns.map(localColumn => ({
            column: localColumn.selection.value,
            data: localColumn.data,
          }));
          this.$emit('onValidate', this.results);
        }
      },
      fillLocalUserColumns(newColumns) {
        this.localUserColumns = newColumns.map(column => ({
          name: column.name,
          displayedData: _.take(column.data, 4),
          data: column.data,
          options: _.clone(this.columns),
          selection: null,
        }));
      },
      toggleHeaders() {
        if (this.withHeaders) {
          this.localUserColumns.forEach((column, index) => {
            const data = [column.name].concat(column.data);
            column.name = `Column${index + 1}`; // eslint-disable-line
            column.data = data; // eslint-disable-line
            column.displayedData = _.take(column.data, 4); // eslint-disable-line
          });
        } else {
          this.localUserColumns.forEach((column) => {
            column.name = column.data.shift(); // eslint-disable-line
            column.displayedData = _.take(column.data, 4); // eslint-disable-line
          });
        }
        this.withHeaders = !this.withHeaders;
      },
    },
    data() {
      return {
        withHeaders: true,
        localUserColumns: [],
        requiredValues: [],
        optionalValues: [],
        results: [],
      };
    },
    mounted() {
      this.fillLocalUserColumns(this.userColumns);
      this.optionalValues = this.columns
        .filter(column => column.isOptional)
        .map(column => column.value);
      this.requiredValues = this.columns
        .filter(column => !column.isOptional)
        .map(column => column.value);
    },
  };
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
