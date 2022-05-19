import { Financing } from "@prisma/client"
import { Form, useActionData } from "@remix-run/react"
import classNames from "classnames"
import GenericMoney from "~/components/GenericMoney"
import { DraftBudgetErrors } from "~/models/DraftBudget.server"

type props = {
    financing?: Financing
    amount_financed: number
    max_amount_financed: number
    errors?: DraftBudgetErrors
    children: React.ReactChild
}

export default function FinancingCard({ children, financing, amount_financed, max_amount_financed, errors }: props) {
    const adata = useActionData()

    return (
        <section className="flex-1">
            {financing ? (
                <div className="financing-card">
                    <div>picked: {financing.name}</div>
                    <div>max: <GenericMoney num={financing.max_amount_flat} /></div>
                    <div>max: {financing.max_amount_percentage / 100}%</div>
                    <Form method="post">
                        <label htmlFor="amount_financed">Amount Financed: </label>
                        <input
                            defaultValue={amount_financed / 100}
                            className={classNames("money-input", { "text-red-700": errors?.amountFinanced })}
                            type="number"
                            name="amount_financed"
                            id="amount_financed"
                            max={max_amount_financed / 100}
                            min={0}
                            step="0.01"
                        />
                        <button type="submit">Set</button>
                        {errors?.amountFinanced ? (
                            <div className="text-red-700">
                                ERROR| max: {errors.amountFinanced.max} | provided: {errors.amountFinanced.providedValue} | saved: {amount_financed / 100}
                            </div>
                        ) : null}
                        {adata?.errors ? (
                            <div className="text-red-700">
                                ERROR {adata?.errors}
                            </div>
                        ) : null}
                    </Form>
                </div>
            ) : (
                <span className="not-selection">financing not selected</span>
            )}
            {children}
        </section>
    )
}