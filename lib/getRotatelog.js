const fs = require('mz/fs');
const moment = require('moment');
const mkdirp = require('mz-modules/mkdirp');
const path = require('path');

module.exports = async function (logfile) {
    await mkdirp(path.dirname(logfile));
  
    if (await fs.exists(logfile)) {
      // format style: .20150602.193100
      const timestamp = moment().format('.YYYYMMDD.HHmmss');
      // Note: rename last log to next start time, not when last log file created
      await fs.rename(logfile, logfile + timestamp);
    }
  
    return await fs.open(logfile, 'a');
}