import React, { useEffect, useRef, useState } from "react";

interface Props {
    src: string;
}

export const MusicPlayer = ({ src }: Props) => {
    const [player] = useState(new Audio(src));
    const [playerError, setPlayerError] = useState<string>();
    const [canPlay, setCanPlay] = useState(false);

    const seekerRef = useRef<HTMLInputElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerTime, setPlayerTime] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            player.play().catch(() => {
                setPlayerError("Could not play this file");
            });
        } else {
            player.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (!seekerRef.current) {
            return;
        }

        seekerRef.current.value = playerTime.toString();
    }, [playerTime]);

    useEffect(() => {
        player.addEventListener("canplay", () => setCanPlay(true));
    }, [player]);

    useEffect(() => {
        player.addEventListener("ended", () => setIsPlaying(false));
        player.addEventListener("timeupdate", (e) => {
            // @ts-expect-error  TS2339: Property 'currentTime' does not exist on type 'EventTarget'
            console.log(e.target?.currentTime);
            // @ts-expect-error  TS2339: Property 'currentTime' does not exist on type 'EventTarget'
            setPlayerTime(e.target?.currentTime);
        });
        return () => {
            player.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, [canPlay]);

    if (playerError) {
        return <p>{playerError}</p>;
    }

    return (
        <>
            <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "pause" : "play"}</button>
            <input
                type="range"
                ref={seekerRef}
                max={player.duration}
                className="w-full"
                onClick={(e) => {
                    player.currentTime = Number(e.currentTarget.value);
                }}
            />
        </>
    );
};
