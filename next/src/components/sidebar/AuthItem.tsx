import type { FC } from "react";
import React, { useState } from "react";
import type { Session } from "next-auth";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { get_avatar } from "../../utils/user";
import { FaEllipsisH, FaSignInAlt } from "react-icons/fa";
import Dialog from "../../ui/dialog";
import { ThemeMenu } from "../ThemeMenu";

const AuthItem: FC<{
  session: Session | null;
  classname?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}> = ({ session, classname, signOut, signIn }) => {
  const [t] = useTranslation("drawer");
  const [showDialog, setShowDialog] = useState(false);
  const user = session?.user;

  return (
    <div className="flex items-center justify-between">
      <div
        className={clsx(
          "text-color-primary flex flex-1 items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-semibold",
          "hover:background-color-2 cursor-pointer",
          classname
        )}
        onClick={(e) => {
          user ? setShowDialog(true) : void signIn();
        }}
      >
        {user && (
          <img
            className="h-9 w-9 rounded-md bg-neutral-800"
            src={get_avatar(user)}
            alt="user avatar"
          />
        )}
        {!user && (
          <h1 className="ml-2 flex h-9 w-9 flex-grow items-center gap-2 text-center">
            <FaSignInAlt />
            {t("SIGN_IN")}
          </h1>
        )}

        <span className="sr-only">Your profile</span>
        <div>
          <p aria-hidden="true">{user?.name}</p>
          <p aria-hidden="true" className="text-xs font-thin">
            {user?.email}
          </p>
        </div>
        {user && <FaEllipsisH className="ml-auto">Test</FaEllipsisH>}

        <Dialog
          inline
          open={showDialog}
          setOpen={setShowDialog}
          title="My Account"
          icon={<img className="h-20 w-20 rounded-md" src={get_avatar(user)} alt="" />}
          actions={
            <>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={() => {
                  signOut()
                    .then(() => setShowDialog(false))
                    .catch(console.error)
                    .finally(console.log);
                }}
              >
                Sign out
              </button>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-600">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </Dialog>
      </div>
      <div className="ml-2 mt-2">
        <ThemeMenu />
      </div>
    </div>
  );
};

export default AuthItem;
