const { createTournament } = require('../controller/TournamentsController');

describe("création d'un tournoi", () => {
  it('Devrait retourner erreur si date création après date fin', () => {
    const req = {
      body: {
        start_date: '2026-04-10',
        end_date: '2025-03-01', // wainting for an error
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    createTournament(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'La date de début doit être antérieure à la date de fin.',
    });
  });
});
