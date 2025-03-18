export const transformStringBoolean = (value: string) => {
  if (value.toLowerCase() === 'false') {
    return false;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  }

  return Boolean(value);
};
