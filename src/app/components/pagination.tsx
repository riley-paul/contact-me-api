import type { PaginationInfo } from "@/lib/types";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

type Props = {
  pagination: PaginationInfo;
  setPage: (page: number) => void;
};

const Pagination: React.FC<Props> = ({
  pagination: { page, numPages },
  setPage,
}) => {
  const nextDisabled = page >= numPages;
  const prevDisabled = page <= 1;

  return (
    <footer className="flex shrink-0 items-start justify-between gap-4">
      <section>
        <span className="text-muted-foreground text-xs">
          Page {page} of {numPages}
        </span>
      </section>
      <section className="flex items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={prevDisabled}
          onClick={() => setPage(1)}
        >
          <ChevronFirstIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={prevDisabled}
          onClick={() => setPage(Math.max(1, page - 1))}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={nextDisabled}
          onClick={() => setPage(Math.min(numPages, page + 1))}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={nextDisabled}
          onClick={() => setPage(numPages)}
        >
          <ChevronLastIcon className="size-4" />
        </Button>
      </section>
    </footer>
  );
};

export default Pagination;
