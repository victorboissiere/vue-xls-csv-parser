<template>
  <div class="parse-file">
    <div class="alert alert-danger" v-if="error">
      {{ error }}
    </div>
    <div
      v-if="!file"
      :class="['dropzone-area', dragging ? 'dropzone-over' : '']"
      drag-over="handleDragOver"
      @dragenter="dragging=true"
      @dragleave="dragging=false"
    >
      <div class="dropzone-text">
        <span class="dropzone-title">{{ text[lang].file.select }}</span>
        <span class="dropzone-info" v-if="help">{{ help }}</span>
      </div>
      <input type="file" @change="upload">
    </div>
    <div class="dropzone-preview" v-else>
      <button @click="file=null" class="btn btn-primary">{{ text[lang].file.tryAgain }}</button>
    </div>
  </div>
</template>

<script>
  import parseFile from '../parser';
  import text from '../lang';

  export default {
    name: 'ParseFile',
    props: {
      help: {
        type: String,
      },
      lang: {
        type: String,
        default: () => 'en',
      },
    },
    methods: {
      upload(event) {
        const files = event.target.files || event.dataTransfer.files;
        if (files.length !== 1) {
          this.error = text[this.lang].error.fileSelection;
          return;
        }
        this.file = event.target.files[0];
        parseFile(this.file, text[this.lang]).then((results) => {
          this.error = null;
          this.$emit('fileDataReceived', results);
        }).catch((error) => {
          this.error = error;
          this.file = null;
        });
      },
      reset() {
        this.error = null;
        this.file = null;
      },
    },
    data() {
      return {
        error: null,
        dragging: false,
        file: null,
        text,
      };
    },
  };
</script>

<style scoped>
  .dropzone-over {
    border: 1px solid red !important;
  }

  .dropzone-area {
    height: 200px;
    position: relative;
    border: 2px dashed #CBCBCB;
  }
  .dropzone-area:hover {
    border: 2px dashed #2E94C4;
  }
  .dropzone-area .dropzone-title {
    color: #1975A0;
  }

  .dropzone-area input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .dropzone-text {
    position: absolute;
    top: 50%;
    text-align: center;
    transform: translate(0, -50%);
    width: 100%;
  }

  .dropzone-text span {
    display: block;
    font-family: Arial, Helvetica;
    line-height: 1.9;
  }

  .dropzone-title {
    font-size: 13px;
    color: #787878;
    letter-spacing: 0.4px;
  }
  .dropzone-info {
    font-size: 12px;
    color: #A8A8A8;
    letter-spacing: 0.4px;
  }

  .dropzone-button {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
  }
</style>
