"use client";

import {
  Cloud,
  ShieldAlert,
  HelpCircle,
  LayoutDashboard,
  CloudAlert,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigation } from "@/components/providers/NavigationContext";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Weather",
    icon: CloudAlert,
  },
  {
    name: "Precautions",
    icon: ShieldAlert,
  },
  // {
  //   name: "idk what to add 2",
  //   icon: FileQuestion,
  // },
  // {
  //   name: "idk what to add final",
  //   icon: FileQuestion,
  // },
];

const FooterLinks = [
  {
    name: "Help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  const { currentPage, setCurrentPage } = useNavigation();
  const { isMobile: isSidebarMobile, state } = useSidebar();
  return (
    <Sidebar collapsible={isSidebarMobile ? "offcanvas" : "icon"}>
      <SidebarContent>
        <Link href={"/"}>
          <SidebarHeader className="text-lg font-bold flex flex-row items-center gap-2 m-4 !p-0 overflow-hidden">
            <div className="w-8 h-8 flex justify-center items-center">
              <Cloud />
            </div>
            <p
              className={`text-nowrap logoFace ${
                state == "collapsed" ? "" : ""
              }`}
            >
              Burst Prediction
            </p>
          </SidebarHeader>
        </Link>

        <SidebarMenu className="gap-3">
          {Links.map((link) => (
            <SidebarMenuItem key={link.name} className="flex mx-3">
              <SidebarMenuButton
                onClick={() => setCurrentPage(link.name)}
                variant={"outline"}
                tooltip={link.name}
                className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 ${
                  currentPage.name === link.name
                    ? "border border-blue-300 bg-blue-50"
                    : ""
                }`}
              >
                <link.icon size={20} />
                <div className="pl-[2px]">{link.name}</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex-grow"></div>
        <SidebarFooter className="gap-3 m-0 p-0">
          {FooterLinks.map((link) => (
            <SidebarMenuItem key={link.name} className="flex mx-3">
              <SidebarMenuButton
                onClick={() => setCurrentPage(link.name)}
                variant={"outline"}
                tooltip={link.name}
                className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 ${
                  currentPage.name === link.name
                    ? "border border-blue-300 bg-blue-50"
                    : ""
                }`}
              >
                <link.icon size={20} />
                <div className="pl-[2px]">{link.name}</div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarSeparator />
          <SidebarMenuItem className="flex mx-3 mb-3">
            <SidebarMenuButton
              variant="outline"
              className={`hover:scale-105 transition-all text-nowrap p-2.5 size-10 w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10`}
              onClick={logout}
              tooltip={"Log Out"}
            >
              <LogOut className="h-5 w-5" />
              <div className="pl-[2px]">Log Out</div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
