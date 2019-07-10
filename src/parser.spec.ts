import * as moment from 'moment';
import { parseDateIntent, parseIntentForSign } from './parser';

describe('Parser', () => {
  describe('date', () => {
    const DATE_FORMAT = 'YYYY/MM/DD';

    [
      {dateIntent: 'today', result: moment()},
      {dateIntent: 'tomorrow', result: moment().add(1, 'days')},
      {dateIntent: '2019/07/10', result: moment('2019/07/10', DATE_FORMAT)}
    ].forEach(scenario => it(`parses ${scenario.dateIntent} as ${scenario.result.format(DATE_FORMAT)}`, () => {
      expect(parseDateIntent(scenario.dateIntent).format(DATE_FORMAT)).toEqual(scenario.result.format(DATE_FORMAT));
    }));

    it('returns `undefined` for invalid date intent', () => {
      expect(parseDateIntent('unknown')).toBeUndefined();
    })
  });

  describe('intent with sign', () => {
    it('extracts tag from intent', () => {
      expect(parseIntentForSign('#', '#remote @tomorrow')).toEqual('remote');
    });

    it('extracts comment from intent', () => {
      expect(parseIntentForSign('"', '#remote @tomorrow "working from home"', '"')).toEqual('working from home');
    });
  });
});
