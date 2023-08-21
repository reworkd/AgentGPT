import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "next-auth";

import OauthApi from "../services/workflow/oauthApi";

const QUERY_KEY = ["sid"];

export function useSID(session: Session | null) {
  const api = OauthApi.fromSession(session);
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery(QUERY_KEY, async () => await api.get_info_sid(), {
    enabled: !!session,
    retry: false,
  });

  const { mutateAsync: install } = useMutation(async () => {
    if (!session) return;

    window.location.href = await api.install("sid");
  });

  const { mutateAsync: uninstall } = useMutation(async () => {
    if (!session) return;

    await api.uninstall("sid");
    queryClient.setQueriesData(QUERY_KEY, { connected: false });
  });

  return {
    connected: data?.connected ?? false,
    refetch,
    install: async () => install(),
    uninstall: async () => uninstall(),
    manage: () => void window.open("https://me.sid.ai/", "_blank"),
  };
}
