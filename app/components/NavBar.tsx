import {Link, NavLink} from "react-router";
import {UserButton} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function NavBar() {
    return (
        <div className={"flex justify-center bg-neutral-200 sticky top-0 z-50"}>
            <div className={"p-4 flex justify-between items-center w-full max-w-7xl mx-auto"}>
                <div className={"flex gap-4 items-center"}>
                    <NavLink to={"/"} className={({ isActive }) => `${isActive ? 'font-bold' : ''}`}>Home</NavLink>
                </div>
                <div className={"flex gap-4 items-center"}>
                    <Link to={"/create"}>
                        <Button><Plus /> Create</Button>
                    </Link>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
