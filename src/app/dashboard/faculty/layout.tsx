import SideBar from "@/components/FacultySideBar";
import "../../globals.css";
import AdminMenu from "@/utils/FacultyMenu.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

          <SideBar title="Faculty Portal" sidebarMenus={AdminMenu}>
            {children}
          </SideBar>
  );
}