declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface StrategyOptions {
    jwtFromRequest: (req: any) => string | null;
    secretOrKey: string;
    ignoreExpiration?: boolean;
  }

  export interface VerifyCallback {
    (payload: any, done: (error: any, user?: any, info?: any) => void): void;
  }

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify?: VerifyCallback);
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): (req: any) => string | null;
  };
}
