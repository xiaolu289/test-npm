const options = process.argv[2];

require('../sync-cluster')(options, function() {
    process.send({action: 'ready'});
});
