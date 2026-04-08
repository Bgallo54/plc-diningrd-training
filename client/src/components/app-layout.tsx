import { Link, useLocation } from "wouter";
import { Home, UtensilsCrossed, ClipboardList, Tablet, BookOpen, GraduationCap, Users, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { modules } from "@/lib/training-data";
import plcLogo from "@assets/plc-logo.jpg";

const iconMap: Record<string, any> = {
  Home, UtensilsCrossed, ClipboardList, Tablet, BookOpen,
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: GraduationCap },
    ...modules.map(m => ({
      href: `/module/${m.id}`,
      label: m.title,
      icon: iconMap[m.icon] || BookOpen,
    })),
    { href: "/resident-guide", label: "Resident Customization", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border
        flex flex-col transition-transform duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={plcLogo} alt="Priority Life Care" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <div className="font-semibold text-sm text-sidebar-foreground leading-tight">Priority Life Care</div>
              <div className="text-xs text-sidebar-foreground/60 leading-tight">DiningRD Training</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">Training Modules</div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMobileOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors
                      ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }
                    `} data-testid={`nav-${item.href.replace(/\//g, "-")}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <a
            href="https://app.diningmanager.com/training"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-primary transition-colors"
            data-testid="link-diningrd-training"
          >
            <BookOpen className="w-3.5 h-3.5" />
            DiningRD Training Library
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 p-4 border-b bg-card">
          <button onClick={() => setMobileOpen(true)} className="p-1" data-testid="button-mobile-menu">
            <Menu className="w-5 h-5" />
          </button>
          <img src={plcLogo} alt="PLC" className="w-7 h-7 rounded-md object-cover" />
          <span className="font-semibold text-sm">PLC DiningRD Training</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
