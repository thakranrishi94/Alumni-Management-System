import SideBar from "@/components/SideBar";
import "../../globals.css";
import AdminMenu from "@/utils/AdminMenu.json";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
          <SideBar title="Admin Portal" sidebarMenus={AdminMenu}>
            {children}
          </SideBar>
      </body>
    </html>
  );
}

