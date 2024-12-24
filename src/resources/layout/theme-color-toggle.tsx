"use client";
import * as React from "react";

import { cn } from "@/lib/utils";

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
import { useTheme } from "next-themes";
import { useThemeContext } from "@/components/theme-color-provider";

const availableThemeColors = [
    { name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700" },
    { name: "Rose", light: "bg-rose-600", dark: "bg-rose-700" },
    { name: "Blue", light: "bg-blue-600", dark: "bg-blue-700" },
    { name: "Green", light: "bg-green-600", dark: "bg-green-500" },
    { name: "Orange", light: "bg-orange-500", dark: "bg-orange-700" },
];
export default function ThemeColorToggle() {
    const [open, setOpen] = React.useState(false)
    const { themeColor, setThemeColor } = useThemeContext();
    const { theme } = useTheme();
    console.log(themeColor)
    console.log(theme)
    console.log(availableThemeColors.find(cl => cl.name === themeColor)?.light)
    const createSelectItems = () => {
        return <div className="flex w-max">
            {
                availableThemeColors.map(({ name, light, dark }) => (
                    <CommandItem
                        onSelect={(currentValue) => {
                            setThemeColor(currentValue as ThemeColors)
                            //setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                        }}
                        className="rounded-full p-3 w-auto h-auto justify-center"
                        key={name} value={name}>
                        <div className="flex item-center space-x-3 rounded-full">
                            <div
                                className={cn(
                                    "rounded-full",
                                    "w-[20px]",
                                    "h-[20px]",
                                    theme === "light" ? light : dark,
                                )}
                            ></div>
                        </div>
                    </CommandItem>
                ))

            }
        </div>
    };
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[40px] justify-center border-none rounded-full p-3"
                >
                    {themeColor
                        ? <div className="flex items-center ">
                            <div
                                className={cn(
                                    "items-center",
                                    "rounded-full",
                                    "w-[20px]",
                                    "h-[20px]",
                                    theme === "light" ? availableThemeColors.find(cl => cl.name === themeColor)?.light :
                                        availableThemeColors.find(cl => cl.name === themeColor)?.dark,
                                )}
                            ></div>
                        </div>
                        : "Select language..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {createSelectItems()}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
