"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslations } from "next-intl"
import { localesCbb } from "@/assets/configs/language"


export default function LanguageToggle({
    handleChangeLanguage,
    locale
}: Readonly<{
    handleChangeLanguage: (lang: string) => void;
    locale: string;
}>) {
    const t = useTranslations("System")
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[140px] justify-between"
                >
                    {locale
                        ? t(localesCbb.find((language) => language.value === locale)?.label)
                        : "Select language..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[140px] p-0">
                <Command>
                    {/* <CommandInput placeholder="Search language..." className="h-9" /> */}
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {localesCbb.map((language) => (
                                <CommandItem
                                    key={language.value}
                                    value={language.value?.toString()}
                                    onSelect={(currentValue) => {
                                        handleChangeLanguage(currentValue)
                                        //setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {t(language.label)}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            locale === language.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}