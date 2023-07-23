import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import nextI18NextConfig from "../../../next-i18next.config";
import DashboardLayout from "../../layout/dashboard";
import { OrganizationApi } from "../../services/api/org";
import Table from "../../ui/table";
import { languages } from "../../utils/languages";

const columnHelper = createColumnHelper<{
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}>();

const columns = [
  columnHelper.accessor("id", {
    header: "OrgUser",
  }),
  columnHelper.accessor("role", {
    header: "Role",
  }),
  columnHelper.accessor("user.name", {
    header: "User",
  }),
];

export default function OrganizationPage() {
  const { query } = useRouter();

  const { data: session } = useSession();
  const slug = query.org as string;

  const { data } = useQuery(
    ["organization", slug],
    async () => {
      return await new OrganizationApi(session?.accessToken).get(slug);
    },
    {
      enabled: !!session?.user,
    }
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DashboardLayout>
      <Table table={table} />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale = "en" }) => {
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return {
    props: {
      ...(await serverSideTranslations(chosenLocale, nextI18NextConfig.ns)),
    },
  };
};
