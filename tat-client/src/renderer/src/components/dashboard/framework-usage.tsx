'use client'

import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { getProjects, type ProjectResponse } from '@/lib/project-api'

import { toast } from 'sonner'

interface Framework {
  name: string
  count: number
  percentage: number
  color: string
}

const FRAMEWORK_COLORS = [
  'bg-blue-500',
  'bg-green-600',
  'bg-purple-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
]

export default function FrameworkUsage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)

  /*
   * Load projects from backend
   */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)

        const data = await getProjects()

        setProjects(data)
      } catch (error) {
        console.error('Failed to load framework usage:', error)

        toast.error(error instanceof Error ? error.message : 'Failed to load framework usage')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  /*
   * Calculate framework usage
   */
  const frameworks = useMemo<Framework[]>(() => {
    if (projects.length === 0) {
      return []
    }

    const technologyCounts: Record<string, number> = {}

    projects.forEach((project) => {
      const technology = project.technologyName?.trim() || 'Unknown'

      technologyCounts[technology] = (technologyCounts[technology] || 0) + 1
    })

    return Object.entries(technologyCounts)
      .map(([name, count], index) => ({
        name,
        count,
        percentage: Math.round((count / projects.length) * 100),
        color: FRAMEWORK_COLORS[index % FRAMEWORK_COLORS.length]
      }))
      .sort((a, b) => b.count - a.count)
  }, [projects])

  const totalProjects = projects.length

  const mostUsedFramework = frameworks[0]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Technology Usage</CardTitle>

        <CardDescription>
          Distribution of technologies used across all generated projects
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            Loading technology usage...
          </div>
        ) : frameworks.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No projects available.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Technology bars */}

            {frameworks.map((framework) => (
              <div key={framework.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{framework.name}</span>

                  <span className="text-sm font-bold text-muted-foreground">
                    {framework.percentage}%
                  </span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${framework.color}`}
                    style={{
                      width: `${framework.percentage}%`
                    }}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  {framework.count} {framework.count === 1 ? 'project' : 'projects'}
                </div>
              </div>
            ))}

            {/* Summary */}

            <div className="pt-6 mt-8 border-t">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {frameworks.slice(0, 4).map((framework) => (
                  <div key={`stat-${framework.name}`} className="text-center">
                    <div className="text-2xl font-bold">{framework.count}</div>

                    <div className="mt-1 text-xs text-muted-foreground">{framework.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight */}

            <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">💡 Insight:</span>{' '}
                {mostUsedFramework ? (
                  <>
                    {mostUsedFramework.name} is currently the most used technology with{' '}
                    {mostUsedFramework.count}{' '}
                    {mostUsedFramework.count === 1 ? 'project' : 'projects'} (
                    {mostUsedFramework.percentage}% of all projects).
                  </>
                ) : (
                  'No technology usage data available.'
                )}
              </p>
            </div>

            {/* Total */}

            <div className="text-xs text-center text-muted-foreground">
              Total Projects: {totalProjects}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
