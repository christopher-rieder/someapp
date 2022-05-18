import { Car } from "@prisma/client";
import { Form, useLoaderData } from "@remix-run/react";
import { LoaderData } from "~/routes/budget/new";
import GenericMoney from "./GenericMoney";

export default function PickCar() {
  const data = useLoaderData() as LoaderData
  if (data.carList) {
    return (
      <div>
        <hr className="m-4" />
        {
          data.carList.map((car: Car) => (
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

  } else {
    return (
      <Form method="get">
        <button
          name="pick"
          value="car"
          type="submit"
          className="block p-4 text-xl text-blue-500"
        >
          Pick Car
        </button>
      </Form>
    )
  }
}