const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  return Promise.all([
    bcrypt.hash('highlander', 10),
    bcrypt.hash('highlander', 10),
    bcrypt.hash('highlander', 10),
    bcrypt.hash('highlander', 10)
  ]).then(function(passwords) {
    return knex('players').insert([
      {email: 'romanh99@gmail.com', password: passwords[0], first_name: 'Heriberto', last_name: 'Roman', position: '1st base'},
      {email: 'brown@gmail.com', password: passwords[1], first_name: 'Randy', last_name: 'Brown', position: '2nd base'},
      {email: 'bigmac@gmail.com', password: passwords[2], first_name: 'Big', last_name: 'Mac', position: '3rd base'},
      {email: 'ricky@gmail.com', password: passwords[3], first_name: 'Ricardo', last_name: 'Roman', position: 'catcher'}
    ]);
  });
};
