"use client"
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
// dark mode 
import { useTheme } from "next-themes";
import { AlignJustify, Moon, Sun } from "lucide-react";

// import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '../../../navigation'
import logo from "../../../public/logo.png"
import Image from 'next/image'
import { ModeToggle } from './theme-mode.toggle';
import LanguageToggle from './language-toggle';
import ThemeColorToggle from './theme-color-toggle';
import { INFO_USER } from '@/assets/configs/request';
import ROUTER from '@/assets/configs/routers';
import { Link } from '@/i18n/routing';
import { cookies } from '@/assets/helpers';

export default function Header({ onClick }: { onClick: () => void }) {
    const t = useTranslations("System")
    const locale = useLocale(); // Lấy locale hiện tại
    const pathname = usePathname(); // Lấy đường dẫn hiện tại
    const router = useRouter()


    const handleChangeLanguage = (lang: string) => {
        router.push(pathname, { locale: lang });

    };

    const [info, setInfo] = useState<string | null>(null)
    useEffect(() => {
        const jinfo = localStorage.getItem(INFO_USER)
        if (jinfo === null) return
        const info: string = JSON.parse(jinfo)
        setInfo(info)
    }, [])

    return (
        <div
            className="fixed flex w-full justify-between border-b-2 shadow-inherit z-40 h-14 bg-primary-foreground"
        >
            <div className='flex w-full justify-between'>

                {/* Logo và thanh công cụ */}
                <div className="flex items-center">
                    <Link href={ROUTER.home}>
                        <Image
                            src={logo}
                            alt="Logo"
                            className='mx-4 w-16'
                        />
                    </Link>
                    <div className="flex items-center">
                        <Button
                            className="btn-bars-top-menu py-2 border-none rounded-full"
                            aria-label="Toggle Menu"
                            onClick={onClick}
                            variant="outline"
                            type="button"
                        >
                            <AlignJustify />
                        </Button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <div className='flex items-center mr-4'>
                    {/* theme color Menu */}
                    <ThemeColorToggle />
                    {/* Dark mode Menu */}
                    <ModeToggle />

                    <LanguageToggle handleChangeLanguage={handleChangeLanguage} locale={locale} />
                    {/* {item trong nafy} */}
                    {
                        !info &&
                        <Button className="w-[100px]">
                            <Link href={ROUTER.auth.login}>
                                {t('dang-nhap')}
                            </Link>
                        </Button>
                    }
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center cursor-pointer">
                                {/* <span className="pi pi-user bg-primary p-2 rounded-full"></span>  */}
                                {/* <span className="ml-2">tranvinhhien</span> */}
                                <span className="ml-2">{info}</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 shadow-lg rounded-lg">
                            <DropdownMenuLabel className="">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="border-t my-2" />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className=" shadow-lg rounded-lg">
                                            <DropdownMenuItem>Email</DropdownMenuItem>
                                            <DropdownMenuItem>Message</DropdownMenuItem>
                                            <DropdownMenuSeparator className="border-t my-2" />
                                            <DropdownMenuItem>More...</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    New Team
                                    <DropdownMenuShortcut className="ml-auto ">⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="border-t my-2" />
                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuItem disabled>API</DropdownMenuItem>
                            <DropdownMenuSeparator className="border-t my-2" />
                            <DropdownMenuItem onClick={() => { cookies.logOut() }}>
                                Log out
                                <DropdownMenuShortcut className="ml-auto ">⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </div>
    )
}




