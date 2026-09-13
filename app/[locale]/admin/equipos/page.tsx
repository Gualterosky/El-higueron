import { setRequestLocale } from "next-intl/server"
import { AdminEquipmentPanel } from "@/components/admin/admin-equipment-panel"
import { getAllEquipmentForAdmin, getAllRentals } from "@/lib/equipos/queries"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminEquipmentPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [equipmentList, rentals] = await Promise.all([
    getAllEquipmentForAdmin(),
    getAllRentals(),
  ])

  return <AdminEquipmentPanel initialEquipment={equipmentList} initialRentals={rentals} />
}
