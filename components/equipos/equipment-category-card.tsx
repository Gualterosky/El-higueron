import Image from "next/image"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"

export type EquipmentCardSize = { size: string; count: number }
export type EquipmentCardItem = { name: string; count: number }

type Props = {
  name: string
  imageUrl: string | null
  totalAvailable: number
  sizes?: EquipmentCardSize[]
  uniqueCount?: number
  items?: EquipmentCardItem[]
  priceText: string | null
  labels: {
    available: string
    noAvailability: string
    sizes: string
    items: string
    uniqueSize: string
    more: (count: number) => string
  }
}

const MAX_VISIBLE_ITEMS = 6

export function EquipmentCategoryCard({
  name,
  imageUrl,
  totalAvailable,
  sizes,
  uniqueCount = 0,
  items = [],
  priceText,
  labels,
}: Props) {
  const isSized = sizes !== undefined
  const hasAvailability = totalAvailable > 0
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenItems = items.length - visibleItems.length

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-beige to-beige-dark/60">
            <Package className="h-20 w-20 text-forest/40" aria-hidden />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm",
            hasAvailability ? "bg-forest/90 text-white" : "bg-white/90 text-muted-foreground",
          )}
        >
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", hasAvailability ? "bg-emerald-300" : "bg-muted-foreground/50")}
          />
          {hasAvailability ? labels.available : labels.noAvailability}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-tight text-forest">{name}</h3>
          {priceText && (
            <p className="shrink-0 rounded-lg bg-orange/10 px-2.5 py-1 text-right text-sm font-bold text-orange">
              {priceText}
            </p>
          )}
        </div>

        {hasAvailability ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {isSized ? labels.sizes : labels.items}
            </p>
            {isSized ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-2">
                {sizes.map(({ size, count }) => (
                  <span
                    key={size}
                    className="relative flex h-12 items-center justify-center rounded-lg border border-forest/20 bg-forest/5 text-base font-semibold text-forest"
                  >
                    {size}
                    {count > 1 && (
                      <span className="absolute -right-1.5 -top-1.5 rounded-full bg-forest px-1.5 text-[10px] font-bold leading-4 text-white">
                        ×{count}
                      </span>
                    )}
                  </span>
                ))}
                {uniqueCount > 0 && (
                  <span className="col-span-2 flex h-12 items-center justify-center rounded-lg border border-dashed border-forest/30 bg-beige/50 px-2 text-center text-sm font-semibold text-forest">
                    {labels.uniqueSize}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {visibleItems.map(({ name: itemName, count }) => (
                  <span
                    key={itemName}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-forest/15 bg-forest/5 px-3 py-1 text-xs font-medium text-forest"
                  >
                    <span className="truncate">{itemName}</span>
                    {count > 1 && <span className="font-bold text-forest/70">×{count}</span>}
                  </span>
                ))}
                {hiddenItems > 0 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {labels.more(hiddenItems)}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-4 text-sm text-muted-foreground">
            <Package className="h-4 w-4" aria-hidden />
            {labels.noAvailability}
          </div>
        )}
      </div>
    </article>
  )
}
