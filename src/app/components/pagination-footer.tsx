import type { PaginationInfo } from "@/lib/types";
import { IconButton, Text } from "@radix-ui/themes";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";

type Props = {
  pagination: PaginationInfo;
  setPage: (page: number) => void;
};

const PaginationFooter: React.FC<Props> = ({
  pagination: { page, numPages },
  setPage,
}) => {
  const nextDisabled = page >= numPages;
  const prevDisabled = page <= 1;

  return (
    <footer className="flex items-start justify-between gap-4">
      <section>
        <Text size="1" color="gray">
          Page {page} of {numPages}
        </Text>
      </section>
      <section className="flex items-center gap-2">
        <IconButton
          variant="soft"
          disabled={prevDisabled}
          onClick={() => setPage(1)}
        >
          <ChevronFirstIcon className="size-4" />
        </IconButton>
        <IconButton
          variant="soft"
          disabled={prevDisabled}
          onClick={() => setPage(Math.max(1, page - 1))}
        >
          <ChevronLeftIcon className="size-4" />
        </IconButton>
        <IconButton
          variant="soft"
          disabled={nextDisabled}
          onClick={() => setPage(Math.min(numPages, page + 1))}
        >
          <ChevronRightIcon className="size-4" />
        </IconButton>
        <IconButton
          variant="soft"
          disabled={nextDisabled}
          onClick={() => setPage(numPages)}
        >
          <ChevronLastIcon className="size-4" />
        </IconButton>
      </section>
    </footer>
  );
};

export default PaginationFooter;
