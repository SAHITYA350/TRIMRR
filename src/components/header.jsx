import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";
const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();

  const { loading, fn:fnLogout } = useFetch(logout);

  return (
   <>
      <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-16" alt="Trimrr Logo" />
      </Link>

     <div className="flex gap-4 cursor-pointer">
        {!user ? 
      <Button onClick={() => navigate("/auth")} className="cursor-pointer">
        Login
      </Button>    
       : (
            <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full cursor-pointer w-8 overflow-hidden select-none">

                <Avatar>
  <AvatarImage src={user?.user_metadata?.profile_pic} alt="Avatar" className="object-contain" />
  <AvatarFallback>{user?.user_metadata?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
</Avatar>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
               <DropdownMenuItem>
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/");
                    })
                  }}>
                    Logout
                  </span> 
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
       ) 
     }
     </div>
    </nav>
     {loading && <BarLoader className="mb-4" width={"100%"} color="#fff" />}
   </>
  );
};

export default Header;




