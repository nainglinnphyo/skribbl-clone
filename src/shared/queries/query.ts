/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const takeUniqueOrThrow = <T extends any[]>(values: T): T[number] => {
  if (values.length !== 1) {
    throw new Error('Found non unique or inexistent value');
  }
  return values[0]!;
};

export const takeUniqueOrNull = <T extends any[]>(values: T): T[number] => {
  if (values.length !== 1) {
    return null;
  }
  return values[0]!;
};
