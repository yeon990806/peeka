export const APIHost = process.env.NODE_ENV === 'production' ? '/v1/community/' : '/api'
import { AxiosRequestConfig, } from 'axios';

export const GoogleSignIn = 'https://accounts.google.com/o/oauth2/v2/auth?scope=email&response_type=code&client_id=929609207739-ne52nm5h1dp6v3m7oaroj44rh6887h1d.apps.googleusercontent.com&redirect_uri=https://www.peeka.ai/login/oauth2/code/google&flowName=GeneralOAuthFlow'
export const GooleTest = 'https://accounts.google.com/o/oauth2/v2/auth?scope=email&response_type=code&client_id=70787987609-qbltm4d0fjfqv4r32gtshsap7l2i5kfg.apps.googleusercontent.com&redirect_uri=http://localhost:3000/app/accounts/auth/google/callback&flowName=GeneralOAuthFlow'

export const duplicateEmail = `${ APIHost }/public/auth/email/existence?email=`
export const authEmail = `${ APIHost }/public/auth/google/email?code=`

export interface AxiosResponseType<T = never> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig<T>;
  request?: any;
}
