import { Car } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import GenericMoney from "./GenericMoney";

export default function PickCar() {
  const fetcherPickCar = useFetcher()
  if (fetcherPickCar?.data?.carList) {
    return (
      <div>
        <hr className="m-4" />
        {
          fetcherPickCar.data.carList.map((car: Car) => (
            <fetcherPickCar.Form method="post" key={car.id} className="flex">
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
            </fetcherPickCar.Form>
          ))
        }
      </div>
    )

  } else {
    return (
      <fetcherPickCar.Form method="get">
        <button
          name="pick"
          value="car"
          type="submit"
          className="block p-4 text-xl text-blue-500"
        >
          Pick Car
        </button>
      </fetcherPickCar.Form>
    )
  }
}