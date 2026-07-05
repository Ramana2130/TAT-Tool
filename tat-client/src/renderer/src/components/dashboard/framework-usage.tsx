'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Framework {
  name: string
  percentage: number
  color: string
}

const frameworks: Framework[] = [
  { name: 'React', percentage: 42, color: 'bg-blue-500' },
  { name: 'Spring Boot', percentage: 23, color: 'bg-green-600' },
  { name: 'Electron', percentage: 18, color: 'bg-purple-500' },
  { name: 'Next.js', percentage: 10, color: 'bg-slate-900 dark:bg-slate-100' },
  { name: 'Node.js', percentage: 7, color: 'bg-amber-600' },
]

export default function FrameworkUsage() {
  const totalPercentage = frameworks.reduce((sum, fw) => sum + fw.percentage, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Framework Usage</CardTitle>
        <CardDescription>
          Distribution of frameworks used across all generated projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {frameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              {/* Framework Name and Percentage */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-50">
                  {framework.name}
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {framework.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${framework.color}`}
                  style={{ width: `${framework.percentage}%` }}
                />
              </div>
            </div>
          ))}

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {frameworks.map((framework) => (
                <div key={`stat-${framework.name}`} className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {framework.percentage}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {framework.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Insight:</span> React is the most popular framework across your projects, followed by Spring Boot for backend development.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
