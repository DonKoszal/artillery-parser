const fs = require('fs'),
	readline = require('readline'),
	json2csv = require('json2csv').parse,
	mode = process.argv[2],
	artilleryFile = process.argv[3] || 'artillery-result.txt',
	delimiter = process.argv[4] || ';',
	resultDir = 'result',
	titleLine = 'Started phase',
	endLine = 'Summary report',
	parserRegex = /(.*)(:\s+)([\d.]+)/,
	parserResult = [{}],
	csvHeaders = [];

//check if file exists and is accessable
fs.accessSync(artilleryFile);

//create 
if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
}

const lineReader = readline.createInterface({
  input: fs.createReadStream(artilleryFile)
});

let i = 0;
lineReader.on('line', line => {
	if(line.includes(titleLine)) { return false; }
	if(line.includes(endLine)) { lineReader.close(); }

	const matches = parserRegex.exec(line.trim());
	if(matches) {
		if(parserResult[i][matches[1]]) { i++; parserResult[i] = {}; }
		if(!csvHeaders.includes(matches[1])) { csvHeaders.push(matches[1]); }
		parserResult[i][matches[1]] = matches[3].replace('.', ',');
	}
});

lineReader.on('close', () => {
	const saveJson = result => {
		const jsonResult = JSON.stringify(parserResult);
		fs.writeFileSync(`${resultDir}/result.json`, jsonResult, 'utf8');
	};
	const saveCsv = result => {
		try {
			const csvResult = json2csv(parserResult, { fields: csvHeaders, delimiter, quote: '' });
			fs.writeFileSync(`${resultDir}/result.csv`, csvResult, 'utf8');
		} catch (err) {
			console.error(err);
		}
	};

	const dataset = {
		'all':  { json: true, csv: true },
		'json': { json: true },
		'csv':  { json: true }
	},
	current = dataset[mode];
	if(!current) { console.error(new Error('Unknown mode: ' + mode)); process.exit(0); }
	if(current.json) { saveJson(); }
	if(current.csv)  { saveCsv(); }
	process.exit(0);
});