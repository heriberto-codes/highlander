exports.seed = function (knex, Promise) {
  return knex('stat_catalogs').insert([
      {description: 'Hits'},
      {description: 'At Bats'},
      {description: 'Home Runs'},
      {description: 'Earned Runs'},
      {description: 'Innings Pitched'},
      {description: 'Strikeouts'}
    ]);
};
