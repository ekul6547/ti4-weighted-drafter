import React, { HTMLAttributes } from 'react';
import {observer} from 'mobx-react';
import { useViewModel } from './ViewModel';
import { UserRow } from './UserRow';
import { action } from 'mobx';
import './View.css';
import { EXPANSIONS, EXPANSION_KEYS } from '../Constants/faction-data';


const Panel : React.FC<HTMLAttributes<HTMLDivElement>> = (props) => <div {...props} className='panel' />

export const BaseView = observer(() => {
    const vm = useViewModel();
    return <div className='panels-container'>
        <Panel>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
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
            <hr />
            <ul>
                {
                    vm.Users.map((u,i) => <UserRow key={i} user={u} index={i} drafted={vm.Drafted.get(u) || []} />)
                }
            </ul>
        </Panel>


        <Panel>
            <h2>
                Options
            </h2>
            <div style={{
                backgroundColor: '#ababab',
                padding: 8,
                borderRadius: 8,

            }}>
                <h3>
                    Expansions:
                </h3>
                {
                    Object.entries(EXPANSIONS).map(([exp, label]) => {

                        const selected = vm.Expansions.has(exp as EXPANSION_KEYS);

                        return <div key={exp} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <span style={{marginRight: 8}}>{label}</span>
                            <input type="checkbox" checked={selected} onChange={(e) => {
                                const checked = e.target.checked;
                                vm.ToggleExpansion(exp as EXPANSION_KEYS, checked);
                            }} />
                        </div>
                    })
                }
            </div>
        </Panel>

        <Panel>
            <h2>
                Raw
            </h2>
            <pre style={{backgroundColor: '#ababab', padding: 16}}>
                {
                    Array.from(vm.Drafted.entries()).map(([usr, facs], i) => {
                        return <span key={i}>
                            {i != 0 && "\n\n"}
                            {usr.name}:
                            {"\n"}
                            {facs.map(f => `${f.name}\n`)}
                        </span>
                    })
                }
            </pre>
        </Panel>
    </div>

})