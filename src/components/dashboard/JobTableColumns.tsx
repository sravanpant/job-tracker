// src/components/dashboard/JobTableColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { format } from "date-fns";
import { type RouterOutputs } from "@/utils/api";

// Define the Job type based on the API output
type Job = RouterOutputs["job"]["getAll"][number];

export const JobTableColumns: ColumnDef<Job>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "job_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job ID" />
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge
          className={
            status === "applied"
              ? "bg-blue-500"
              : status === "interviewing"
                ? "bg-yellow-500"
                : status === "offered"
                  ? "bg-green-500"
                  : "bg-red-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "jobType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job Type" />
    ),
  },
  {
    accessorKey: "remote",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remote" />
    ),
    cell: ({ row }) => (row.getValue("remote") ? "Yes" : "No"),
  },
  {
    accessorKey: "appliedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied Date" />
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("appliedDate");
      return format(date, "PPP");
    },
  },
];
