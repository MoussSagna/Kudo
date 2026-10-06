import { gridFrom, pieceById } from '../notation';

describe('gridFrom', () => {
  it('maps each letter to its color and anything else to an empty cell', () => {
    expect(gridFrom(['roygcbp.'])).toEqual([
      ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', null],
    ]);
  });
});

describe('pieceById', () => {
  it('returns the piece with this id', () => {
    expect(pieceById('sq2').cells).toHaveLength(4);
  });

  it('throws for an unknown id', () => {
    expect(() => pieceById('nope')).toThrow('Unknown piece: nope');
  });
});
