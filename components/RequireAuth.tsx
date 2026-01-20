"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Loader2 } from "lucide-react";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                router.push("/sign-in");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (!authenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
};

export default RequireAuth;
