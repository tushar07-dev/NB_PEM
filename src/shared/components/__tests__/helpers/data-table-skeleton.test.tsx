import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTableSkeleton } from "../data-table-skeleton";

describe("DataTableSkeleton", () => {
  it("renders correct number of header and body cells", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={4} rowCount={5} />
    );
    // 1 header row + 5 body rows = 6 rows total, each with 4 cells
    const cells = container.querySelectorAll("td, th");
    expect(cells.length).toBe(4 + 4 * 5); // 4 header + 20 body = 24
  });

  it("renders filter skeletons equal to filterCount", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} filterCount={3} />
    );
    // filterCount skeletons in toolbar area
    const toolbarSkeletons = container.querySelector(".flex.flex-1")?.children;
    expect(toolbarSkeletons?.length).toBe(3);
  });

  it("does not render filter skeletons when filterCount is 0", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} filterCount={0} />
    );
    const toolbarFlex = container.querySelector(".flex.flex-1");
    expect(toolbarFlex?.children.length).toBe(0);
  });

  it("renders pagination skeletons by default", () => {
    const { container } = render(<DataTableSkeleton columnCount={2} />);
    // Pagination wrapper exists — look for the bottom flex row
    const bottomRow = container.querySelectorAll(
      ".flex.w-full.items-center.justify-between"
    );
    expect(bottomRow.length).toBeGreaterThan(0);
  });

  it("does not render pagination when withPagination=false", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} withPagination={false} />
    );
    const allFlexRows = container.querySelectorAll(
      ".flex.w-full.items-center.justify-between"
    );
    // With no pagination, the bottom section should be absent
    // The toolbar flex row is justify-between too, but it has gap-2 not gap-4
    const paginationRows = Array.from(allFlexRows).filter((el) =>
      el.className.includes("gap-4")
    );
    expect(paginationRows.length).toBe(0);
  });

  it("renders view options skeleton by default", () => {
    const { container } = render(<DataTableSkeleton columnCount={2} />);
    const viewOptionsSkeleton = container.querySelector(".ml-auto.hidden");
    expect(viewOptionsSkeleton).toBeInTheDocument();
  });

  it("does not render view options skeleton when withViewOptions=false", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} withViewOptions={false} />
    );
    const viewOptionsSkeleton = container.querySelector(".ml-auto.hidden");
    expect(viewOptionsSkeleton).not.toBeInTheDocument();
  });

  it("uses default rowCount of 10 when not provided", () => {
    const { container } = render(<DataTableSkeleton columnCount={3} />);
    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows.length).toBe(10);
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      <DataTableSkeleton columnCount={2} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
