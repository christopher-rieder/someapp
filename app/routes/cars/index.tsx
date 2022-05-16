import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getCarList } from "~/models/car.server";

type LoaderData = {
  carList: Awaited<ReturnType<typeof getCarList>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const carList = await getCarList();
  return json<LoaderData>({ carList });
};

export default function CarListPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <Link to="new" className="text-blue-500 underline">
        New Car
      </Link>
      <ul>
        {data.carList.map(car => {
          return (
            <li>
              <Link to={car.id} className="text-blue-500 underline">
                {car.brand} {car.model}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
