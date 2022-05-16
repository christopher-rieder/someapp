import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPromotionsList } from "~/models/promotions.server";

type LoaderData = {
  promotionsList: Awaited<ReturnType<typeof getPromotionsList>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const promotionsList = await getPromotionsList();
  return json<LoaderData>({ promotionsList });
};

export default function PromotionsListPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <Link to="new" className="text-blue-500 underline">
        New Promotion
      </Link>
      <ul>
        {data.promotionsList.map(promotion => {
          return (
            <li>
              <Link to={promotion.id} className="text-blue-500 underline">
                {promotion.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
