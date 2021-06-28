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

import * as React from "react";
import { useMemo, useState } from "react";
import { authLogout, UserProfile } from "../../common/keycloak";
import { Avatar, Dropdown, DropdownGroup, DropdownItem, DropdownToggle } from "@patternfly/react-core";

interface UserMenuProps {
  userProfile: UserProfile;
}

const UserMenu = ({ userProfile }: UserMenuProps) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const name = useMemo(() => {
    return userProfile.firstName && userProfile.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile.username
      ? userProfile.username
      : "User";
  }, [userProfile]);

  const logout = () => {
    authLogout();
  };

  return (
    <>
      <Avatar src={"images/avatarImg.svg"} alt="User image" style={{ marginRight: 5 }} />{" "}
      <Dropdown
        isPlain={true}
        position="right"
        isOpen={isUserDropdownOpen}
        toggle={
          <DropdownToggle onToggle={setIsUserDropdownOpen}>
            <span>{name}</span>
          </DropdownToggle>
        }
        dropdownItems={[
          <DropdownGroup key="group 1">
            <DropdownItem key="group 1 logout" component="button" onClick={logout}>
              Logout
            </DropdownItem>
          </DropdownGroup>
        ]}
      />
    </>
  );
};

export default UserMenu;
