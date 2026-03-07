const app = require('express');
const router = app.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Coach = require('../models/Coach');
const {
  issueToken,
  requireAuth,
  loginRateLimit,
  trackFailedLogin,
  clearLoginFailures
} = require('../middleware/auth');

router.use(bodyParser.urlencoded({extended: true}));
router.use(jsonParser);

function toSafeCoach(coachModel) {
  return {
    id: coachModel.get('id'),
    email: coachModel.get('email'),
    first_name: coachModel.get('first_name'),
    last_name: coachModel.get('last_name'),
    created_at: coachModel.get('created_at'),
    updated_at: coachModel.get('updated_at')
  };
}

router.get('/', requireAuth, function(req, res) {
  Coach
  .where({id: req.authCoachId})
  .fetch()
  .then(function(coach) {
    if (!coach) return res.status(404).json({message: 'Coach not found'});
    res.json(toSafeCoach(coach));
  })
  .catch(function(err) {
    return res.status(500).json({message: 'Server error'});
  })
})

router.get('/:id', requireAuth, function(req, res) {
  const requestedCoachId = Number(req.params.id);
  if (requestedCoachId !== req.authCoachId) {
    return res.status(403).json({message: 'Forbidden'});
  }

  Coach
  .where({id: requestedCoachId})
  .fetch({withRelated: ['teams', 'teams.players', 'teams.players.stats', 'teams.players.stats.catalog']})
  .then(function(coach) {
    if (!coach) return res.status(404).json({message: 'Coach not found'});
    const safeCoach = coach.toJSON();
    delete safeCoach.password;
    res.json(safeCoach);
  })
  .catch(function(err) {
    return res.status(500).json({message: 'Server error'});
  });
})

router.post('/login', loginRateLimit, function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    trackFailedLogin(req);
    return res.status(400).json({message: 'Email and password are required'});
  }

  let coachData;
  Coach
  .where({
    email
  })
  .fetch()
  .then(function(coach) {
    if (!coach) {
      trackFailedLogin(req);
      return res.status(401).json({message: 'Invalid email or password'});
    }
    coachData = coach;
    return Coach.validatePassword(coachData.get('password'), password);
  }).then(function(validPassword){
    if (validPassword === undefined) return;
    if(validPassword){
      clearLoginFailures(req);
      const safeCoach = toSafeCoach(coachData);
      const token = issueToken(safeCoach.id);
      res.status(200).json({...safeCoach, token});
    } else {
      trackFailedLogin(req);
      res.status(401).json({message: 'Invalid email or password'});
    }
  })
  .catch(function(err) {
    return res.status(500).json({message: 'Server error'});
  });
})

router.put('/:id', requireAuth, function(req, res) {
  const requestedCoachId = Number(req.params.id);
  if (requestedCoachId !== req.authCoachId) {
    return res.status(403).json({message: 'Forbidden'});
  }

  // check to see if the proper params is equal to what the user is inputting
  const updateParams = ['email', 'first_name', 'last_name']
  for(var i = 0; i < updateParams.length; i++) {
    const confirmedParams = updateParams[i];
    if(!(confirmedParams in req.body)) {
      const errorMessage = `Sorry your missing ${confirmedParams} please try again`
      console.error(errorMessage);
      return res.status(400).send(errorMessage)
    }
  }
  // update query db via model with new params
  Coach
  .where({id: requestedCoachId})
  .fetch()
  .then(function(coach) {
    if (!coach) return res.status(404).json({message: 'Coach not found'});
    return coach.save({
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    })
  })
  .then(function(coach){
    if (!coach) return;
    return res.status(200).json(toSafeCoach(coach))
  })
  .catch(function(err) {
    return res.status(500).json({message: 'Server error'})
  })
})

router.post('/', function(req, res) {
  const postParams = ['email', 'first_name', 'last_name', 'password']
  for (var i = 0; i < postParams.length; i++) {
    const confirmPostParams = postParams[i];
    if(!(confirmPostParams in req.body)) {
      const errorMessage = `Sorry your missing ${confirmPostParams} please try again`
      console.error(errorMessage);
      return res.status(400).send(errorMessage)
    }
  }
  Coach.hashPassword(req.body.password)
  .then(function(hashedPassword){
    return Coach
    .forge({
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashedPassword
    })
    .save()
  })
  .then(function(coach){
    const safeCoach = toSafeCoach(coach);
    const token = issueToken(safeCoach.id);
    return res.status(200).json({...safeCoach, token});
  })
  .catch(function(err){
    return res.status(500).json({message: 'Server error'});
  })
})

module.exports = router;
