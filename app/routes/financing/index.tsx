import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getFinancingList } from "~/models/financing.server";

type LoaderData = {
  financingList: Awaited<ReturnType<typeof getFinancingList>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const financingList = await getFinancingList();
  return json<LoaderData>({ financingList });
};

export default function FinancingListPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <Link to="new" className="text-blue-500 underline">
        New Financing
      </Link>
      <ul>
        {data.financingList.map(financing => {
          return (
            <li>
              <Link to={financing.id} className="text-blue-500 underline">
                {financing.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
