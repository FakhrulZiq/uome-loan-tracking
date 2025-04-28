import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'serviceAccountKey.json';
import { TYPES } from 'src/applications/constant';
import { IContextAwareLogger } from '../logger';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  onModuleInit() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  getAuth() {
    return admin.auth();
  }

  async registerUserInFirebase(uid: string, phoneNumber: string): Promise<any> {
    try {
      await admin.auth().getUser(uid);
      console.log('User exists.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found. Creating new user...');

        await admin.auth().createUser({
          uid,
          phoneNumber,
        });

        console.log('User created.');
      } else {
        this._logger.error(error.message, error);
        throw error;
      }
    }
  }
}

/*: NOTE 
🔄 Flow Summary
On frontend (or Firebase emulator):
   - User signs in with phone number using Firebase client SDK.
   - They receive an OTP.
   - They enter the OTP, and Firebase returns an idToken.

On your backend:
   - You call the verifyOtp mutation with that idToken.
   - Firebase Admin SDK verifies it.
   - You return the user info (uid, phone number, etc.).
*/
