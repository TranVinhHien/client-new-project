import { handleProductImg } from "@/assets/configs/handle_img"
import { StarIcon } from "lucide-react"
import { Link } from '@/i18n/routing';
import { useTranslations } from "next-intl";

const  C_ProductSimple = ({product}:{product:ProductSimple}) => {
  const t = useTranslations("System")
    return (
        <div key={product.products_spu_id} className="bg-white rounded-lg border shadow hover:shadow-lg transition-shadow flex flex-col relative">
        <Link href={`/product/${product.products_spu_id}`}>
        
        <img 
          src={handleProductImg(product.image)} 
          alt={product.name} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4 flex flex-col flex-1">
          <div className="font-medium text-base line-clamp-2 mb-2 h-12">
            {product.name}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="text-lg font-bold text-red-500">
              {product.price?.toLocaleString()}₫
            </div>
            <div className="flex items-center text-sm text-gray-500">
              {product.average_star}/5 <StarIcon className="w-4 h-4 text-yellow-500 ml-1" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
           {product.total_rating} {t("so_luong_danh_gia")} 
          </div>
        </div>
        </Link>
      </div>
    )
}
export default C_ProductSimple;