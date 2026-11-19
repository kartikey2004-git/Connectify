import { SignUp } from "@clerk/nextjs";
import AuthCardSkeleton from "@/components/auth/auth-card-skeleton";
import ClientOnly from "@/components/auth/client-only";
import { POST_AUTH_URL } from "@/lib/constants";

export const metadata = { title: "Sign up | Connectify" };

export default function SignUpPage() {
  // Always land on /sync-user (which ends at /dashboard), whatever page sent the user here.
  return (
    <ClientOnly fallback={<AuthCardSkeleton />}>
      <SignUp forceRedirectUrl={POST_AUTH_URL} />
    </ClientOnly>
  );
}
