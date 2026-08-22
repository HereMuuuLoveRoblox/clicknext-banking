import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Wallet, History } from 'lucide-react'
import clicknextLogo from '@/assets/icons/clicknext-logo.png'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const menuItems = [
  { title: 'Deposit / Withdraw', url: '/deposit-withdraw', icon: Wallet },
  { title: 'Transaction', url: '/transaction', icon: History },
]

function MainLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader className="flex h-14 mt-2 items-center justify-center border-b">
          <img src={clicknextLogo} alt="ClickNext Logo" className="h-auto w-[80%]" />
        </SidebarHeader>


        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={location.pathname === item.url}
                      render={<NavLink to={item.url} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>


      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
