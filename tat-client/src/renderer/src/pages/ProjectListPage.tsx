import { ProjectTable } from '@/components/project/project-list'
import data from '@/assets/data.json'
import { ListCollapse } from 'lucide-react'

function ProjectListPage() {
  return (
    <div>
        <div className='flex items-center gap-2 mb-4'>
            <ListCollapse color='#1447e6' />
            <h1 className='font-semibold text-2xl'>Project List</h1>
        </div>
        <ProjectTable data={data} />
    </div>
  )
}

export default ProjectListPage