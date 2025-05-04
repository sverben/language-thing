import {Link} from "react-router";
import {UserButton} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function NavBar() {
    return (
        <div className={"flex justify-between items-center p-4 bg-sidebar"}>
            <div className={"flex gap-4 items-center"}>
                <Link to={"/"}>Home</Link>
            </div>
            <div className={"flex gap-4 items-center"}>
                <Button><Plus /> Create</Button>
                <UserButton />
            </div>
        </div>
    )
}
