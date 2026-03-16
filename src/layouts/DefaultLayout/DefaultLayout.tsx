import type { ReactNode } from "react";
import type { Menu } from "../../routes/RouteConfig";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "~/layouts/DefaultLayout/components/Breadcrumb";
interface DefaultLayoutProps {
  children: ReactNode;
  menus: Menu[];
  breadcrumb?: any[];
}

export default function DefaultLayout({
  children,
  menus,
  breadcrumb,
}: DefaultLayoutProps) {
  return (
    <section>
      <Header />
      <div className="flex mt-4">
        {menus && <Sidebar menus={menus} />}
        <main className={`${menus ? "w-[85%]" : "w-[100%]"} min-h-[80vh]`}>
          {menus ? (
            <>
              <div
                className="m-4 mt-0 p-4 shadow-md rounded-md"
                style={{ backgroundColor: "var(--header-bg)" }}
              >
                <Breadcrumb items={breadcrumb} />
              </div>
              <div
                className="m-4 mt-0 p-4 shadow-md rounded-md "
                style={{ backgroundColor: "var(--header-bg)" }}
              >
                {children}
              </div>
            </>
          ) : (
            <div>{children}</div>
          )}
        </main>
      </div>
    </section>
  );
}
