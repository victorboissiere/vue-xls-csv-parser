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
          alert('No files have been selected'); // eslint-disable-line
          return;
        }
        const file = event.target.files[0];
        parseFile(file).then((results) => {
          this.$emit('fileDataReceived', results);
        }).catch((error) => {
          alert(error); // eslint-disable-line
        });
      },
    },
    data() {
      return {
      };
    },
  };
</script>
