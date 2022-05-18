import { Financing } from "@prisma/client";
import { useFetcher, useFetchers } from "@remix-run/react";
import { useState } from "react";
import GenericMoney from "./GenericMoney";

export default function PickFinancing({ carId, pickingCar }: { carId: string, pickingCar: boolean }) {
  const fetcherPickFinancing = useFetcher()
  const [carIdPicked] = useState(carId)

  if (carId && fetcherPickFinancing?.data?.financingList) {
    return (
      <div>
        <hr className="m-4" />
        {
          fetcherPickFinancing.data.financingList.map((financing: Financing) => (
            <fetcherPickFinancing.Form method="post" key={financing.id} className="flex">
              <div >
                <div>{`${financing.name} ${financing.max_amount_percentage / 100}%`}| <GenericMoney num={financing.max_amount_flat} /></div>
              </div>
              <button
                name="pick-financing"
                disabled={pickingCar || carIdPicked !== carId}
                value={financing.id}
                type="submit"
                className="pl-2 text-l text-blue-500"
              >
                Select
              </button>
            </fetcherPickFinancing.Form>
          ))
        }
      </div>
    )
  } else {
    return (
      <fetcherPickFinancing.Form method="get">
        <button
          disabled={!carId || pickingCar}
          name="pick"
          value="financing"
          type="submit"
          className="block p-4 text-xl text-blue-500"
        >
          Pick Financing
        </button>
      </fetcherPickFinancing.Form>
    )
  }
}