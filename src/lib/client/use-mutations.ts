import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { qProject, qProjects } from "./queries";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";

export default function useMutations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { projectId: currentProjectId } = useParams({ strict: false });

  const deleteProject = useMutation({
    mutationFn: actions.projects.remove,
    onSuccess: (_, { projectId }) => {
      if (currentProjectId === projectId) navigate({ to: "/projects" });
      queryClient.setQueryData(qProjects().queryKey, (prev) => {
        if (!prev) return prev;
        return prev.filter((project) => project.id !== projectId);
      });
      toast.success("Project deleted");
    },
  });

  return { deleteProject };
}
