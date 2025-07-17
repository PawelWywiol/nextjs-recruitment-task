export const normalizeToSeconds = (date: Date | string) => {
  const d = new Date(date);
  d.setMilliseconds(0);
  return d;
};
