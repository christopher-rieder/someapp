import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({});
};

export default function FinancingPage() {
    return <Outlet />;
  }
  