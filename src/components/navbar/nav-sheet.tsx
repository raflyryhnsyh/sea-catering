import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import NavMenu from "./nav-menu";
import { useAuth } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IconDashboard, IconLogout } from "@tabler/icons-react";

export const NavigationSheet = () => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />
        <NavMenu orientation="vertical" className="" />

        {/* User Section in Mobile Sheet */}
        {user ? (
          <div className="mt-8 space-y-4">
            <Separator />
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>
                  {userData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard">
                  <IconDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/profile">
                  <IconDashboard className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600"
                onClick={handleLogOut}
                disabled={loading}
              >
                <IconLogout className="mr-2 h-4 w-4" />
                {loading ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <Separator />
            <div className="mt-4">
              <Button className="w-full" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};