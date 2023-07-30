import React, { memo, useEffect, useRef, useState } from 'react';

interface DropdownProps {

    label: string;

    selected: number;

    onSelect: (val: number) => void;

    options: {value: number, label: string}[];
}

export const Dropdown: React.FC<DropdownProps> = memo((props) => {

    const {
        label,
        selected,
        options,
        onSelect,
    } = props;

    const parentRef = useRef<HTMLDivElement>(null);

    const [open, SetOpen] = useState(false);
    const [pos, SetPos] = useState<{x: number, y: number}>(() => ({x: 0, y: 0}));

    const selectedOption = options.find(o => o.value === selected);

    useEffect(() => {
        const onClickElswhere = (e: MouseEvent) => {
            const start = e.target;
            if(start instanceof HTMLElement) {
                let elem: HTMLElement | null = start;
                while(elem && elem.tagName !== "BODY") {
                    if(elem === parentRef.current)
                        return;
                    elem = elem.parentElement;
                }
            }
            SetOpen(false);
        }

        window.addEventListener('click', onClickElswhere);

        return () => {
            window.removeEventListener('click', onClickElswhere);
        }
    }, [])

    return <div ref={parentRef} style={{
        position: 'relative',
    }}>
        <button onClick={(e) => {
            const button = e.target as HTMLButtonElement;
            const parent = button.parentElement!;

            const y = button.clientTop - parent.clientTop + button.clientHeight;
            const x = button.clientLeft - parent.clientLeft;

            SetPos({x,y});
            SetOpen(true);
        }}>
            {label}
        </button>
        {
            open && <div style={{
                position: 'absolute',
                top: pos.y,
                left: pos.x,
                backgroundColor: '#565656',
                border: 'solid 1px black',
                zIndex: 10,
                borderRadius: 8,
                padding: 4,
            }}>
                <ul>
                    {
                        options.map((o, i) => {
                            const select = () => {
                                onSelect(o.value);
                                SetOpen(false);
                            }

                            return <li key={i} style={{
                                backgroundColor: selected === o.value ? '#999999' : undefined,
                            }}>
                                <button onClick={select} style={{padding: 4, width: '100%'}}>
                                    {o.label}
                                </button>
                            </li>
                        })
                    }
                </ul>
            </div>
        }
    </div>
});