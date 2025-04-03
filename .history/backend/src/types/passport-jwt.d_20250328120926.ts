declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface StrategyOptions {
    jwtFromRequest: (req: any) => string | null;
    secretOrKey: string;
    ignoreExpiration?: boolean;
  }

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify?: Function);
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): (req: any) => string | null;
  };
} 