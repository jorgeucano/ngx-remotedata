import {
  success,
  failure,
  inProgress,
  getOrElse,
  notAsked,
  fold,
  RemoteData
} from './remote-data';

describe('RemoteData', () => {
  describe('notAsked', () => {
    it('should have a "NotAsked" tag', () => {
      const value = notAsked();
      expect(value.tag).toBe('NotAsked');
    });
  });

  describe('success', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect(getOrElse(success(value), { type: 'nope' })).toBe(value);
    });
  });

  describe('inProgress', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      expect((inProgress(value) as any).value()).toBe(value);
    });
  });

  describe('failure', () => {
    it('should be able to extract the wrapped error and value', () => {
      const err = 'Ouch!';
      const value = { type: 'DoStuff' };
      const f = failure(err, value) as any;
      expect(f.error()).toBe(err);
      expect(f.value()).toBe(value);
    });
  });

  describe('getOrElse', () => {
    it('should be able to extract the wrapped value', () => {
      const value = { type: 'DoStuff' };
      const defaultValue = { type: 'nope' };
      expect(getOrElse(success(value), defaultValue)).toEqual({
        type: 'DoStuff'
      });
    });
    it('should return the default value when not a Success', () => {
      const defaultValue = { type: 'nope' };
      const sut = getOrElse(notAsked(), defaultValue);
      expect(sut).toBe(defaultValue);
    });
  });

  describe('fold', () => {
    const theFold = (rd: RemoteData<string>) =>
      fold(
        () => 'not asked',
        val => 'in progress ' + val,
        (error, value) => `failure ${error} ${value}`,
        value => 'success ' + value,
        rd
      );
    it('it should unwrap the NotAsked variant', () => {
      expect(theFold(notAsked())).toBe('not asked');
    });
    it('it should unwrap the InProgress variant', () => {
      expect(theFold(inProgress('is progress'))).toBe(
        'in progress is progress'
      );
    });
    it('it should unwrap the Failure variant', () => {
      expect(theFold(failure('uh', 'oh'))).toBe('failure uh oh');
    });
    it('it should unwrap the Success variant', () => {
      expect(theFold(success('is nice!'))).toBe('success is nice!');
    });
  });
});
