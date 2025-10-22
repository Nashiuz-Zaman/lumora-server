export const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    return {
      change: current === 0 ? 0 : 100,
      type: current === 0 ? "no change" : "increase",
    };
  }

  const diff = current - previous;
  const change = (diff / previous) * 100;

  return {
    change: Math.abs(change),
    type: diff === 0 ? "no change" : diff > 0 ? "increase" : "decrease",
  };
};
