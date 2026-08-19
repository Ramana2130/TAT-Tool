import {
  IconCircleCheck,
  IconFolder,
  IconLoader2,
  IconTrendingDown,
  IconTrendingUp,
  IconX
} from '@tabler/icons-react'

import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { getProjects, type ProjectResponse } from '@/lib/project-api'

import { toast } from 'sonner'

export function Stats() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])

  const [loading, setLoading] = useState(true)

  /*
   * Load projects
   */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects()

        setProjects(data)
      } catch (error) {
        console.error('Failed to load project stats:', error)

        toast.error(error instanceof Error ? error.message : 'Failed to load project statistics')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  /*
   * Project statistics
   */
  const totalProjects = projects.length

  const createdProjects = projects.filter(
    (project) => project.status.toUpperCase() === 'CREATED'
  ).length

  const creatingProjects = projects.filter(
    (project) => project.status.toUpperCase() === 'CREATING'
  ).length

  const failedProjects = projects.filter(
    (project) => project.status.toUpperCase() === 'FAILED'
  ).length

  /*
   * Created percentage
   */
  const createdPercentage =
    totalProjects > 0 ? Math.round((createdProjects / totalProjects) * 100) : 0

  /*
   * Failed percentage
   */
  const failedPercentage =
    totalProjects > 0 ? Math.round((failedProjects / totalProjects) * 100) : 0

  return (
    <div
      className="
        grid
        grid-cols-4
        gap-4
        px-4

        @xl/main:grid-cols-2
        @5xl/main:grid-cols-4

        lg:px-1

        *:data-[slot=card]:bg-gradient-to-t
        *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card
        *:data-[slot=card]:shadow-xs

        dark:*:data-[slot=card]:bg-card
      "
    >
      {/* TOTAL PROJECTS */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects</CardDescription>

          <CardTitle
            className="
              text-2xl
              font-semibold
              tabular-nums
              @[250px]/card:text-3xl
            "
          >
            {loading ? '—' : totalProjects}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <IconFolder />
              Projects
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter
          className="
            flex-col
            items-start
            gap-1.5
            text-sm
          "
        >
          <div className="flex gap-2 font-medium line-clamp-1">
            All projects created through TAT
            <IconFolder className="size-4" />
          </div>

          <div className="text-muted-foreground">React and other supported technologies</div>
        </CardFooter>
      </Card>

      {/* CREATED PROJECTS */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Created Projects</CardDescription>

          <CardTitle
            className="
              text-2xl
              font-semibold
              tabular-nums
              @[250px]/card:text-3xl
            "
          >
            {loading ? '—' : createdProjects}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {createdPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter
          className="
            flex-col
            items-start
            gap-1.5
            text-sm
          "
        >
          <div className="flex gap-2 font-medium line-clamp-1">
            Successfully created projects
            <IconCircleCheck className="size-4" />
          </div>

          <div className="text-muted-foreground">{createdPercentage}% of all projects</div>
        </CardFooter>
      </Card>

      {/* CREATING PROJECTS */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Creating Projects</CardDescription>

          <CardTitle
            className="
              text-2xl
              font-semibold
              tabular-nums
              @[250px]/card:text-3xl
            "
          >
            {loading ? '—' : creatingProjects}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <IconLoader2 />
              Processing
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter
          className="
            flex-col
            items-start
            gap-1.5
            text-sm
          "
        >
          <div className="flex gap-2 font-medium line-clamp-1">
            Projects currently being created
            <IconLoader2 className="size-4" />
          </div>

          <div className="text-muted-foreground">TAT project generation in progress</div>
        </CardFooter>
      </Card>

      {/* FAILED PROJECTS */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Failed Projects</CardDescription>

          <CardTitle
            className="
              text-2xl
              font-semibold
              tabular-nums
              @[250px]/card:text-3xl
            "
          >
            {loading ? '—' : failedProjects}
          </CardTitle>

          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {failedPercentage}%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter
          className="
            flex-col
            items-start
            gap-1.5
            text-sm
          "
        >
          <div className="flex gap-2 font-medium line-clamp-1">
            Projects that failed
            <IconX className="size-4" />
          </div>

          <div className="text-muted-foreground">Requires attention</div>
        </CardFooter>
      </Card>
    </div>
  )
}
