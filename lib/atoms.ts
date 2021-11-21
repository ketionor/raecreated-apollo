import { atom } from "jotai";

interface User {
  isLoggedIn: boolean;
  accessToken: string;
}

export const userAtom = atom<User>({
  isLoggedIn: false,
  accessToken: "",
});
