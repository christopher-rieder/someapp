import { Financing } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

export default function PickFinancing() {
  const fetcherPickFinancing = useFetcher()
  if (fetcherPickFinancing?.data?.financingList) {
    return (
      <div>
        <hr className="m-4" />
        {
          fetcherPickFinancing.data.financingList.map((financing: Financing) => (
            <fetcherPickFinancing.Form method="post" key={financing.id} className="flex">
              <div >
                <div>{`${financing.name} %${financing.max_amount_percentage}|$${financing.max_amount_flat}`}</div>
              </div>
              <button
                name="pick-financing"
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