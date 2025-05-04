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
import CountryFlagSvg from "country-list-with-dial-code-and-flag/dist/flag-svg";

export const languages = [
    {
        value: "NL",
        code: "NL",
        label: "Dutch",
    },
    {
        value: "DE",
        code: "DE",
        label: "German",
    },
    {
        value: "FR",
        code: "FR",
        label: "French",
    },
    {
        value: "GB",
        code: "GB",
        label: "English",
    },
    {
        value: "ES",
        code: "ES",
        label: "Spanish",
    }
]

export function getLanguageIcon(language: string) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(CountryFlagSvg[language])}`
}

function LanguageRender({ language }: { language?: { value: string, label: string, code: string } }) {
    if (!language) return
    return (
        <div className={"flex gap-2"}>
            <img className={"aspect-square rounded-full h-5 object-cover"} src={getLanguageIcon(language.code)} />
            {language.label}
        </div>
    )
}

export default function LanguageSelector({ value, onChange, options = languages }: { value: string, onChange: (value: string) => void, options?: { value: string, label: string, code: string }[] }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? <LanguageRender language={options.find((language) => language.value === value)} />
                        : "Select language..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search language..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((language) => (
                                <CommandItem
                                    key={language.value}
                                    value={language.label}
                                    onSelect={() => {
                                        onChange(language.value === value ? "" : language.value)
                                        setOpen(false)
                                    }}
                                >
                                    <LanguageRender language={language} />
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === language.value ? "opacity-100" : "opacity-0"
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
