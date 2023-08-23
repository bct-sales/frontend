import { Role } from "@/auth/types";
import { PayloadAction } from "@reduxjs/toolkit";


type LoginAction = PayloadAction<{ accessToken: string, role: Role, userId: number }, 'login'>;

type LogoutAction = PayloadAction<void, 'logout'>;

export type Action = LoginAction
                   | LogoutAction;
