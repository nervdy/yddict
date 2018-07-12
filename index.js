#!/usr/bin/env node

const request = require('request')
const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner
const isChinese = require('is-chinese')
const urlencode = require('urlencode')
const noCase = require('no-case')
const config = require('./lib/config')
const Parser = require('./lib/parser')
const fs = require('fs')
const path = require('path')

let word = process.argv.slice(2).join(' ')
if (!word) {
	console.log('Usage: yd <WORD_TO_QUERY>')
	process.exit()
}

let word_arr = word.split(' ')
if (word_arr.length > 1) {
	save_word(word_arr)
	return
}

const spinner = new Spinner('努力查询中... %s')

if (config.spinner) {
	spinner.setSpinnerString('|/-\\')
	spinner.start()
}

// const word = yargs[0]
const isCN = isChinese(word)

word = isCN ? word : noCase(word)

const options = {
	'url': config.getURL(word) + urlencode(word),
	'proxy': config.proxy || null
}

const ColorOutput = chalk.keyword(config.color)

request(options, (error, response, body) => {
	if (error) {
		console.error(error)
	}

	if (config.spinner) {
		spinner.stop(true)
	}
	let output = Parser.parse(isCN, body)
	console.log(ColorOutput(output))

	if (!isCN && output) {
		save_word([word])
	}
})

function save_word (word) {
	let word_path = path.join(__dirname, './data/word1.json')
	
	if (!fs.existsSync(word_path)) {
		fs.appendFileSync(word_path, JSON.stringify([]))
	}
	
	let file = fs.readFileSync(word_path, {encoding: 'utf8'})
	file = JSON.parse(file)
	
	let add = 0
	word.forEach((item) => {
		if (file.includes(item)) return
		add++
		file.push(item)
	})

	fs.writeFile(word_path, JSON.stringify(file), () => {
		console.log('write success: %s; total: %s;', add, file.length)
	})
	
}

// POST  http://iwordnet.com/quiz/investigateWordList.htm
/**
 * avalon.post("/quiz/investigateWordList.htm", {
                w: t.join(",")
            })
 */

//  Accept: */*
/**
 * Accept: * /*
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,zh;q=0.8,zh-CN;q=0.7
Cache-Control: no-cache
Connection: keep-alive
Content-Length: 151
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Cookie: 
Host: iwordnet.com
Origin: http://iwordnet.com
Pragma: no-cache
Referer: http://iwordnet.com/sbook/upload.htm
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36
X-Requested-With: XMLHttpRequest
 */