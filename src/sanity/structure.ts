import type { StructureResolver } from "sanity/structure";
import { BasketIcon } from "@sanity/icons/Basket";
import { PackageIcon } from "@sanity/icons/Package";
import { TagIcon } from "@sanity/icons/Tag";
import { HomeIcon } from "@sanity/icons/Home";
import { ORDER_STATUSES } from "./schemaTypes/order";

// Studio sidebar: orders first (grouped by status), then the catalogue, then the homepage.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Apna Kitchen")
    .items([
      S.listItem()
        .title("Orders")
        .icon(BasketIcon)
        .child(
          S.list()
            .title("Orders")
            .items([
              ...ORDER_STATUSES.map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(`orders-${s.value}`)
                  .child(
                    S.documentList()
                      .title(s.title)
                      .schemaType("order")
                      .filter('_type == "order" && status == $status')
                      .params({ status: s.value })
                      .defaultOrdering([{ field: "placedAt", direction: "desc" }])
                      .canHandleIntent(() => false),
                  ),
              ),
              S.divider(),
              S.listItem()
                .title("All orders")
                .id("orders-all")
                .child(
                  S.documentTypeList("order")
                    .title("All orders")
                    .defaultOrdering([{ field: "placedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("product").title("Products").icon(PackageIcon),
      S.documentTypeListItem("category").title("Categories").icon(TagIcon),
      S.divider(),
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homepage").documentId("homepage").title("Homepage")),
    ]);
