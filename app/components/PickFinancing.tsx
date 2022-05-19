import { Form, useSearchParams } from "@remix-run/react";
import { financingList } from "~/models/financing.server";
import GenericMoney from "./GenericMoney";

type props = {
  carId?: string
  financingList?: financingList
}
export default function PickFinancing({ carId, financingList }: props) {
  const [searchParams] = useSearchParams();
  const pickingCar = searchParams.get('pick') === 'car'

  if (carId && financingList && !pickingCar) {
    return (
      <div>
        <hr className="m-4" />
        {
          financingList.map((financing) => (
            <Form method="post" key={financing.id} className="flex">
              <div >
                <div>{`${financing.name} ${financing.max_amount_percentage / 100}%`}| <GenericMoney num={financing.max_amount_flat} /></div>
              </div>
              <button
                name="pick-financing"
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
      <Form>
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