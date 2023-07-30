import React, { HTMLAttributes } from 'react';
import {observer} from 'mobx-react';
import { useViewModel } from './ViewModel';
import { UserRow } from './UserRow';
import { action } from 'mobx';
import './View.css';
import { EXPANSIONS, EXPANSION_KEYS, FACTIONS_FILTERED } from '../Constants/faction-data';


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
                Config
            </h2>
            <div style={{
                backgroundColor: '#ababab',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
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
                <span style={{marginTop: 8, display: 'inline-block'}}>
                    Total faction count: {FACTIONS_FILTERED(vm.Expansions, vm.Users).length}
                </span>
            </div>
            <div style={{
                backgroundColor: '#ababab',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
            }}>
                <span>
                    <span style={{marginRight: 4}}>
                        Draft per player (max {vm.MaxDraftCount}):
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
            <div style={{
                backgroundColor: '#ababab',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <span style={{marginRight: 8}}>Assign Speaker</span>
                    <input type="checkbox" checked={vm.AssignSpeaker} onChange={action((e) => {
                        const checked = e.target.checked;
                        vm.AssignSpeaker = checked;
                    })} />
                </div>
            </div>
            <div style={{
                backgroundColor: '#ababab',
                padding: 8,
                borderRadius: 8,
            }}>
                <button onClick={() => vm.Draft()} style={{fontSize: '2rem', backgroundColor: 'lightblue', width: "100%"}}>
                    DRAFT
                </button>
            </div>
        </Panel>

        <Panel>
            <h2>
                Raw Output
            </h2>
            <pre style={{backgroundColor: '#ababab', padding: 16, minWidth: 400}}>
                {
                    Array.from(vm.Drafted.entries()).map(([usr, facs], i) => {
                        return <span key={i}>
                            {i != 0 && "\n\n"}
                            {usr.name}{vm.Speaker === usr.id ? ` (SPEAKER)` : ''}:
                            {"\n"}
                            {facs.map(f => `${f.name}\n`)}
                        </span>
                    })
                }
            </pre>
        </Panel>
    </div>

})