console.log(process.argv);
console.log('end');
process.send({action: 'ready'});