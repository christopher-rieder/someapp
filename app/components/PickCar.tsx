import { Form } from "@remix-run/react";
import { carList } from "~/models/car.server";
import GenericMoney from "./GenericMoney";

type props = {
  carList: carList
}

export default function PickCar({ carList }: props) {
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

  return (
    <Form>
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