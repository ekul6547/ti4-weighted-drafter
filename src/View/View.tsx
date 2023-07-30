import React from 'react';
import {observer} from 'mobx-react';
import { useViewModel } from './ViewModel';
import { UserRow } from './UserRow';
import { action } from 'mobx';


export const BaseView = observer(() => {
    const vm = useViewModel();
    return <div>
        <div style={{
            backgroundColor: '#565656',
            maxWidth: 600,
            borderRadius: 8,
            padding: '1rem',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
            }}>

                <h2>
                    Players
                </h2>
                <button onClick={() => vm.AddUser()} style={{marginLeft: '1rem'}}>
                    Add
                </button>
                <button onClick={() => vm.Draft()} style={{marginLeft: '1rem', backgroundColor: 'lightblue'}}>
                    Draft
                </button>
                <span>
                    <span>
                        Draft Count (max {vm.MaxDraftCount}):
                    </span>
                    <input
                        type="number"
                        value={vm.DraftCount}
                        onChange={action((e) => {
                            const val = Number(e.target.value);
                            vm.DraftCount = Math.max(Math.min(val, vm.MaxDraftCount), 0);
                        })}
                    />
                </span>
            </div>
            <ul>
                {
                    vm.Users.map((u,i) => <UserRow key={i} user={u} index={i} drafted={vm.Drafted.get(u) || []} />)
                }
            </ul>
        </div>
    </div>

})