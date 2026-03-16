export interface JwtPayload {
  sub: {
    id: number;
    type: string;
  };
  iat: number;
  exp: number;
}
