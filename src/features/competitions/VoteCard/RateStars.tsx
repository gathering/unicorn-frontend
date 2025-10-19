import { useEffect, useState } from "react";

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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHoverStar(undefined);
        }
    }, [isFetching, hoverStar]);

    return (
        <>
            <div className="mb-2 flex items-center justify-center" style={{ minHeight: "3rem" }}>
                {isFetching ? (
                    <svg
                        className="h-8 w-8 animate-spin text-black"
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
                                key={i}
                                title={`${starDescription[i]}${starDescription[i].endsWith("!") ? "" : "."} Vote ${
                                    i + 1
                                } star${i + 1 === 1 ? "" : "s"}`}
                                className={`px-2 text-4xl ${bgColor}`}
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
