// src/components/job-tracker/JobTable.tsx
"use client"
import { useState } from "react";
import { api } from "@/utils/api";
import { JobTableColumns } from "./JobTableColumns";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateJobDialog } from "./CreateJobDialog";
import { type RouterOutputs } from "@/utils/api";
import { JobTableSkeleton } from "./JobTableSkeleton";

// Define the Job type based on the API output
type Job = RouterOutputs["job"]["getAll"][number];

export function JobTable() {
  const [open, setOpen] = useState(false);
  const { data: jobs, isLoading } = api.job.getAll.useQuery();



  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>
        <JobTableSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Job Applications</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>
      <DataTable columns={JobTableColumns} data={jobs ?? []} />
      <CreateJobDialog open={open} setOpen={setOpen} />
    </div>
  );
}