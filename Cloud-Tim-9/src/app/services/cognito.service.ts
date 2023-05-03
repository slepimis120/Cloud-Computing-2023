import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment'
import { User } from '../models/user'

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth:environment.cognito
    })
  }

  public signUp(user:User) : Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name
      }
    })
  }

  public confirmSignUp(user:User) : Promise<any>{
    return Auth.confirmSignUp(user.email, user.code);
  }
}
