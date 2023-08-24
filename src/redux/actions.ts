import { AuthenticationData } from "@/auth/types";
import { PayloadAction } from "@reduxjs/toolkit";


export type LoginAction = PayloadAction<AuthenticationData, 'login'>;

export type LogoutAction = PayloadAction<void, 'logout'>;

export type UpdateCacheAction = PayloadAction<{key: string, value: unknown}, 'cache/update'>;

export type Action = LoginAction
                   | LogoutAction
                   | UpdateCacheAction;
