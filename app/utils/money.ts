const dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function formatMoneyWithCents(a: number) {
    return dollarUS.format(a / 100)
}