import {inject, Injectable} from '@angular/core';
import {Auth, authState, createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword} from "@angular/fire/auth";
import {DatabaseServiceService} from "@app/core/services/database/database.service.service";
import {Credentials, UserDto} from "@/types";
import { AuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly auth: Auth = inject(Auth)
  private readonly userDataBase: DatabaseServiceService = inject(DatabaseServiceService)

  readonly authState = authState(this.auth)

  constructor() { }


  async login(credentials: Credentials){
    return await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)
  }

  async register(credentials: UserDto){
    console.log(credentials)
    await this.userDataBase.createUser(credentials)
    const {email, password} = credentials
    return await createUserWithEmailAndPassword(this.auth, email, password)
  }

  logout(){
    return this.auth.signOut()
  }
  // providers

  signInWithGoogleProvider(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    return this.callPopUp(provider);
  }

  signInWithGithubProvider(): Promise<UserCredential> {
    const provider = new GithubAuthProvider();

    return this.callPopUp(provider);
  }

  async callPopUp(provider: AuthProvider): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.auth, provider);

      return result;
    } catch (error: any) {
      return error;
    }
  }
}
