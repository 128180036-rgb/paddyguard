import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Cpu,
  History,
  LayoutDashboard,
  Microscope,
  Settings,
  Upload,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description?: string
  badge?: string
}

export type NavGroup = { label: string; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Live Monitoring', href: '/monitoring', icon: Activity, description: 'Latest robot capture, upload and processing progress streamed over WebSockets.' },
      { title: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Sample-based crop health ratios by robot, field and period with historical comparison.' },
    ],
  },
  {
    label: 'Detection',
    items: [
      { title: 'Upload & Process', href: '/upload', icon: Upload, description: 'Drag-and-drop JPG/PNG upload, 64×64 preprocessing, INT8 quantization and .mem/.bin export.' },
      { title: 'Results', href: '/results', icon: Microscope, description: 'Per-image disease class, hardware source, inference job and processing duration.' },
      { title: 'History', href: '/history', icon: History, description: 'Searchable, sortable and exportable history of images and detections.' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Robots', href: '/robots', icon: Bot, description: 'Register robots and track heartbeat, battery, missions and upload status.' },
      { title: 'Hardware Monitor', href: '/hardware', icon: Cpu, description: 'KV260 gateway, FPGA controller and ASIC status with diagnostic actions.' },
      { title: 'Notifications', href: '/notifications', icon: Bell, badge: '7', description: 'Disease, hardware and robot alerts with email/SMS delivery status.' },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Profile', href: '/profile', icon: UserRound },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

export const PLANNED_MODULES = ALL_NAV_ITEMS.filter((i) => i.description)
