// src/server/api/routers/job.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { jobs } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const jobRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, ctx.session.user.id))
      .orderBy(desc(jobs.appliedDate));
  }),

  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const job = await ctx.db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input))
        .limit(1);

      if (!job[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }

      // Ensure user can only access their own jobs
      if (job[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to access this job",
        });
      }

      return job[0];
    }),

  create: protectedProcedure
    .input(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        jobId: z.string().optional(),
        location: z.string().optional(),
        status: z
          .enum(["applied", "interviewing", "offered", "rejected"])
          .default("applied"),
        salary: z.string().optional(),
        jobType: z
          .enum(["full-time", "part-time", "contract", "internship"])
          .optional(),
        remote: z.boolean().default(false),
        description: z.string().optional(),
        notes: z.string().optional(),
        applicationUrl: z.string().url().optional(),
        nextFollowUp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newJob] = await ctx.db
        .insert(jobs)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();

      return newJob;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        company: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        jobId: z.string().optional(),
        location: z.string().optional(),
        status: z
          .enum(["applied", "interviewing", "offered", "rejected"])
          .optional(),
        salary: z.string().optional(),
        jobType: z
          .enum(["full-time", "part-time", "contract", "internship"])
          .optional(),
        remote: z.boolean().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
        applicationUrl: z.string().url().optional(),
        nextFollowUp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if job exists and belongs to user
      const existingJob = await ctx.db
        .select()
        .from(jobs)
        .where(eq(jobs.id, id))
        .limit(1);

      if (!existingJob[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }

      if (existingJob[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this job",
        });
      }

      const [updatedJob] = await ctx.db
        .update(jobs)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id))
        .returning();

      return updatedJob;
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // Check if job exists and belongs to user
      const existingJob = await ctx.db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input))
        .limit(1);

      if (!existingJob[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }

      if (existingJob[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this job",
        });
      }

      await ctx.db.delete(jobs).where(eq(jobs.id, input));
      return existingJob[0];
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["applied", "interviewing", "offered", "rejected"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if job exists and belongs to user
      const existingJob = await ctx.db
        .select()
        .from(jobs)
        .where(eq(jobs.id, input.id))
        .limit(1);

      if (!existingJob[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }

      if (existingJob[0].userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this job",
        });
      }

      const [updatedJob] = await ctx.db
        .update(jobs)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, input.id))
        .returning();

      return updatedJob;
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userJobs = await ctx.db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, ctx.session.user.id));

    return {
      total: userJobs.length,
      applied: userJobs.filter((job) => job.status === "applied").length,
      interviewing: userJobs.filter((job) => job.status === "interviewing").length,
      offered: userJobs.filter((job) => job.status === "offered").length,
      rejected: userJobs.filter((job) => job.status === "rejected").length,
    };
  }),
});