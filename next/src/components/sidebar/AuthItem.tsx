import type { FC } from "react";
import React, { useState } from "react";
import type { Session } from "next-auth";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { get_avatar } from "../../utils/user";
import { FaMoon, FaSignInAlt } from "react-icons/fa";
import { CgSun } from "react-icons/cg";
import Dialog from "../../ui/dialog";
import ToggleButton from "../../ui/toggleButton";
import { useThemeStore } from "../../stores";

const AuthItem: FC<{
  session: Session | null;
  classname?: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}> = ({ session, classname, signOut, signIn }) => {
  const [t] = useTranslation("drawer");
  const [showDialog, setShowDialog] = useState(false);
  const user = session?.user;

  const theme = useThemeStore.use.theme();
  const setTheme = useThemeStore.use.setTheme();
  const sunIcon = <CgSun className="text-color-secondary h-8 w-8 hover:text-yellow-500" />;
  const moonIcon = <FaMoon className="text-color-primary h-8 w-8 hover:text-blue-base-light" />;
  const themeIconOn = theme === "dark" ? sunIcon : moonIcon;
  const themeIconOff = theme !== "dark" ? moonIcon : sunIcon;

  return (
    <div className="flex items-center justify-between">
      <div
        className={clsx(
          "text-color-primary mt-2 flex items-center justify-start gap-3 rounded-md px-2 py-2 text-sm font-semibold",
          "hover-bg-shade-700-light cursor-pointer dark:hover:bg-shade-700-dark",
          classname
        )}
        onClick={(e) => {
          user ? setShowDialog(true) : void signIn();
        }}
      >
        {user && (
          <img className="h-8 w-8 rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />
        )}
        {!user && (
          <h1 className="ml-2 flex flex-grow items-center gap-2 text-center">
            <FaSignInAlt />
            {t("SIGN_IN")}
          </h1>
        )}

        <span className="sr-only">Your profile</span>
        <span aria-hidden="true">{user?.name}</span>
        <Dialog
          inline
          open={showDialog}
          setOpen={setShowDialog}
          title="My Account"
          icon={<img className="rounded-full bg-neutral-800" src={get_avatar(user)} alt="" />}
          actions={
            <>
              <button
                type="button"
                className="red-button-primary inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm"
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
                className="blue-button-secondary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </>
          }
        >
          <p className="text-color-secondary text-sm">Name: {user?.name}</p>
          <p className="text-color-secondary text-sm">Email: {user?.email}</p>
        </Dialog>
      </div>
      <ToggleButton
        className="mt-2 py-2"
        setChecked={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
        onIcon={themeIconOn}
        offIcon={themeIconOff}
        checked={theme === "dark"}
      />
    </div>
  );
};

export default AuthItem;
