import React, { useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import useSWR from 'swr';
import { SelectGenre, GeneralSettings, Misc } from '../features/competitions/CreateCompetition';
import type { IGenreResponse, Genre } from '../features/competitions/competition';
import { View } from '../components/View';
import { httpGet } from '../utils/fetcher';

const slides = [SelectGenre, GeneralSettings, Misc];

const CompetitionAdminCreate = () => {
    const { data: genres } = useSWR<IGenreResponse>('competitions/genres', httpGet);
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

    const selectedGenre = methods.watch('genre');

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
                <AnimatePresence exitBeforeEnter initial={false}>
                    <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="my-16 max-w-prose"
                    >
                        <CurrentSlide onForward={forward} onPrevious={previous} activeCategory={activeCategory} />
                    </motion.div>
                </AnimatePresence>
            </FormProvider>
        </View>
    );
};

export default CompetitionAdminCreate;
