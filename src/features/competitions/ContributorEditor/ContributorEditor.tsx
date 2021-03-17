import React from 'react';
import { useUserState } from '../../../context/Auth';

export const ContributorEditor = () => {
    const { user } = useUserState();

    return (
        <div className="container mx-auto my-12 sm:my-0">
            <section className="flex flex-col bg-white rounded sm:rounded-none">
                <h2 className="p-4 text-xl text-center">Edit contributors</h2>
                <form>
                    <hr className="pb-6 border-t border-gray-300" />
                    <fieldset className="mx-4">
                        <legend className="mb-5">Contributors on your team</legend>
                        <label htmlFor="display_name_field" className="block w-full mb-1">
                            Display name
                        </label>
                        <span
                            id="display_name_field"
                            className="flex items-center h-12 px-4 mb-6 leading-tight text-gray-700 bg-gray-300 border border-gray-300 rounded"
                        >
                            {user?.display_name}
                        </span>
                    </fieldset>
                    <hr className="my-6 border-t border-gray-300" />

                    <button className="flex items-center float-right h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                        Update
                    </button>
                </form>
            </section>
        </div>
    );
};
