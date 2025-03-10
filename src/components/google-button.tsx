"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ErrorBoundary from "./error-boundary";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  className?: string;
  text?: string;
  redirectTo?: string;
}

export function GoogleButton({ 
  className = "", 
  text = "Sign in with Google",
  redirectTo
}: GoogleButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get redirect_to from props or URL search params
      const urlRedirectTo = searchParams.get("redirect_to");
      const finalRedirectTo = redirectTo || urlRedirectTo || undefined;
      
      console.log("Starting Google sign-in with redirect to:", finalRedirectTo);
      
      // Call the server action to get the OAuth URL
      const response = await signInWithGoogleAction(finalRedirectTo);
      
      console.log("Received response from signInWithGoogleAction:", response);
      
      // If the response is a URL, redirect to it
      if (response && typeof response === 'string') {
        if (response.startsWith('http')) {
          console.log("Redirecting to OAuth URL:", response);
          // Use window.location.href for a full page navigation to avoid client-side routing issues
          window.location.href = response;
        } else {
          console.error("Response is not a valid URL:", response);
          throw new Error('Invalid URL format received from authentication service');
        }
      } else {
        console.error("Invalid response type:", typeof response, response);
        throw new Error('Invalid response from Google sign-in');
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(error?.message || 'Failed to sign in with Google. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full">
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
            <button 
              className="ml-2 underline text-red-700 hover:text-red-800"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <Button 
          type="button"
          className={`w-full flex items-center justify-center gap-2 ${className}`}
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              {text}
            </>
          )}
        </Button>
      </div>
    </ErrorBoundary>
  );
} 