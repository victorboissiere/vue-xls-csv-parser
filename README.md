# Vue XLS/CSV parser

Demo website coming soon.

## Description

This npm package will help you parse XLS/CSV files and validate them. The user will be asked to associate his file columns with the columns you require. Once validated, an event will be triggered where you will be able to get only the data you need.

## Requirements

You will need Bootstrap 3.x. It has not been tested yet with Boostrap 4.

## Components

### XlsCsvParser

#### Props

| Name        | Type           | Description  |
| ------------ |:-------------:| -----:|
| columns (required) | Array | An array of object representing the columns you required: `[{ name: 'Student login', value: 'login', isOptional: false }]` |
| validateButtonId | String | The id of the custom validate button. The component validation button will not be displayed |
| help | String  |  Help text shown on the file dropzone |
| lang | String | `en` or `fr`. Default: `en` |

#### Events

- `onValidate(results)`: all the data parsed by the component and returned after the user validation

#### Example usage

```javascript
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
  import { XlsCsvParser } from 'vue-xls-csv-parser';
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
```

## Tests

Simpliy run `yarn mocha`.

## Build Setup

``` bash
# install dependencies
yarn intall

# serve with hot reload at localhost:8080
yarn start

# build for a release
yarn bundle:dist
```
