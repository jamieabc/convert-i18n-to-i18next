var fs = require('fs');
var commonTranslation = {};
var secondTranslation = {};
var thirdTranslation = {};
var duplicateList = [];

// read file, filename is given at first argument
fs.readFile(process.argv[2], 'utf8', parseFile);
var commonFileName = 'common-' + process.argv[2].split('-')[1].split('.')[0] + '.json';
var secondFileName = 'second-' + process.argv[2].split('-')[1].split('.')[0] + '.json';
var thirdFileName = 'third-' + process.argv[2].split('-')[1].split('.')[0] + '.json';
var listDuplicateFileName = 'DuplicateFileList';

// parse json file
function parseFile (err, data) {
  if (err) throw err;
  var content = JSON.parse(data);

  // get key-value pair
  Object.keys(content).forEach(function parseNameSpace(ns) {
    for (var key in content[ns].Word) {
      var value = content[ns].Word[key]['Translate To'];

      if (keyValueNotExisted(commonTranslation, key, value)) {
        commonTranslation[key] = value;
      } else if (keyValueNotExisted(secondTranslation, key, value)) {
        secondTranslation[key] = value;
        duplicateList.push('second: ' + ns + ', key: ' + key + ', string: ' + value + '\n');
      } else if (keyValueNotExisted(thirdTranslation, key, value)) {
        thirdTranslation[key] = value;
        duplicateList.push('third: ' + ns + ', key: ' + key + ', string: ' + value + '\n');
      } else {
        duplicateList.push('forth: ' + ns + ', key: ' + key + + ', string: ' + value + '\n');
      }
    }
  });

  // JSON stringfy
  var commonResult = JSON.stringify(commonTranslation, null, 4);
  var secondResult = JSON.stringify(secondTranslation, null, 4);
  var thirdResult = JSON.stringify(thirdTranslation, null, 4);

  // save to file
  fs.writeFile(commonFileName, commonResult);
  fs.writeFile(secondFileName, secondResult);
  fs.writeFile(thirdFileName, thirdResult);
  fs.writeFile(listDuplicateFileName, duplicateList.sort().join(''));
}

// check key-value already existed or not
function keyValueNotExisted(translation, key, value) {
  if (translation[key] !== undefined && translation[key] !== value) {
    return false;
  }
  return true;
}
