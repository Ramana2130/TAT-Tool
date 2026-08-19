import { useEffect, useState } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

import { getProjects, type ProjectResponse } from '@/lib/project-api'

import { toast } from 'sonner'

export function RecentProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)

  /*
   * Load projects
   */
  useEffect(() => {
    const loadRecentProjects = async () => {
      try {
        setLoading(true)

        const data = await getProjects()

        /*
         * Sort newest first
         * and take only latest 5
         */
        const recentProjects = [...data]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setProjects(recentProjects)
      } catch (error) {
        console.error('Failed to load recent projects:', error)

        toast.error(error instanceof Error ? error.message : 'Failed to load recent projects')
      } finally {
        setLoading(false)
      }
    }

    loadRecentProjects()
  }, [])

  /*
   * Status badge
   */
  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CREATED':
        return 'default'

      case 'CREATING':
        return 'secondary'

      case 'RUNNING':
        return 'secondary'

      case 'FAILED':
        return 'destructive'

      default:
        return 'outline'
    }
  }

  /*
   * Format creation date
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <Table>
      <TableCaption>Your 5 most recently created projects.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>

          <TableHead>Technology</TableHead>

          <TableHead>Status</TableHead>

          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              Loading projects...
            </TableCell>
          </TableRow>
        ) : projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
              No projects created yet.
            </TableCell>
          </TableRow>
        ) : (
          projects.map((project) => (
            <TableRow key={project.id}>
              {/* Project Name */}

              <TableCell className="font-medium">{project.projectName}</TableCell>

              {/* Technology */}

              <TableCell>{project.technologyName}</TableCell>

              {/* Status */}

              <TableCell>
                <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
              </TableCell>

              {/* Creation */}

              <TableCell>{formatDate(project.createdAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
