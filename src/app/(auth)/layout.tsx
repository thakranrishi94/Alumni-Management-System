import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
        <main className="flex flex-col">
          {/* <Header /> */}
          <div className="flex-grow">
            {children}
          </div>
          {/* <Footer /> */}
          <Toaster />
        </main>
      
  );
}