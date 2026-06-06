"use client";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

interface GoogleProviderProps {
  children: React.ReactNode;
}

export function GoogleProvider({
  children,
}: GoogleProviderProps) {
  console.log(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  );
  return (
    <GoogleOAuthProvider
      clientId={
        process.env
          .NEXT_PUBLIC_GOOGLE_CLIENT_ID!
      }
    >
      {children}
    </GoogleOAuthProvider>
  );
}