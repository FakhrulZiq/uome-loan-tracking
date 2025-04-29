export interface IAuthService {
  validateUser(input: IValidateUserInput): Promise<IValidateUserResponse>;
  assignNewAcessToken(input: INewAccessTokenInput): Promise<INewAccessToken>;
  logout(input: INewAccessTokenInput): Promise<ILogOutResponse>;
  otpVerification(
    input: IotpVerificationInput,
  ): Promise<IOtpVerificationResponse>;
  generateIdToken(phoneNumber: string): Promise<IFakeOtpIdToken>;
}

export interface IValidateUserInput {
  phoneNumber: string;
  password: string;
}

export interface IUserParser {
  phoneNumber: string;
  role: string;
}

export interface IValidateUserResponse {
  accessToken: string;
  refreshToken: string;
  phoneNumber: string;
  role: string;
}

export interface INewAccessToken {
  accessToken: string;
}

export interface ILogOutResponse {
  message: string;
}

export interface INewAccessTokenInput {
  refreshToken: string;
}

export interface IPayloadJwt {
  exp: number;
  iat: number;
  phoneNumber: string;
  sub: string;
}

export interface IotpVerificationInput {
  idToken: string;
}

export interface IOtpVerificationResponse {
  uid: string;
  phoneNumber: string;
}

export interface IFakeOtpIdToken {
  idToken: string;
}
