<template>
  <div class="catalog-column-chooser">
    <div v-for="(column, index) in localColumns">
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
                selected-label="Selectionné"
                select-label="Selectionner"
                track-by="name"
                label="name"
                placeholder="Veuillez choisir une colonne"
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
              Donneés pour la colonne <i>"{{ column.name }}"</i>
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
    <div class="column-validation">
      <a href="#" @click="validate">Validate</a>
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
      userColumns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'data')),
      },
      requiredColumns: {
        type: Array,
        required: true,
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'value')),
      },
      // TODO: do not forget to test
      optionalColumns: {
        type: Array,
        default: () => [],
        // TODO: refactor
        validator: columns => columns.every(column => _.has(column, 'name') && _.has(column, 'value')),
      },
    },
    watch: {
      userColumns(newColumns) {
        this.fillLocalColumns(newColumns);
      },
    },
    methods: {
      isSelectedValueOptional(selectedValue) {
        return _.find(this.optionalColumns, column => column.value === selectedValue) !== undefined;
      },
      onSelectChange({ value: selectedValue }, id) { // eslint-disable-line
        if (this.isSelectedValueOptional(selectedValue)) return;

        _.forEach(this.localColumns, (column, index) => {
          if (index !== id) {
            const hasSelectionConflict = column.selection && column.selection.value === selectedValue;
            if (hasSelectionConflict) {
              column.selection = null; // eslint-disable-line
            }
          }
        });
      },
      validate() {
        const hasAllNeededSelections = this.localColumns.every(column => column.selection !== null);
        if (!hasAllNeededSelections) {
          alert('You need to select all columns'); // elint-disable-line
        } else {
          this.$emit('onValidate', this.localColumns.map(localColumn => ({
            column: localColumn.selection.value,
            data: localColumn.data,
          })));
        }
      },
      fillLocalColumns(columns) {
        const availableOptions = this.requiredColumns.concat(this.optionalColumns);

        this.localColumns = columns.map(column => ({
          name: column.name,
          displayedData: _.take(column.data, 4),
          data: column.data,
          options: _.clone(availableOptions),
          selection: null,
        }));
      },
    },
    data() {
      return {
        localColumns: [],
      };
    },
    mounted() {
      this.fillLocalColumns(this.userColumns);
    },
  };
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
