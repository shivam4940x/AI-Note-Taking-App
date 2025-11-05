import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { Logout } from "../utils/Logout";

const ProfileMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User style={{ width: "1.1rem", height: "1.1rem" }} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" sideOffset={6}>
        <div className="p-1 space-y-1 text-lg">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer red">
            <Logout />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
