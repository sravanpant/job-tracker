import { useSession, signIn } from "next-auth/react";
import { Button } from "./button";
import UserNav from "../shared/UserNav";
import { FaGoogle } from "react-icons/fa";
import { cn } from "@/lib/utils";

const LoginButton = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <UserNav />
      </>
    );
  }
  return (
    <>
      <Button
        className={cn(className, "rounded-full")}
        onClick={() =>
          signIn("google", {
            redirectTo: "/dashboard",
          })
        }
      >
        <FaGoogle />
        Sign in with Google
      </Button>
    </>
  );
};

export default LoginButton;
