import { setRequestLocale } from "next-intl/server"
import { AdminEquipmentPanel } from "@/components/admin/admin-equipment-panel"
import { getAllEquipmentItems, getAllEquipmentItemRentals } from "@/lib/equipos/item-queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminEquipmentPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [items, rentals] = await Promise.all([
    getAllEquipmentItems(),
    getAllEquipmentItemRentals(),
  ])

  return <AdminEquipmentPanel initialItems={items} initialRentals={rentals} />
}
