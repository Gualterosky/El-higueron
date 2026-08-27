"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MessageSquare, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitReplyAction } from "@/lib/replies/reply-actions"
import type { PostReply } from "@/lib/db/schema"

type Props = {
  postId: string
  postType: "muro" | "camping" | "boulder"
  initialReplies: PostReply[]
}

export function PostRepliesSection({ postId, postType, initialReplies }: Props) {
  const t = useTranslations("PostReply")
  const [replies, setReplies] = useState<PostReply[]>(initialReplies)
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const totalReplies = replies.length

  return (
    <div className="border-t border-border/40 pt-3">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <MessageSquare className="h-4 w-4" />
        <span>
          {totalReplies > 0
            ? t("count", { count: totalReplies })
            : t("noReplies")}
        </span>
        <span className="ml-auto">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Existing replies */}
          {replies.length > 0 && (
            <div className="space-y-2 pl-3 border-l-2 border-border/50">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={cn(
                    "space-y-0.5 text-sm",
                    reply.status === "pending" && "opacity-70"
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-foreground">
                      {reply.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                    {reply.status === "pending" && (
                      <span className="text-xs text-amber-600">
                        {t("pendingLabel")}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {reply.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Reply form toggle */}
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-sm font-medium text-forest hover:text-forest/80 transition-colors"
            >
              {t("replyButton")}
            </button>
          ) : (
            <ReplyForm
              postId={postId}
              postType={postType}
              onCancel={() => setShowForm(false)}
              onSuccess={(newReply) => {
                setReplies((prev) => [newReply, ...prev])
                setShowForm(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ── Inline reply form ────────────────────────────────────────────────────────

type ReplyFormProps = {
  postId: string
  postType: "muro" | "camping" | "boulder"
  onCancel: () => void
  onSuccess: (reply: PostReply) => void
}

function ReplyForm({ postId, postType, onCancel, onSuccess }: ReplyFormProps) {
  const t = useTranslations("PostReply")
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const schema = z.object({
    authorName: z.string().min(2, t("errorMin2")).max(100),
    comment: z.string().min(5, t("errorMin5")).max(2000),
    contactInfo: z.string().min(3, t("errorRequired")).max(200),
  })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const result = await submitReplyAction({ ...data, postId, postType })
      if (result.ok) {
        setSubmitted(true)
        // Add optimistic reply to parent list
        const optimisticReply: PostReply = {
          id: crypto.randomUUID(),
          postType,
          postId,
          authorName: data.authorName,
          comment: data.comment,
          contactInfo: data.contactInfo,
          status: "pending",
          createdAt: new Date(),
        }
        onSuccess(optimisticReply)
      } else {
        setServerError("error" in result ? result.error : t("errorGeneral"))
      }
    } catch {
      setServerError(t("errorGeneral"))
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-forest/10 px-3 py-2 text-sm text-forest">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {t("successBody")}
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-border/60 bg-beige/30 p-4"
    >
      <p className="text-sm font-medium text-foreground">{t("formTitle")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={`reply-name-${postId}`} className="text-xs">
            {t("authorName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reply-name-${postId}`}
            placeholder={t("authorNamePlaceholder")}
            className="h-8 text-sm"
            suppressHydrationWarning
            {...form.register("authorName")}
          />
          {form.formState.errors.authorName && (
            <p className="text-xs text-destructive">
              {form.formState.errors.authorName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor={`reply-contact-${postId}`} className="text-xs">
            {t("contactInfo")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reply-contact-${postId}`}
            placeholder={t("contactInfoPlaceholder")}
            className="h-8 text-sm"
            suppressHydrationWarning
            autoComplete="off"
            {...form.register("contactInfo")}
          />
          <p className="text-xs text-muted-foreground">{t("contactInfoHint")}</p>
          {form.formState.errors.contactInfo && (
            <p className="text-xs text-destructive">
              {form.formState.errors.contactInfo.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`reply-comment-${postId}`} className="text-xs">
          {t("comment")} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id={`reply-comment-${postId}`}
          placeholder={t("commentPlaceholder")}
          rows={3}
          className="text-sm"
          {...form.register("comment")}
        />
        {form.formState.errors.comment && (
          <p className="text-xs text-destructive">
            {form.formState.errors.comment.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          className="bg-orange text-white hover:bg-orange/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? t("submitting") : t("submit")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="text-muted-foreground"
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  )
}
