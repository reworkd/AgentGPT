import React from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";
import { translate } from "../utils/translate";

export interface SignInDialogProps {
  show: boolean;
  close: () => void;
}

export const SignInDialog = ({ show, close }: SignInDialogProps) => {
  const { signIn } = useAuth();

  return (
    <Dialog
      header={`${translate("SIGN_IN", "signInDialog")} 🔐`}
      isShown={show}
      close={close}
      footerButton={<Button onClick={() => void signIn()}>{`${translate("SIGN_IN", "signInDialog")}`}</Button>}
    >
      <p>
        {`${translate("PLEASE", "common")}`}{" "}
        <a className="link" onClick={() => void signIn()}>
          {`${translate("SIGN_IN_LINK", "signInDialog")}`}
        </a>{" "}
        {`${translate("TO_DEPLOY_AN_AGENT", "signInDialog")} 🤖`}
      </p>
    </Dialog>
  );
};
