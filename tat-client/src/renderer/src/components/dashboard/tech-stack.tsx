import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const techStacks = {
  python: [
    "Django",
    "Flask",
    "FastAPI",
  ],
  java: [
    "Spring Boot",
    "JUnit",
    "Gradle",
  ],
  javascript: [
    "React.js",
    "Next.js",
    "TypeScript",
  ],
  libraries: [
    "TailWindCSS",
    "Shadcn/ui",
    "Lucide-react"
  ],
  database: [
    "MySQL",
    "NoSQL",
  ],
}

export function TechStack() {
  return (
    <Tabs defaultValue="python" className="w-full max-w-2xl mx-auto">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="java">Java</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="database">Database</TabsTrigger>
        <TabsTrigger value="libraries">Libraries</TabsTrigger>
      </TabsList>

      {Object.entries(techStacks).map(([key, technologies]) => (
        <TabsContent key={key} value={key}>
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{key}</CardTitle>
              <CardDescription>
                Popular frameworks and libraries for {key} development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {technologies.map((tech, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm py-2 px-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{tech}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
