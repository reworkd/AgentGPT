import React from "react";

import Dialog from "./Dialog";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Button";

export interface SignInDialogProps {
  show: boolean;
  close: () => void;
}

export const SignInDialog = ({ show, close }: SignInDialogProps) => {
  const { signIn } = useAuth();

  return (
    <Dialog
      header="Sign in 🔐"
      isShown={show}
      close={close}
      footerButton={<Button onClick={() => void signIn()}>Sign in</Button>}
    >
      <p>
        Please{" "}
        <a className="link" onClick={() => void signIn()}>
          sign in
        </a>{" "}
        to deploy an Agent! 🤖
      </p>
    </Dialog>
  );
};
