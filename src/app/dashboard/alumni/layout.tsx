import SideBar from "@/components/AlumniSideBar";
import "../../globals.css";
import AdminMenu from "@/utils/AlumniMenu.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
          <SideBar title="Alumni Portal" sidebarMenus={AdminMenu}>
            {children}
          </SideBar>
      </body>
    </html>
  );
}