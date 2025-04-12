import { View } from "@components/View";
import { GeneralSettings, Misc, SelectGenre } from "@features/competitions/CreateCompetition";
import type { Genre, IGenreResponse } from "@features/competitions/competition";
import { httpGet } from "@utils/fetcher";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWR from "swr";

const slides = [SelectGenre, GeneralSettings, Misc];

const CompetitionAdminCreate = () => {
    const { data: genres } = useSWR<IGenreResponse>("competitions/genres", httpGet);
    const methods = useForm({ shouldUnregister: false });

    const [slideIndex, setSlideIndex] = useState(0);
    const CurrentSlide = useMemo(() => {
        return slides[slideIndex] || null;
    }, [slideIndex]);

    const forward = () => {
        if (slideIndex + 1 >= slides.length) {
            return;
        }

        setSlideIndex(slideIndex + 1);
    };

    const previous = () => {
        if (slideIndex === 0) {
            return;
        }

        setSlideIndex(slideIndex - 1);
    };

    const selectedGenre = methods.watch("genre");

    const activeCategory: Genre | null = useMemo(() => {
        if (!selectedGenre || !genres) {
            return null;
        }

        const ac = genres.results.find((g) => g.id === Number(selectedGenre));

        return ac?.category.value ?? null;
    }, [selectedGenre, genres]);

    return (
        <View className="flex flex-col items-center">
            <FormProvider {...methods}>
                <div className="my-16 max-w-prose">
                    <CurrentSlide onForward={forward} onPrevious={previous} activeCategory={activeCategory} />
                </div>
            </FormProvider>
        </View>
    );
};

export default CompetitionAdminCreate;
