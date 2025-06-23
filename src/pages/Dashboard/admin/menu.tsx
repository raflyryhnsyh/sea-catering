import { DataTable } from "@/components/sidebar/data-table";
import data from "@/config/data.json"

export default function CateringMenu() {
  return (
      <div className="flex flex-1 flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
        </div>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
          </div>
        </div>
      </div>
  )
}