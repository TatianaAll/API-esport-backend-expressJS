// const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const process = require('process');

// Mock process.env.JWT_SECRET
process.env.JWT_SECRET = 'test_secret_key';

describe('authentication middleware', () => {
  let req, res, next; // declare the parameter of the middleware
  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  it('Devrait rejeter une requete sans jeton JWT', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Pas de jetons d'authentification fourni",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // A AJOUTER :
  /* Valide extraction userId et role du token
Teste les tokens invalides
Teste extraction du Bearer token */
});
