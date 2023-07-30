import React from 'react';
import { ExperienceLevels, ExperienceToText, User } from '../Constants/user';
import { observer } from 'mobx-react';
import { useViewModel } from './ViewModel';
import { action } from 'mobx';
import { Dropdown } from './Dropdown';
import { Faction } from '../Constants/faction-data';


interface UserRowProps {
    index: number;
    user: User;
    drafted: Faction[];
}

export const UserRow: React.FC<UserRowProps> = observer((props) => {

    const vm = useViewModel();

    const { user, drafted } = props;

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
            flexDirection: 'column',
            justifyContent: 'stretch',
            backgroundColor: '#ababab',
            padding: '0.5rem',
            borderRadius: 8,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 8,
                alignItems: 'center',
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
                        minWidth: 0,
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
                <button onClick={() => vm.RemoveUser(user.id)}>
                    Remove
                </button>
            </div>
            {
                drafted.length > 0 &&
                <div>
                    <ol>
                        {
                            drafted.map((f,i) => {
                                return <li key={f.key}>
                                    {f.name}
                                </li>
                            })
                        }
                    </ol>
                </div>
            }
        </div>
    </li>
});