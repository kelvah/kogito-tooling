/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { config } from "../config";

let keycloak: any;

export const authInit = (): Promise<UserProfile> => {
  keycloak = Keycloak(config.keycloak.configuration);
  return new Promise((resolve, reject) => {
    keycloak
      .init({ onLoad: "login-required" })
      .then(() => {
        let userProfile: UserProfile = {};
        getUserProfile()
          .then((profile: any) => {
            userProfile = profile;
            resolve(userProfile);
          })
          .catch(() => {
            console.log("cannot load user profile");
            resolve(userProfile);
          });
      })
      .catch(() => {
        reject();
      });
  });
};

export const getAuthToken = () => {
  return new Promise((resolve, reject) => {
    if (keycloak.token) {
      keycloak.updateToken(5).then(() => {
        resolve(keycloak.token);
      }, reject);
    }
  });
};

export const authLogout = () => {
  keycloak.logout();
};

export const getUserProfile = () => {
  return keycloak.loadUserProfile();
};

export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  totp?: boolean;
  createdTimestamp?: number;
}
