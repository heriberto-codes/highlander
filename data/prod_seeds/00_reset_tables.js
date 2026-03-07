exports.seed = function(knex) {
  return knex.raw(`
    TRUNCATE TABLE
      coaches_teams,
      teams_players,
      stats,
      stat_catalogs,
      teams,
      players,
      coaches
    RESTART IDENTITY CASCADE
  `);
};
