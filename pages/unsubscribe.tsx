import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type Status = "loading" | "confirming" | "success" | "error" | "invalid";

export default function Unsubscribe() {
  const router = useRouter();
  const { token } = router.query;
  
  const [status, setStatus] = useState<Status>("loading");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    
    if (!token || typeof token !== "string") {
      setStatus("invalid");
      return;
    }

    // Decode token to get event info
    try {
      const decoded = JSON.parse(atob(token.replace(/-/g, "+").replace(/_/g, "/")));
      if (decoded.eventTitle) {
        setEventTitle(decoded.eventTitle);
        setStatus("confirming");
      } else {
        setStatus("invalid");
      }
    } catch {
      setStatus("invalid");
    }
  }, [router.isReady, token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>
              {status === "loading" && "Processing..."}
              {status === "confirming" && "Unsubscribe"}
              {status === "success" && "Unsubscribed"}
              {status === "error" && "Error"}
              {status === "invalid" && "Invalid Link"}
            </CardTitle>
            <CardDescription>
              {status === "confirming" && eventTitle && (
                <>Unsubscribe from reminders for <strong>{eventTitle}</strong>?</>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            )}
            
            {status === "confirming" && (
              <>
                <p className="text-center text-muted-foreground">
                  You will no longer receive reminder emails for this event.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => router.push("/events")}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleUnsubscribe}>
                    Unsubscribe
                  </Button>
                </div>
              </>
            )}
            
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-center text-muted-foreground">
                  You have been unsubscribed from {eventTitle || "this event"}.
                </p>
                <Button onClick={() => router.push("/events")}>
                  Back to Events
                </Button>
              </>
            )}
            
            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-center text-destructive">{errorMessage}</p>
                <Button variant="outline" onClick={() => setStatus("confirming")}>
                  Try Again
                </Button>
              </>
            )}
            
            {status === "invalid" && (
              <>
                <XCircle className="h-12 w-12 text-muted-foreground" />
                <p className="text-center text-muted-foreground">
                  This unsubscribe link is invalid or has expired.
                </p>
                <Button onClick={() => router.push("/events")}>
                  Back to Events
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
