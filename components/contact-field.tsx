"use client"

import { useMemo } from "react"
import { useController, type Control, type FieldValues, type Path } from "react-hook-form"
import { Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { normalizeContact, formatPhoneDisplay } from "@/lib/contacts/normalize"

type ContactFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  hint?: string
}

export function ContactField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  hint,
}: ContactFieldProps<T>) {
  const { field, fieldState } = useController({ control, name })
  const value = typeof field.value === "string" ? field.value : ""
  const detected = useMemo(() => normalizeContact(value), [value])

  const hintNode = detected ? (
    detected.kind === "email" ? (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Mail className="h-3 w-3" />
        {detected.value}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Phone className="h-3 w-3" />
        {formatPhoneDisplay(detected.value)}
      </span>
    )
  ) : hint ? (
    <span className="text-xs text-muted-foreground">{hint}</span>
  ) : null

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={field.name}
        placeholder={placeholder}
        autoComplete="off"
        suppressHydrationWarning
        value={value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        ref={field.ref}
      />
      {hintNode}
      {fieldState.error ? (
        <p className="text-xs text-destructive" role="alert">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}
