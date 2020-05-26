import { useRouter } from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { MaterialLink } from "./MaterialLink";

import { getAsString } from "../getAsString";

export interface CardPaginationProps {
  totalPages: number;
  href: string;
  shallow: boolean;
}

export const CardPagination = (props: CardPaginationProps) => {
  const { totalPages, href, shallow } = props;

  const { query } = useRouter();

  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialLink}
          query={query}
          item={item}
          href={href}
          shallow={shallow}
          {...item}
        />
      )}
    />
  );
};
