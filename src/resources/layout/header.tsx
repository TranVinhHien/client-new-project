"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
// dark mode 
import { useTheme } from "next-themes";
import { AlignJustify, Moon, Sun, ChevronRight, ChevronDown, Settings, Search, ShoppingCart, Bell, User, LogOut, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import { useSearchParams } from 'next/navigation'
import logo from "../../../public/logo.png"
import Image from 'next/image'
import { ModeToggle } from './theme-mode.toggle';
import LanguageToggle from './language-toggle';
import ThemeColorToggle from './theme-color-toggle';
import { INFO_USER } from '@/assets/configs/request';
import ROUTER from '@/assets/configs/routers';
import { Link } from '@/i18n/routing';
import { cookies, request, requestNoToken } from '@/assets/helpers';
import { dataTagErrorSymbol, useMutation } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import API from '@/assets/configs/api';
import { AxiosError } from 'axios';
import { MetaType, ParamType } from '@/assets/types/request';

interface Category {
    category_id: string;
    name: string;
    key: string;
    path: string;
    parent: {
        data: string;
        valid: boolean;
    };
    child: {
        data: Category[] | null;
        valid: boolean;
    };
}

export default function Header({ onClick }: { onClick: () => void }) {
    const t = useTranslations("System")
    const locale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [categories, setCategories] = useState<Category[]>([]);
    const [openSettings, setOpenSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                // Store the image in localStorage
                localStorage.setItem('searchImage', base64Image);
                if ( pathname=== ROUTER.timkiem.image) {
                    window.location.reload();
                } else {
                    router.push(ROUTER.timkiem.image);
                }
    
        };
            reader.readAsDataURL(file);
        }
    };

    // Function to check if a category is selected
    const isCategorySelected = (categoryId: string) => {
        if (pathname === '/search') {
            const currentCategoryId = searchParams.get('id');
            return currentCategoryId === categoryId;
        }
        return false;
    };

    // Function to check if a category is a parent of the selected category
    const isParentOfSelected = (category: Category): boolean => {
        if (!category.child.valid || !category.child.data) return false;
        
        const currentCategoryId = searchParams.get('id');
        if (!currentCategoryId) return false;

        // Check if any child category matches the selected ID
        return category.child.data.some(child => 
            child.category_id === currentCategoryId || isParentOfSelected(child)
        );
    };

    const handleChangeLanguage = (lang: string) => {
        router.push(pathname, { locale: lang });
    };

    const [info, setInfo] = useState<UserLoginType | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {

            const response = await fetch("http://localhost:8080/v1/categories/get");
            if (!response.ok) {
                console.error("Failed to fetch categories:", response.statusText);
                return;
            }
        
            const data: any = await response.json();
            const categories: Category[] = data?.result?.categories||[];
            setCategories(categories);
        };

        fetchCategories();
        const jinfo = localStorage.getItem(INFO_USER)
        if (jinfo === null) return
        const info: UserLoginType = JSON.parse(jinfo)
        setInfo(info)
    }, [])

    const renderCategoryTree = (category: Category) => {
        const isSelected = isCategorySelected(category.category_id);
        const isParent = isParentOfSelected(category);
        const shouldHighlight = isSelected || isParent;
        
        return (
            <DropdownMenuSub key={category.category_id}>
                <div className="flex items-center w-full group">
                    <DropdownMenuSubTrigger 
                        className={`flex-1 p-3 transition-all duration-200 rounded-lg w-full ${
                            shouldHighlight 
                                ? 'bg-[hsl(var(--primary)/0.15)] hover:bg-[hsl(var(--primary)/0.2)]' 
                                : 'hover:bg-[hsl(var(--primary)/0.08)]'
                        }`}
                        showArrow={false}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link 
                                    href={ROUTER.search+"?id="+category.category_id} 
                                    className={`font-medium ${
                                        shouldHighlight 
                                            ? 'text-[hsl(var(--primary))]' 
                                            : 'text-[hsl(var(--primary)/0.7)] group-hover:text-[hsl(var(--primary))]'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                                {category.child.valid && category.child.data && category.child.data.length > 0 && (
                                    <span className={`text-xs ${
                                        shouldHighlight 
                                            ? 'text-[hsl(var(--primary))]' 
                                            : 'text-[hsl(var(--primary)/0.7)] group-hover:text-[hsl(var(--primary))]'
                                    }`}>
                                        ({category.child.data.length})
                                    </span>
                                )}
                            </div>
                            {category.child.valid && category.child.data && category.child.data.length > 0 && (
                                <ChevronRight className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 ${
                                    shouldHighlight 
                                        ? 'text-[hsl(var(--primary))]' 
                                        : 'text-[hsl(var(--primary)/0.7)] group-hover:text-[hsl(var(--primary))]'
                                }`} />
                            )}
                        </div>
                    </DropdownMenuSubTrigger>
                </div>
                {category.child.valid && category.child.data && (
                    <DropdownMenuSubContent 
                        className="bg-white shadow-lg rounded-lg p-2 min-w-[250px] border border-[hsl(var(--primary)/0.15)]"
                        asChild
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ 
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <div className="space-y-1">
                                {category.child.data.map((childCategory) =>
                                    renderCategoryTree(childCategory)
                                )}
                            </div>
                        </motion.div>
                    </DropdownMenuSubContent>
                )}
            </DropdownMenuSub>
        );
    };

    return (
        <div className="w-full shadow-sm">
            {/* Top Bar */}
            <div className="bg-[hsl(var(--primary))] text-white py-2 px-28">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={ROUTER.home} className="text-sm hover:text-gray-200">
                            {t('trang-chu')}
                        </Link>
                        <Link href="#" className="text-sm hover:text-gray-200">
                            {t('gioi-thieu')}
                        </Link>
                    </div>
                    {!info ? (
                        <Button variant="outline" className="flex items-center gap-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] justify-center">
                            <User className="h-4 w-4" />
                            <Link href={ROUTER.auth.login}>
                                {t('dang-nhap')}
                            </Link>
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div  className='flex items-center gap-2'>
                                    <User className="h-4 w-4" />
                                    <span>{info.name}</span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>{t('tai-khoan-cua-toi')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t('thong-tin-tai-khoan')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('don-hang')}</DropdownMenuItem>
                                {/* <DropdownMenuItem>{t('dang-xuat')}</DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => cookies.logOut()}>
                                    {t('dang-xuat')}
                                    <LogOut className="h-4 w-4" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto py-3 px-14">
                <div className="flex items-center justify-between gap-8 w-full">
                    {/* Left: Logo + Category */}
                    <div className="flex items-center gap-4 min-w-[220px] justify-center">
                        <Link href={ROUTER.home} className="flex-shrink-0 flex items-center justify-center">
                            <Image
                                src={logo}
                                alt="Logo"
                                className="w-20"
                            />
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/.9)] px-4 py-2 rounded-lg flex items-center justify-center">
                                    <AlignJustify className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                                {categories.map((category) => renderCategoryTree(category))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Center: Search + Links */}
                    <div className="flex flex-col items-center flex-1 justify-center">
                        <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
                            <div className="relative w-full flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder={t('tim-kiem')}
                                    className="w-full pl-4 pr-12 py-2 border-2 border-[hsl(var(--primary))] rounded-full focus:ring-2 focus:ring-[hsl(var(--primary))]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <Button
                                style={{right:-50}}
                                    className="absolute bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.9)] text-white rounded-full p-2 h-10 w-10 flex items-center justify-center"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    title={t('tim-kiem-bang-hinh-anh')}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                                <Button
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/.9)] text-white rounded-full"
                                    size="icon"
                                    onClick={() => {
                                        if (searchQuery.trim() !== "") {
                                            router.push(ROUTER.timkiem.query + "?query=" + searchQuery);
                                        }
                                    }}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>


                {/* Right: Actions */}
                <div className="flex items-center gap-2 min-w-[220px] justify-center">
                    <DropdownMenu open={openSettings} onOpenChange={setOpenSettings}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5 text-[hsl(var(--primary))]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{t('cai-dat')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <div className="flex items-center justify-between w-full px-2 py-1.5">
                                        <span>{t('mau-nen')}</span>
                                        <ThemeColorToggle />
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <div className="flex items-center justify-between w-full px-2 py-1.5">
                                        <span>{t('che-do-toi')}</span>
                                        <ModeToggle />
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <div className="flex items-center justify-between w-full px-2 py-1.5">
                                        <span>{t('ngon-ngu')}</span>
                                        <LanguageToggle handleChangeLanguage={handleChangeLanguage} locale={locale} />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                   {info && (<div className='flex items-center gap-2'> <Button variant="ghost" size="icon" className="relative flex items-center justify-center">
                        <Bell className="h-5 w-5 text-[hsl(var(--primary))]" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            3
                        </span>
                    </Button>
                   
                    <Button variant="ghost" size="icon" className="relative flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-[hsl(var(--primary))]" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            2
                        </span>
                    </Button>
                    </div>
                     )}
                  
                </div>

                </div>




                
                {/* Chỉ chuyển các link xuống dưới, giữ nguyên style cũ */}
                <div className="flex justify-center space-x-8 mt-2">
                    <Link href="#" className="text-sm font-medium text-[hsl(var(--primary))] hover:underline">
                        {t('khuyen-mai')}
                    </Link>
                    <Link href="#" className="text-sm font-medium text-[hsl(var(--primary))] hover:underline">
                        {t('san-pham-moi')}
                    </Link>
                    <Link href="#" className="text-sm font-medium text-[hsl(var(--primary))] hover:underline">
                        {t('thuong-hieu')}
                    </Link>
                </div>

            </div>
            {/* Đường kẻ phân cách header và body */}
            <div className="w-full border-b border-[hsl(var(--primary)/0.15)] rounded-b-lg shadow-sm"></div>
        </div>
    )
}




