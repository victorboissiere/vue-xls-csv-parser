import parseXlsx from './xlsx-parser';

function parseFileExcelFile(file, callback) {
  const reader = new FileReader();

  reader.onload = event =>
    parseXlsx(event.target.result)
    .then(result => callback(result))
    .catch(error => callback(error));

  reader.readAsBinaryString(file);
}


export default htmlFile =>
  new Promise((resolve, reject) => {
    parseFileExcelFile(htmlFile, (result) => {
      if (result.error) {
        return reject(result.error);
      }
      return resolve(result.worksheet);
    });
  });
