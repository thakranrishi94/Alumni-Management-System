import SideBar from "@/components/SideBar";
// import "../../globals.css";
import AdminMenu from "@/utils/AdminMenu.json";
// import { SessionProvider } from "next-auth/react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      
        <SideBar title="Admin Portal" sidebarMenus={AdminMenu}>
          {children}
        </SideBar>
     
  );
}

