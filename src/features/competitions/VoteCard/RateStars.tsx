import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    onChange: (vote: number) => void;
    isFetching: boolean;
    score: number;
}

const starDescription = ["Not my taste", "It's ok", "Cool!", "I like it!", "Amazing!"];

export const RateStars = ({ onChange, score, isFetching }: Props) => {
    const [hoverStar, setHoverStar] = useState<number>();
    const stars = new Array(5).fill(false).map((_, i) => i + 1 <= score);

    useEffect(() => {
        if (isFetching === true && hoverStar !== undefined) {
            setHoverStar(undefined);
        }
    }, [isFetching, hoverStar]);

    return (
        <>
            <div className="flex items-center justify-center mb-2" style={{ minHeight: "3rem" }}>
                {isFetching ? (
                    <svg
                        className="w-8 h-8 text-black animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="text-tg-brand-orange-500/75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    stars.map((active, i) => {
                        const bgColor =
                            hoverStar !== undefined && hoverStar >= i
                                ? "text-yellow-600"
                                : active
                                ? "text-yellow-400"
                                : "text-gray-500";

                        return (
                            <button
                                title={`${starDescription[i]}${starDescription[i].endsWith("!") ? "" : "."} Vote ${
                                    i + 1
                                } star${i + 1 === 1 ? "" : "s"}`}
                                className={`text-4xl px-2 ${bgColor}`}
                                onFocus={() => setHoverStar(i)}
                                onMouseEnter={() => setHoverStar(i)}
                                onMouseLeave={() => setHoverStar(undefined)}
                                onClick={() => onChange(i + 1)}
                            >
                                ★
                            </button>
                        );
                    })
                )}
            </div>
            <p style={{ minHeight: "2.5rem" }} className="text-gray-700">
                {hoverStar !== undefined ? starDescription[hoverStar] : score !== 0 ? starDescription[score - 1] : null}
            </p>
        </>
    );
};
