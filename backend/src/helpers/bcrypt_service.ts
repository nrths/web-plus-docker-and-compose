import * as bcrypt from 'bcrypt';

export const compare = (password, user) => {
  return bcrypt.compare(password, user.password).then((matched) => {
    if (!matched) return null;
    return user;
  });
};

export const hash = (dto, salt: number) => {
  return bcrypt.hash(dto, salt);
};
