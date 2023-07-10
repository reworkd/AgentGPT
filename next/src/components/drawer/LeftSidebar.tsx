import Image from "next/image";
import { FaBars } from "react-icons/fa";
import FadingHr from "../FadingHr";
import { DrawerItemButton, DrawerItemButtonLoader } from "./DrawerItemButton";
import { PAGE_LINKS, SOCIAL_LINKS } from "../sidebar/links";
import LinkItem from "../sidebar/LinkItem";
import LinkIconItem from "../sidebar/LinkIconItem";
import AuthItem from "../sidebar/AuthItem";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { api } from "../../utils/api";
import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";

const LeftSidebar = ({ show, setShow }: DisplayProps) => {
  const router = useRouter();
  const { session, signIn, signOut, status } = useAuth();
  const [t] = useTranslation("drawer");

  const { isLoading, data } = api.agent.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const userAgents = data ?? [];

  return (
    <Sidebar show={show} setShow={setShow} side="left">
      <div className="flex flex-row items-center justify-between">
        <Image
          src="logos/dark-default-solid.svg"
          width="25"
          height="25"
          alt="Reworkd AI"
          className="ml-2 invert dark:invert-0"
        />
        <h1 className="text-color-primary font-mono font-extrabold">My Agents</h1>
        <button
          className="neutral-button-primary rounded-md border-none transition-all"
          onClick={() => setShow(!show)}
        >
          <FaBars size="15" className="z-20 m-2" />
        </button>
      </div>
      <FadingHr className="my-2" />
      <div className="mb-2 mr-2 flex-1 overflow-y-auto">
        {status === "unauthenticated" && (
          <div className="text-color-primary p-1 font-mono text-sm">
            <a className="link" onClick={() => void signIn()}>
              {t("SIGN_IN")}
            </a>{" "}
            {t("SIGN_IN_NOTICE")}
          </div>
        )}
        {status === "authenticated" && !isLoading && userAgents.length === 0 && (
          <div className="text-color-primary p-1 font-mono text-sm">
            {t("NEED_TO_SIGN_IN_AND_CREATE_AGENT_FIRST")}
          </div>
        )}
        {(status === "loading" || (status === "authenticated" && isLoading)) && (
          <div className="flex flex-col gap-2 overflow-hidden">
            {Array(13)
              .fill(0)
              .map((_, index) => (
                <DrawerItemButtonLoader key={index} />
              ))}
          </div>
        )}

        {userAgents.map((agent, index) => (
          <DrawerItemButton
            key={`${index}-${agent.name}`}
            className="flex w-full rounded-md p-2 font-mono text-sm font-semibold"
            text={agent.name}
            onClick={() => void router.push(`/agent?id=${agent.id}`)}
          />
        ))}
      </div>
      <ul role="list" className="flex flex-col">
        <ul className="mb-2">
          <div className="text-color-secondary mb-2 ml-2 text-xs font-semibold">Pages</div>
          {PAGE_LINKS.map((link, i) => {
            if (router.route == link.href) {
              return null;
            }

            return (
              <LinkItem
                key={i}
                title={link.name}
                href={link.href}
                badge={link.badge}
                onClick={() => {
                  void router.push(link.href);
                }}
              >
                <link.icon className={link.className} />
              </LinkItem>
            );
          })}
        </ul>
        <li className="mb-2">
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <LinkIconItem
                key={link.name}
                href={link.href}
                onClick={() => {
                  void router.push(link.href);
                }}
              >
                <link.icon
                  size={20}
                  className="transition-all group-hover:rotate-3 group-hover:scale-125"
                />
              </LinkIconItem>
            ))}
          </div>
        </li>
        <li>
          <FadingHr />
          <AuthItem session={session} signOut={signOut} signIn={signIn} />
        </li>
      </ul>
    </Sidebar>
  );
};

export default LeftSidebar;
