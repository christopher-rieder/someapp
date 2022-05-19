import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/server-runtime";
import GenericMoney from "~/components/GenericMoney";
import { getFinancingForCar, setBudgetFinancing } from "~/models/DraftBudget.server";
import { financingList } from "~/models/financing.server";
import { requireUserId } from "~/session.server";

export type LoaderData = {
  financingList?: financingList;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const financingList = await getFinancingForCar({ userId });
  const response = { financingList } as LoaderData
  return json<LoaderData>(response);
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  if (formData.has('pick-financing')) {
    const financingId = formData.get('pick-financing')
    if (typeof financingId === "string" && financingId.length > 0) {
      await setBudgetFinancing({ financingId, userId })
      return redirect('/budget/new')
    } else {
      return json({ errors: { pickFinancing: true } }, { status: 400 });
    }
  }

  return null
};

export default function PickFinancing() {
  const data = useLoaderData() as LoaderData
  const financingList = data.financingList

  if (financingList) {
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
  }
}