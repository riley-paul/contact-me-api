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
  url: URL;
  searchParamId?: string;
};

const PaginationFooter: React.FC<Props> = ({
  pagination: { page, numPages },
  url,
  searchParamId,
}) => {
  const getUrlWithPage = (page: number) => {
    const newUrl = new URL(url.toString());
    newUrl.searchParams.set(searchParamId ?? "page", page.toString());
    return newUrl.toString();
  };

  return (
    <footer className="flex items-center justify-between gap-4">
      <section>
        <Text size="1" color="gray">
          Page {page} of {numPages}
        </Text>
      </section>
      <section className="flex items-center gap-2">
        <IconButton variant="soft" disabled={page <= 1} asChild>
          <a href={getUrlWithPage(1)}>
            <ChevronFirstIcon className="size-4" />
          </a>
        </IconButton>
        <IconButton variant="soft" disabled={page <= 1} asChild>
          <a href={getUrlWithPage(Math.max(1, page - 1))}>
            <ChevronLeftIcon className="size-4" />
          </a>
        </IconButton>
        <IconButton variant="soft" disabled={page >= numPages} asChild>
          <a href={getUrlWithPage(Math.min(numPages, page + 1))}>
            <ChevronRightIcon className="size-4" />
          </a>
        </IconButton>
        <IconButton variant="soft" disabled={page >= numPages} asChild>
          <a href={getUrlWithPage(numPages)}>
            <ChevronLastIcon className="size-4" />
          </a>
        </IconButton>
      </section>
    </footer>
  );
};

export default PaginationFooter;
