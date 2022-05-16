import { Link } from "@remix-run/react";

export default function BudgetListPage() {
    return (
        <main className="bg-white">
            <p className="lis">Budget List</p>
            <ul>
                <li>a</li>
                <li>b</li>
                <li>c</li>
                <li>d</li>
                <li>e</li>
            </ul>
            <Link to='new' className="nav-link block p-4 text-xl text-blue-500">
                New Budget
            </Link>
        </main>
    )
}