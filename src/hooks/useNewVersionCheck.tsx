import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 60_000;

export function useNewVersionCheck() {
    const [hasNewVersion, setHasNewVersion] = useState(false);

    useEffect(() => {
        // Only check in production builds
        if (import.meta.env.DEV) return;

        const controller = new AbortController();
        let stopped = false;

        const check = async () => {
            if (stopped) return;
            try {
                const res = await fetch("/version.json", {
                    cache: "no-cache",
                    signal: controller.signal,
                });
                if (!res.ok) return;

                const data = await res.json();
                if (data.version && data.version !== __BUILD_VERSION__) {
                    setHasNewVersion(true);
                    stopped = true;
                    clearInterval(interval);
                }
            } catch {
                // Silently ignore fetch/abort errors
            }
        };

        const interval = setInterval(check, POLL_INTERVAL_MS);
        // Initial check after a short delay
        const timeout = setTimeout(check, 5_000);

        return () => {
            stopped = true;
            controller.abort();
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return hasNewVersion;
}
