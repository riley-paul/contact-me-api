import { Text } from "@radix-ui/themes";
import { SearchXIcon } from "lucide-react";
import React from "react";

type Props = React.PropsWithChildren<{ isSearching?: boolean }>;

const EmptyState: React.FC<Props> = ({ isSearching }) => {
  if (isSearching) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <SearchXIcon className="text-accent-7 size-12" />
        <Text size="2" color="gray" className="max-w-xs" align="center">
          No results found. Try adjusting your search or filter to find what
          you're looking for.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Text size="2" color="gray" className="max-w-xs" align="center">
        No results found.
      </Text>
    </div>
  );
};

export default EmptyState;
