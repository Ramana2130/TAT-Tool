import FrameworkUsage from '@/components/dashboard/framework-usage'
import { RecentProjects } from '@/components/dashboard/recent-project'
import { Stats } from '@/components/dashboard/stats'
import { TechStack } from '@/components/dashboard/tech-stack'
import ProjectCreateForm from '@/components/project/project-create-form'
import { Card } from '@/components/ui/card'
import { Clock2, LayoutDashboard, MemoryStick } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      <header className="flex justify-between items-center px-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center justify-between gap-2 pb-3">
          <LayoutDashboard className="items-center" color="#155dfc" />
          <h1 className="items-center text-xl font-semibold">Dashboard</h1>
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
        <Stats />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 py-2">
              <MemoryStick color="#155dfc" />
              <h1 className="text-xl font-semibold">Tech Stack Available</h1>
            </div>
            <TechStack />
          </div>
          <div>
            <div className="flex items-center gap-2 py-2">
              <Clock2 color="#155dfc" />
              <h1 className="text-xl font-semibold">Recent Projects</h1>
            </div>
            <Card className="p-2 shadow-sm">
              <div>
                <RecentProjects />
              </div>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FrameworkUsage />
          </div>
          <div className="">
            <ProjectCreateForm />
          </div>
        </div>
        {/* <div className="flex-1 min-h-screen rounded-xl bg-muted/50 md:min-h-min" /> */}
      </div>
    </div>
  )
}
