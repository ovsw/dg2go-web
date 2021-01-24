const moment = require('moment');

module.exports = value => {
  const dateObject = moment(value);
  return `${dateObject.format('ddd, Do')} of ${dateObject.format('MMMM')}`; 
};