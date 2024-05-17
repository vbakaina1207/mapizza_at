import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatDatePipe('01.01.2001');
    expect(pipe).toBeTruthy();
  });
});
