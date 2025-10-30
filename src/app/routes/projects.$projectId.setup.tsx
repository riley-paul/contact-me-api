import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/setup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/setup"!</div>
}
