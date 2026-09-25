const ItemStatus = {
  Done: 'done',
  Pending: 'pending',
} as const;

type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

export { ItemStatus };
