'use client';

import { MenuItemType } from '@/assets/types/menu';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuItemProps {
    item: MenuItemType;
    checkPermission?: string[]
}

const MenuItem = ({ item, checkPermission }: MenuItemProps) => {
    const {
        icon,
        items,
        label,
        labelClassName,
        iconClassName,
        itemClassName,
        onItemClick,
        permission,
    } = item;

    const pathname = usePathname()
    const Icon = () => icon;
    const active = item.to ? item.to === pathname : false
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const router = useRouter();
    const onClick = (currItem: MenuItemType) => {
        if (items && items.length > 0) {
            if (isOpenMenu) {
                setIsOpenMenu(false)
            } else {
                setIsOpenMenu(true);
            }
        }
        onItemClick?.(currItem);
        if (currItem.to) {
            if (items) {
                return
            } else {
                return router.push(currItem.to)
            }
        }
    };

    const SubItem = () => {
        return items?.map((child, index) => (<div key={index} style={{ marginLeft: "12px" }}>
            <MenuItem key={child.label} item={{ ...child }} checkPermission={checkPermission} />
        </div>
        ));
    };

    return (
        (checkPermission?.some((check) => permission?.includes(check)) || !permission) ?
            <div className='my-1'>
                <div
                    className={classNames(
                        'flex align-items-center gap-2 h-3rem px-3 no-underline cursor-pointer transition-linear transition-duration-200 p-ripple',
                        itemClassName,
                        {
                            'hover:bg-blue-100': !isOpenMenu,
                            'text-900': !isOpenMenu,
                            'bg-primary': isOpenMenu || active,
                            'p-highlight': isOpenMenu || active,
                        },
                    )}
                    onClick={() => onClick(item)}
                >
                    {icon && (
                        <div className={classNames('p-1', iconClassName)}>
                            <Icon />
                        </div>
                    )}
                    <p className={classNames('flex-1 text-sm font-semibold itemLabel m-0', labelClassName)}>{label}</p>

                    {items && items.length > 0 && <i className='pi pi-chevron-down text-sm' ></i>}

                    <Ripple />
                </div>


                {items && items.length > 0 && (
                    <motion.div
                        animate={
                            isOpenMenu
                                ? { height: 'auto' }
                                : { height: 0 }
                        }
                        transition={{ duration: 0.3 }}
                        className={classNames('overflow-hidden border-left-1 border-300 subMenu mt-1')}
                    >
                        <SubItem />
                    </motion.div>
                )}
            </div> : null
    );
};

export default MenuItem;
