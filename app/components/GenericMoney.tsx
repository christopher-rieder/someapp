import { formatMoneyWithCents } from "~/utils/money";

export default function GenericMoney({ num }: { num: number | undefined }) {
    if (!num || isNaN(num)) {
        return (
            <span>-</span>
        )
    }
    return (
        <span>{formatMoneyWithCents(num)}</span>
    )

}