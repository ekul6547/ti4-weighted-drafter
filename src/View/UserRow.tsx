import React from 'react';
import { ExperienceLevels, ExperienceToText, User } from '../Constants/user';
import { observer } from 'mobx-react';
import { useViewModel } from './ViewModel';
import { action } from 'mobx';
import { Dropdown } from './Dropdown';


export const UserRow: React.FC<{ user: User, index: number }> = observer((props) => {

    const vm = useViewModel();

    const { user } = props;

    const setName = action((n: string) => {
        user.name = n;
    });

    const setExperience = action((val: ExperienceLevels) => {
        user.experience = val;
    });

    return <li style={{
        padding: '0.5rem',
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 8,
            alignItems: 'center',
            backgroundColor: '#ababab',
            padding: '0.5rem',
            borderRadius: 8,
        }}>
            <span>
                Name:
            </span>
            <input
                type="text"
                value={user.name}
                onChange={(e) => setName(e.target.value)}
                style={{
                    flex: 1,
                }}
            />
            <span>
                Experience:
            </span>
            <Dropdown
                label={ExperienceToText[user.experience]}
                onSelect={(v) => setExperience(v as ExperienceLevels)}
                options={[
                    ExperienceLevels.firstTime,
                    ExperienceLevels.beginner,
                    ExperienceLevels.intermediate,
                    ExperienceLevels.expert,
                    ExperienceLevels.veteran,
                ].map(e => ({ value: e, label: ExperienceToText[e] }))}
                selected={user.experience}
            />
        </div>
    </li>
});