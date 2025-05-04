import NavBar from "@/components/NavBar";
import {Outlet} from "react-router";

export default function Layout() {
    return (
        <div className={'flex flex-col h-screen'}>
            <NavBar />
            <main className={'p-4 w-full max-w-7xl mx-auto flex-1'}>
                <Outlet />
            </main>
        </div>
    )
}
