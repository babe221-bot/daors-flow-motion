import { Package } from "lucide-react";
import ItemsTable from "@/components/ItemsTable";
import { useTranslation } from "react-i18next";

const ItemTracking = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        <Package className="mr-2" />
        {t('itemTracking.title')}
      </h1>
      <ItemsTable />
    </div>
  );
};

export default ItemTracking;
