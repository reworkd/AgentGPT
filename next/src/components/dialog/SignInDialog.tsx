import React from "react";

import { useAuth } from "../../hooks/useAuth";
import Dialog from "../../ui/dialog";

export interface SignInDialogProps {
  show: boolean;
  setOpen: (boolean) => void;
}

export const SignInDialog = ({ show, setOpen }: SignInDialogProps) => {
  const { signIn } = useAuth();

  return (
    <Dialog
      inline
      open={show}
      setOpen={setOpen}
      title="Sign in 🔐"
      actions={
        <>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-400"
            onClick={() => {
              signIn().catch(console.error);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-slate-1 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-3"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </>
      }
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
