import sinon from 'sinon';

import SummaryModel from '../model/SummaryModel.ts';

/**
 * @vitest-environment jsdom
 */

const deleteCallback = sinon.fake();
const summaryModel = new SummaryModel({ en: '', ru: '' }, deleteCallback);

describe('Checking summaryModel', () => {
  it('should check if summaryModel is defined', () => {
    expect(summaryModel).toBeDefined();
  });

  it('should check if summaryModel is an instance of SummaryModel', () => {
    expect(summaryModel).toBeInstanceOf(SummaryModel);
  });
});
