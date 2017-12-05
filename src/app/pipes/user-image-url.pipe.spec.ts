import { UserImageUrlPipe } from './user-image-url.pipe';

describe('UserImageUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new UserImageUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
