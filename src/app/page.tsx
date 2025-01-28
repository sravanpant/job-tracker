import { HydrateClient } from "@/trpc/server";
import Navbar from "@/components/shared/Navbar";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="bg-gradient-pattern flex min-h-screen flex-col items-center justify-center">
        <Navbar />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="grid w-[70%] text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span>The Only </span>
            <span>
              <span className="text-[hsl(280,100%,70%)]">Open Source</span>{" "}
              <span className="text-[hsl(480,100%,70%)]">Job Tracker</span>{" "}
            </span>
            <span>You Need </span>
          </h1>
        </div>
      </main>
    </HydrateClient>
  );
}
