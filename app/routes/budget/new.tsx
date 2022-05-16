import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/server-runtime";
import PickCar from "~/components/PickCar";
import { getCarList } from "~/models/car.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
    carList: Awaited<ReturnType<typeof getCarList>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    await requireUserId(request);
    const carList = await getCarList();
    return json<LoaderData>({ carList });
};

export default function BudgetListPage() {
    const data = useLoaderData() as LoaderData;
    return (
        <main className="bg-white flex">
            <div className="m-16">
                <div>--car-here--</div>
                <div>--price-validation--</div>
                <div>--discounts--</div>
                <div>--discounts-validation--</div>
                <div>--special-discounts--</div>
                <div>--special-discounts-validation--</div>
                <Link to='pickCar' className="nav-link block p-4 text-xl text-blue-500">
                    Pick Car
                </Link>
                <PickCar carList={data.carList} />
                <Outlet></Outlet>
            </div>
            <div className="m-16">
                <div>--financing-here--</div>
                <div>--car-dependency--</div>
                <div>--amount-validation--</div>
                <div>--amount-validation--</div>
                <Link to='pickFinancing' className="nav-link block p-4 text-xl text-blue-500">
                    Pick Financing
                </Link>
                <Outlet></Outlet>
            </div>
            <div className="m-16">
                <div>--summary-here--</div>
                <div>--dependency-with-all-prices--</div>
                <div>--details-and-final-amount--</div>
                <div>--taxes-refresh--</div>
                <div>--final-amount-refreshed--</div>
            </div>
        </main>
    )
}