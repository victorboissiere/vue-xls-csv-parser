<template>
  <div class="parse-file">
    Parse file
    <input type="file" v-on:change="upload" />
  </div>

</template>

<script>
  import parseFile from '../parser';

  export default {
    name: 'ParseFile',
    methods: {
      upload(event) {
        if (event.target.files.length !== 1) {
          alert('An error has occured'); // eslint-disable-line
          return;
        }
        const file = event.target.files[0];
        parseFile(file).then((results) => {
          console.log('results', results);
        }).catch((error) => {
          console.error('Something went wrong', error);
        });
      },
    },
    data() {
      return {
      };
    },
  };
</script>
