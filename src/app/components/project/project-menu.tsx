import useMutations from "@/lib/client/use-mutations";
import type { ProjectSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai/react";
import {
  MoreHorizontalIcon,
  Edit2Icon,
  DeleteIcon,
  CopyPlusIcon,
  ViewIcon,
} from "lucide-react";
import React from "react";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  project: ProjectSelect;
};

const ProjectMenu: React.FC<Props> = ({ project }) => {
  const { deleteProject } = useMutations();
  const navigate = useNavigate();
  const [_, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDelete = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Project",
        message: `Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`,
        handleDelete: () => deleteProject.mutate({ projectId: project.id }),
      },
    });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" className="m-0!">
          <MoreHorizontalIcon className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="end" className="min-w-32">
        <DropdownMenu.Item
          onSelect={() =>
            navigate({
              to: "/projects/$projectId",
              params: { projectId: project.id },
            })
          }
        >
          <ViewIcon className="size-4 opacity-70" />
          <span>View</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Edit2Icon className="size-4 opacity-70" />
          <span>Edit</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <CopyPlusIcon className="size-4 opacity-70" />
          <span>Duplicate</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onSelect={handleDelete}>
          <DeleteIcon className="size-4 opacity-70" />
          <span>Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ProjectMenu;
