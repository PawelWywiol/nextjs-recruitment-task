export const normalizeDateToSeconds = (date: Date | string) => {
  const d = new Date(date);
  d.setMilliseconds(0);
  return d;
};

export const resolveDateRangeInSeconds = (date: Date | string) => {
  const d = new Date(date);
  return {
    gte: new Date(d.getTime() - 1000),
    lt: new Date(d.getTime() + 1000),
  };
};
