const dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function formatMoneyWithCents(num: number) {
    return dollarUS.format(num / 100)
}