const options = process.argv[2];

require('@xiaolu289/sync-cluster')(options, function() {
    process.send({action: 'ready'});
});
