import { ReaditreversePage } from './app.po';

describe('readitreverse App', () => {
  let page: ReaditreversePage;

  beforeEach(() => {
    page = new ReaditreversePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
