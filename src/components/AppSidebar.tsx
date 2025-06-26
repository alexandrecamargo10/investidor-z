
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Wallet,
  Settings,
  HelpCircle,
  Home,
  Plus
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Carteira", url: "/portfolio", icon: Wallet },
  { title: "Adicionar Ativo", url: "/add-asset", icon: Plus },
  { title: "Análises", url: "/analytics", icon: BarChart3 },
  { title: "Relatórios", url: "/reports", icon: PieChart },
  { title: "Dividendos", url: "/dividends", icon: TrendingUp },
];

const bottomItems = [
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Ajuda", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-financialBlue-50 text-financialBlue-700 font-medium border-r-2 border-financialBlue-600" 
      : "hover:bg-slate-100 text-slate-700";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <SidebarContent className="bg-white border-r">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium px-4 py-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-2.5 rounded-r-lg mr-2 transition-all
                        ${getNavClassName({ isActive })}
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-2.5 rounded-r-lg mr-2 transition-all
                        ${getNavClassName({ isActive })}
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
