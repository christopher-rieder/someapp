import { Financing } from "@prisma/client";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { LoaderData } from "~/routes/budget/new";
import GenericMoney from "./GenericMoney";

export default function PickFinancing({ carId }: { carId: string | undefined }) {
  const data = useLoaderData() as LoaderData
  const [searchParams] = useSearchParams();
  const pickingCar = searchParams.get('pick') === 'car'

  if (carId && data.financingList) {
    return (
      <div>
        <hr className="m-4" />
        {
          data.financingList.map((financing: Financing) => (
            <Form method="post" key={financing.id} className="flex">
              <div >
                <div>{`${financing.name} ${financing.max_amount_percentage / 100}%`}| <GenericMoney num={financing.max_amount_flat} /></div>
              </div>
              <button
                name="pick-financing"
                disabled={pickingCar}
                value={financing.id}
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
          disabled={!carId || pickingCar}
          name="pick"
          value="financing"
          type="submit"
          className="block p-4 text-xl text-blue-500"
        >
          Pick Financing
        </button>
      </Form>
    )
  }
}