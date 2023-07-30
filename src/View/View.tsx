import React from 'react';
import {observer} from 'mobx-react';
import { useViewModel } from './ViewModel';
import { UserRow } from './UserRow';


export const BaseView = observer(() => {
    const vm = useViewModel();
    return <div>
        <div style={{
            backgroundColor: '#565656',
            maxWidth: 600,
            borderRadius: 8,
            padding: '1rem',
        }}>
            <h2>
                Players
                <button onClick={() => vm.AddUser()} style={{marginLeft: '1rem'}}>
                    Add
                </button>
            </h2>
            <ul>
                {
                    vm.Users.map((u,i) => <UserRow key={i} user={u} index={i} />)
                }
            </ul>
        </div>
    </div>

})