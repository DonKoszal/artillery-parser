# artillery-parser

Artillery result parser to json/csv

### Prerequisites

* Node 8

### Setup

To install necessary dependencies:

```bash
npm install
```

### Parsing

```bash
npm run parse 	   <filename> <delimiter>
npm run parse-csv  <filename> <delimiter>
npm run parse-json <filename> <delimiter>

#default
#filename = artillery-result.txt
#delimiter = ;
```

### Test

```bash
npm run test
```