/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';

const Joi = require('joi');
const {
  initialState,
  shuffleCards,
  filterGameForProfile,
  filterMoveForResults,
  validateMove,
} = require('../../solitare.cjs');

module.exports = (app) => {
  /**
   * Create a new game
   *
   * @param {req.body.game} Type of game to be played
   * @param {req.body.color} Color of cards
   * @param {req.body.draw} Number of cards to draw
   * @return {201 with { id: ID of new game }}
   */
  app.post('/v1/game', async (req, res) => {
    if (!req.session.user)
      return res.status(401).send({ error: 'unauthorized' });

    // Schema for user info validation
    const schema = Joi.object({
      game: Joi.string().lowercase().required(),
      color: Joi.string().lowercase().required(),
      draw: Joi.any(),
    });
    // Validate user input
    try {
      const data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Set up the new game
      let newGame = {
        owner: req.session.user._id,
        active: true,
        cards_remaining: 52,
        color: data.color,
        game: data.game,
        score: 0,
        start: Date.now(),
        winner: '',
        state: [],
      };
      switch (data.draw) {
        case 'Draw 1':
          newGame.drawCount = 1;
          break;
        case 'Draw 3':
          newGame.drawCount = 3;
          break;
        default:
          newGame.drawCount = 1;
      }
      // Generate a new initial game state
      newGame.state = initialState();
      let game = new app.models.Game(newGame);
      try {
        await game.save();
        const query = { $push: { games: game._id } };
        // Save game to user's document too
        await app.models.User.findByIdAndUpdate(req.session.user._id, query);
        res.status(201).send({ id: game._id });
      } catch (err) {
        console.log(`Game.create save failure: ${err}`);
        res.status(400).send({ error: 'failure creating game' });
      }
    } catch (err) {
      console.log(err);
      const message = err.details[0].message;
      console.log(`Game.create validation failure: ${message}`);
      res.status(400).send({ error: message });
    }
  });

  /**
   * Fetch game information
   *
   * @param (req.params.id} Id of game to fetch
   * @return {200} Game information
   */
  app.get('/v1/game/:id', async (req, res) => {
    try {
      let game = await app.models.Game.findById(req.params.id);
      if (!game) {
        return res
          .status(404)
          .send({ error: `unknown game: ${req.params.id}` });
      }

      // Extract the current state and calculate remaining cards
      const state = game.state.toJSON();
      let results = filterGameForProfile(game);
      results.start = Date.parse(results.start);
      results.cards_remaining =
        52 -
        (state.stack1.length +
          state.stack2.length +
          state.stack3.length +
          state.stack4.length);

      // Check if moves are requested and fetch them
      if (req.query.moves === '') {
        const moves = await app.models.Move.find({ game: req.params.id });
        state.moves = moves.map((move) => filterMoveForResults(move));
      }
      const moveJSONS = game.moveJSONS || [];

      let drawType = game.drawCount;

      res.status(200).send({
        ...results,
        ...state,
        drawType: drawType,
        moveJSONS: moveJSONS,
        history: game.moveHistory,
      });
    } catch (err) {
      console.error(`Game.get failure: ${err}`);
      res.status(404).send({ error: `unknown game: ${req.params.id}` });
    }
  });

  app.put('/v1/game/:id/quit', async (req, res) => {
    // Check if user is logged in
    if (!req.session.user)
      return res.status(401).send({ error: 'unauthorized' });

    try {
      // Fetch the game from the database
      let game = await app.models.Game.findById(req.params.id);
      if (!game) {
        return res
          .status(404)
          .send({ error: `unknown game: ${req.params.id}` });
      }
      // Check if the current user is the owner of the game
      if (game.owner.toString() !== req.session.user._id) {
        return res.status(401).send({ error: 'unauthorized' });
      }

      // Update the game to be inactive
      game.active = false;
      await game.save();
      res.status(200).send({ message: 'Game successfully quit.' });
    } catch (err) {
      console.error(`Game.quit failure: ${err}`);
      res
        .status(500)
        .send({ error: 'Failed to quit game due to server error.' });
    }
  });

  /**
   * Request a move from a game
   *
   * @param (req.params.id) Id of game to check
   * @return {200} Valid move
   */
  app.put('/v1/game/:id', async (req, res) => {
    // Check if user is logged in
    if (!req.session.user)
      return res.status(401).send({ error: 'unauthorized' });

    try {
      // Fetch the game from the database
      let game = await app.models.Game.findById(req.params.id);
      if (!game) {
        return res
          .status(404)
          .send({ error: `unknown game: ${req.params.id}` });
      }
      // Check if the current user is the owner of the game
      if (game.owner.toString() !== req.session.user._id) {
        return res.status(401).send({ error: 'unauthorized' });
      }

      // Save the current state before making a move
      const currentState = game.state.toJSON();
      const snapShot = game.state.toJSON();

      // Validate the requested move
      let [isValid, newState, result] = await validateMove(
        currentState,
        req.body,
        game.drawCount,
      );

      if (isValid) {
        // Push the current state to stateHistory for undo functionality
        game.stateHistory.push(snapShot);

        // Clear the redoStack after making a move
        game.redoStack = [];

        game.state = newState;
        game.moveHistory.push(game.state.toJSON());
        game.moves += 1;

        const user = await app.models.User.findById(req.session.user._id);

        const newMove = {
          user: user.username,
          game: game._id,
          src: req.body.src || null,
          dst: req.body.dst || null,
          date: new Date(),
        };

        game.moveJSONS.push(newMove);

        try {
          await game.save();
          res.status(200).send({ state: newState, result: result });
        } catch (saveError) {
          console.log(`Game.save failure: ${saveError}`);
          res.status(500).send({ error: 'Failed to save game state' });
        }
      } else {
        res.status(400).send({ error: 'Invalid move' });
      }
    } catch (err) {
      console.log(`Game.put failure: ${err}`);
      res.status(400).send({ error: 'Failure updating game' });
    }
  });

  app.get('/v1/game/:id/undo', async (req, res) => {
    try {
      const game = await app.models.Game.findById(req.params.id);
      if (!game || game.stateHistory.length === 0) {
        return res.status(400).json({ error: 'No moves to undo' });
      }

      // Push current state to redo stack
      game.redoStack.push(game.state);

      // Pop the last state from the stateHistory stack
      const previousState = game.stateHistory.pop();
      game.state = previousState;
      await game.save();

      res.json(game.state);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/v1/game/:id/redo', async (req, res) => {
    try {
      const game = await app.models.Game.findById(req.params.id);
      if (!game || game.redoStack.length === 0) {
        return res.status(400).json({ error: 'No moves to redo' });
      }

      // Push current state to stateHistory stack
      game.stateHistory.push(game.state);

      // Pop the last state from the redoStack
      const nextState = game.redoStack.pop();
      game.state = nextState;
      await game.save();

      res.json(game.state);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Provide end-point to request shuffled deck of cards and initial state - for testing
  app.get('/v1/cards/shuffle', (req, res) => {
    res.send(shuffleCards(false));
  });
  app.get('/v1/cards/initial', (req, res) => {
    res.send(initialState());
  });
};
