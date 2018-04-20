import { UserNameFilterPipe } from './user-name-filter.pipe';

describe('UserNameFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserNameFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
