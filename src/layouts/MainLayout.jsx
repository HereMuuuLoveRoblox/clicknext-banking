import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Wallet, History, LogOut } from 'lucide-react'
import { removeCookie } from '@/lib/cookie'
import { Button } from '@/components/ui/button'
import clicknextLogo from '@/assets/icons/clicknext-logo.png'
import clicknextLogo2 from '@/assets/icons/clicknext-logo-2.png'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  const navigate = useNavigate()

  const currentTitle = menuItems.find((item) => item.url === location.pathname)?.title

  const handleLogout = () => {
    removeCookie('email')
    navigate('/login', { replace: true })
  }

  return (
    <SidebarProvider>
      <Sidebar  collapsible="icon">
        <SidebarHeader className="flex h-14 mt-2 items-center justify-center overflow-hidden border-b">
          <img
            src={clicknextLogo}
            alt="ClickNext Logo"
            className="h-7 w-auto group-data-[collapsible=icon]:hidden"
          />
          <img
            src={clicknextLogo2}
            alt="ClickNext Logo"
            className="hidden h-auto w-10 group-data-[collapsible=icon]:block"
          />
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
        <SidebarFooter>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
          >
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-base font-semibold">{currentTitle}</h1>
        </header>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout
