export type ErrBase<ErrCodes> = { code: ErrCodes, message: string };
export type ErrAny = ErrBase<unknown>;
