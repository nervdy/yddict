const fs = require('fs')
const path = require('path')


let file = fs.readFileSync(path.join(__dirname, './data/word1.json'), {encoding: 'utf8'})
file = JSON.parse(file)

let txt = file.join('\r\n')

fs.writeFile(path.join(__dirname, './data/word1.txt'), txt, (error) => {
  console.log(error)
})