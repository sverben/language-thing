import {Link} from "react-router";
import {UserButton} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function NavBar() {
    return (
        <div className={"flex justify-center bg-neutral-200"}>
            <div className={"p-4 flex justify-between items-center w-full max-w-7xl mx-auto"}>
                <div className={"flex gap-4 items-center"}>
                    <Link to={"/"}>Home</Link>
                </div>
                <div className={"flex gap-4 items-center"}>
                    <Button><Plus /> Create</Button>
                    <UserButton />
                </div>
            </div>
        </div>
    )
}
