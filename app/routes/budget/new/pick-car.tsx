import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/server-runtime";
import GenericMoney from "~/components/GenericMoney";
import { carList, getCarList } from "~/models/car.server";
import { setBudgetCar } from "~/models/DraftBudget.server";
import { requireUserId } from "~/session.server";

export type LoaderData = {
  carList?: carList;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const carList = await getCarList();
  const response = { carList } as LoaderData
  return json<LoaderData>(response);
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  if (formData.has('pick-car')) {
    const carId = formData.get('pick-car')
    if (typeof carId === "string" && carId.length > 0) {
      await setBudgetCar({ userId, carId })
      return redirect('/budget/new')
    } else {
      return json({ errors: { pickCar: true } }, { status: 400 });
    }
  }

  return null
};

export default function PickCar() {
  const data = useLoaderData() as LoaderData
  const carList = data.carList

  if (carList) {
    return (
      <div>
        <hr className="m-4" />
        {
          carList.map((car) => (
            <Form method="post" key={car.id} className="flex">
              <div>
                <div>{`${car.brand} ${car.model} ${car.version} - `}<GenericMoney num={car.retail_price} /></div>
              </div>
              <button
                name="pick-car"
                value={car.id}
                type="submit"
                className="pl-2 text-l text-blue-500"
              >
                Select
              </button>
            </Form>
          ))
        }
      </div>
    )
  }

}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}