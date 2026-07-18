// TODO: Figure out correct error handling
// import { Result } from "./result.ts";
// import { UseCaseError } from "./use-case-error.ts";

//   export class UnexpectedError extends Result<UseCaseError> {
//     public constructor (err: unknown) {
//       super(false, {
//         message: `An unexpected error occurred.`,
//         error: err
//       } as UseCaseError)
//       console.log(`[AppError]: An unexpected error occurred`);
//       console.error(err);
//     }

//     public static create (err: unknown): UnexpectedError {
//       return new UnexpectedError(err);
//     }
//   }
