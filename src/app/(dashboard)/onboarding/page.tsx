import { redirect } from "next/navigation";

import { onboarding } from "@/lib/actions/onboarding";

export default async function OnboardingPage() {
  const { error } = await onboarding();

  if (error) {
    return (
      <div>
        <p>Something went wrong during onboarding.</p>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  redirect("/");
}
