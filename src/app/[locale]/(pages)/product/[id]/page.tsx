"use client"
// ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { request } from '@/assets/helpers/request_without_token';
import API from '@/assets/configs/api';
import { handleProductImg } from '@/assets/configs/handle_img';
import { Loading } from "@/components/ui/loading";
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

const ProductImageSlider = ({ images, selectedImage, setSelectedImage, spu }:any) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000); // 10 giây
    return () => clearInterval(interval);
  }, [images.length]);
  useEffect(() => {
    setSelectedImage(images[current]);
  }, [current]);

  return (
    <div>
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-transparent hover:bg-black/10"
          onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
          aria-label="Previous image"
        >
          <span className="sr-only">Previous</span>
          <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6"/></svg>
        </Button>
        <img
          src={handleProductImg(selectedImage)}
          alt={spu?.name}
          className="object-contain w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-transparent hover:bg-black/10"
          onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
          aria-label="Next image"
        >
          <span className="sr-only">Next</span>
          <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6"/></svg>
        </Button>
      </div>
      <div className="flex gap-2 mt-4">
        {images?.map((img:any, idx:any) => (
          <Button
            key={idx}
            variant={current === idx ? 'default' : 'outline'}
            className="p-0 w-16 h-16 border rounded"
            onClick={() => setCurrent(idx)}
          >
            <img src={handleProductImg(img)} alt="" width={64} height={64} className="object-contain" />
          </Button>
        ))}
      </div>
    </div>
  );
};

const ProductDetail: React.FC<ProductData> = ({
  description_attrs,
  sku,
  sku_attrs,
  spu,
}) => {
  const t = useTranslations("System")

  // Xử lý media
  const images: string[] = spu?.media !=undefined
    ? JSON.parse(spu.media.replace(/'/g, '"'))
    : [spu?.image];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, SkuAttr>>({});

  useEffect(() => {
    const newSku = getSkuByValue(selectedAttributes);
    if (newSku) setSelectedSku(newSku);
  }, [selectedAttributes]);

  useEffect(() => {
    const sku_stock = sku?.find(s => s.sku_stock > 0);
    if(sku_stock){
      setSelectedSku(sku_stock);
    }
    sku_stock?.value.split('/').forEach((attr,index) => {
      const attrh = sku_attrs.find(a => a.product_sku_attr_id === attr);
      if(attrh){
      setSelectedAttributes(prev => ({...prev, [attrh.name]:attrh }));
      }
    });
  }, []);

  const groupedAttrs = sku_attrs?.reduce((acc, attr) => {
    if (!acc[attr.name]) {
      acc[attr.name] = [];
    }
    acc[attr.name].push(attr);
    return acc;
  }, {} as Record<string, typeof sku_attrs>);

  const getSkuByValue = (selectedValues: Record<string, SkuAttr>) => {
    const valueString = Object.values(selectedValues).map(attr => attr.product_sku_attr_id).join('/');
    return sku?.find(s => {
      const skuValues = s.value.split('/');
      return skuValues.every(v => valueString.includes(v));
    });
  };

  // Xử lý khi chọn thuộc tính
  const handleAttributeSelect = (attrName: string, attrId: SkuAttr,image?:string) => {
    if (image && image!="") {
      setSelectedImage(image);
    }

    setSelectedAttributes(prev => ({...prev, [attrName]: attrId}));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Ảnh sản phẩm - sticky */}
      <div className="md:sticky md:top-8 self-start">
        <ProductImageSlider
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          spu={spu}
        />
      </div>

      {/* Thông tin sản phẩm - cuộn bình thường */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{spu?.name}</h2>
        <div className="text-lg font-semibold text-primary mb-2">{selectedSku?.price?.toLocaleString()}₫</div>
        <div className="mb-4 text-gray-600">{spu?.short_description}</div>

        {/* Thuộc tính mô tả */}
        <div className="mb-4">
          {description_attrs?.map(attr => (
            <div key={attr.attr_id} className="text-sm">
              <span className="font-medium">{attr.name}:</span> {attr.value}
            </div>
          ))}
        </div>
        
        {/* Hiển thị các thuộc tính SKU */}
        {groupedAttrs && Object.entries(groupedAttrs).map(([attrName, attrs]) => (
          <div key={attrName} className="mb-4">
            <div className="font-medium mb-1">{attrName}:</div>
            <div className="flex gap-2 flex-wrap">
              {attrs.map(attr => {
                // const isSelected =  selectedSku?.value.split('/').includes(attr.sku_attr_id);
                const isSelected = selectedAttributes[attrName]?.product_sku_attr_id === attr.product_sku_attr_id;
                return (
                  <Button
                    key={attr.product_sku_attr_id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      attr.image && attr.image.data !== "" && "pl-0",
                      " relative transition-all duration-200",
                      isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                      !isSelected && "hover:bg-primary/10"
                    )}
                    onClick={() => handleAttributeSelect(attrName, attr, attr?.image?.data)}
                  >
                    {attr.image && attr.image.data !== "" && (
                      <img 
                        src={handleProductImg(attr?.image?.data)} 
                        alt={attr.value} 
                        width={40} 
                        height={40}
                        className={cn(
                          "mr-2",
                          // !isSelected && "brightness-0 invert" // Làm sáng ảnh khi được chọn
                        )}
                      />
                    )}
                    <span className={cn(
                      "font-medium",
                      isSelected && "text-primary-foreground"
                    )}>
                      {attr.value}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex gap-2 mb-4">
          {t("con_lai")} : <span className="font-bold">{selectedSku?.sku_stock}</span> {t("san_pham")}
        </div>
        {/* Nút hành động */}
        <div className="flex gap-2 mb-4">
          <Button className="flex-1" disabled={selectedSku?.sku_stock === 0}>{t("them_vao_gio_hang")}</Button>
          <Button variant="outline" className="flex-1">{t("yeu_thich")}</Button>
        </div>

        {/* Thông tin thêm */}
        <div className="text-xs text-gray-500 mb-2">
          {t("san_pham_khong_ap_dung_khuyen_mai")}
        </div>
        <div className="bg-gray-100 p-2 rounded text-xs mb-4">
          {t("san_pham_lam_tu_it_nhat_20_vat_lieu_tai_che")}
        </div>

        {/* Mô tả chi tiết */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: spu?.description }} />
      </div>
    </div>
  );
};

export default function Page({ params }: { params: { id: string } }) {
  const t = useTranslations("System")

    const productQuery = useQuery<ProductData, AxiosError<ResponseType>>({
        refetchOnWindowFocus: false,
        queryKey: ['list-HomeSuggestion',params.id],
        queryFn: async () => {
            const response:any = await request.get<ProductSimple>(`${API.product.getDetail}${params.id}`);
            let responseData = response.data?.result?.product ?? [];
            console.log("responseData", responseData)
            return responseData || [];
        },
    });
    
    return <div>
        {productQuery.isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading size="lg" variant="primary" />
            </div>
        ) : productQuery.isSuccess && productQuery.data?.spu ? (
            <ProductDetail 
                description_attrs={productQuery.data?.description_attrs} 
                sku_attrs={productQuery.data?.sku_attrs} 
                sku={productQuery.data?.sku} 
                ratings={productQuery.data?.ratings}
                spu={productQuery.data?.spu}
            />
        ) : (
            <div className="flex items-center justify-center min-h-[400px] text-red-500">
                {t("co_loi_xay_ra_khi_tai_du_lieu")}
            </div>
        )}
    </div>
}

