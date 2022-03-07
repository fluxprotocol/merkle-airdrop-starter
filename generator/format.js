const XLSX2JSON = require('json-key-string-xlsx');
const xlsx2json = new XLSX2JSON();
const path = require('path');
const fileLoc = "./ForetellerAirdropAddresses.xlsx"


function formatExcel(){
  const xlsxPath = path.join(fileLoc);
  const jsonData = xlsx2json.parse2json(xlsxPath);
  // console.log(jsonData[0])
  let data = jsonData[0];
  delete data['EthereumAddress'];
  let total = 0;
  for(let key in data){
    // console.log(Number(data[key]))
    data[key] = Number(data[key]);
    total += data[key];
  }
  console.log(total);
  return data;
}

let airdropArray = formatExcel();
console.log(airdropArray)

module.exports = airdropArray;