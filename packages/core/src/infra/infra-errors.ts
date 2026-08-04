import { type ErrAny } from '../errors/index.ts';

export const internalServerError = (
    message = 'Internal Server Error',
): ErrAny => {
    return {
        code: 'internal-server-error',
        message: message,
    };
};
