import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { Link } from './Link';

type Destinations = 'twitch' | 'discord' | 'facebook' | 'gathering.org';

interface ILink {
    href: string;
    destination: Destinations;
}

interface IProps {
    label?: string;
    onChange: (v: ILink[]) => void;
    value: ILink[];
}

export const CompetitionLinksEdit = ({ label, onChange, value }: IProps) => {
    const handleChangeDestination = (index: number, e: Destinations) => {
        const newLinkList = [...value];
        newLinkList[index] = {
            ...(newLinkList[index] ?? { href: '' }),
            destination: e,
        };
        onChange(newLinkList);
    };
    const handleChangeHref = (index: number, e: string) => {
        const newLinkList = [...value];
        newLinkList[index].href = e;
        onChange(newLinkList);
    };
    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };
    const handleAdd = () => {
        onChange([...value, ({ destination: '', href: '' } as unknown) as ILink]);
    };

    return (
        <fieldset>
            <legend className="mb-2">{label ?? 'Links'}</legend>
            {value.length && (
                <ul>
                    {value.map((val, i) => (
                        <li key={i} className="flex items-end mb-2">
                            <Select
                                options={[
                                    { label: 'Twitch', value: 'twitch' },
                                    { label: 'Discord channel', value: 'discord' },
                                    { label: 'Facebook', value: 'facebook' },
                                    { label: 'Gathering.org', value: 'gathering.org' },
                                ]}
                                onChange={(e) => handleChangeDestination(i, e)}
                                value={val.destination}
                                label="Destination"
                            />
                            <div className="pl-4">
                                <Input
                                    label="Url"
                                    type="url"
                                    onChange={(e) => handleChangeHref(i, e.target.value)}
                                    value={val.href}
                                />
                            </div>
                            <SecondaryButton type="button" className="mb-1 ml-6" onClick={(e) => handleRemove(i)}>
                                Remove
                            </SecondaryButton>
                        </li>
                    ))}
                </ul>
            )}
            <PrimaryButton type="button" onClick={handleAdd}>
                Add
            </PrimaryButton>
        </fieldset>
    );
};
