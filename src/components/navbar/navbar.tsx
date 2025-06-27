import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import NavMenu from "./nav-menu";
import { NavigationSheet } from "./nav-sheet";
import ThemeToggle from "@/components/theme/theme-switcher";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { IconUserCircle, IconLogout, IconDashboard } from "@tabler/icons-react";
import { ChevronsUpDown } from "lucide-react";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();

  const handleLogOut = async () => {
    await signOut();
  };

  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    avatar: user?.user_metadata?.avatar_url || ""
  };

  return (
    <nav className="fixed top-6 inset-x-4 h-16 z-50 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Show profile dropdown if logged in, otherwise show Get Started button */}
          {user ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full h-10 px-3 gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="text-xs">
                        {userData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm">
                      {userData.name}
                    </span>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>
                          {userData.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{userData.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userData.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <IconDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <IconUserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    disabled={loading}
                    className="text-red-600 focus:text-red-600"
                  >
                    <IconLogout className="mr-2 h-4 w-4" />
                    {loading ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;