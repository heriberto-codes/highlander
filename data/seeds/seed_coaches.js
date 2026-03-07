const bcrypt = require('bcrypt');

exports.seed = function (knex, Promise) {
  return Promise.all([
    bcrypt.hash('highlander', 10),
    bcrypt.hash('highlander', 10),
    bcrypt.hash('1234', 10)
  ]).then(function(passwords) {
    return knex('coaches').insert([
      {email: 'romanh99@gmail.com', password: passwords[0], first_name: 'Isaac', last_name: 'Brewman'},
      {email: 'danny@gmail.com', password: passwords[1], first_name: 'Danny', last_name: 'Diaz'},
      {email: 'test@gmail.com', password: passwords[2], first_name: 'Test', last_name: 'Account'}
    ]);
  });
};
