import { Header } from "@/components/layout/header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-auto flex max-w-[800px] flex-col justify-center pt-16">
      <Header />
      <div className="fixed -top-12 z-10 h-20 w-full bg-background" />
      {children}
    </div>
  );
}
