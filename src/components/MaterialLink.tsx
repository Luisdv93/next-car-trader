import React from "react";
import Link from "next/link";
import { PaginationRenderItemParams } from "@material-ui/lab/Pagination";
import { ParsedUrlQuery } from "querystring";

export interface MaterialLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
  href: string;
  shallow: boolean;
}

export const MaterialLink = React.forwardRef<
  HTMLAnchorElement,
  MaterialLinkProps
>((props: MaterialLinkProps, ref) => {
  const { item, query, href, shallow = false, ...rest } = props;

  return (
    <Link
      href={{
        pathname: href,
        query: { ...query, page: item.page },
      }}
      shallow={shallow}
    >
      <a ref={ref} {...rest}></a>
    </Link>
  );
});
