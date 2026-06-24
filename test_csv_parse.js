const csv = require('csv-parser');
const { Readable } = require('stream');

const csvContent = "name,phone\nTestUser1,+919175635165\nTestUser2,+917219053645\n";

Readable.from(csvContent)
  .pipe(csv())
  .on('data', (row) => {
    console.log('PARSED ROW:', row);
    console.log('KEYS:', Object.keys(row));
  })
  .on('end', () => {
    console.log('Finished parsing.');
  });
