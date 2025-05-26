"use client"

import API from "@/assets/configs/api";
import { handleProductImg } from "@/assets/configs/handle_img";
import * as request from "@/assets/helpers/request_without_token";
import { MetaType, ParamType } from "@/assets/types/request";
import C_ProductSimple from "@/resources/components_thuongdung/product";
import productSimple from "@/resources/components_thuongdung/product";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Search, StarIcon, Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}


export default function SearchPage() {
  const [searchImage, setSearchImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load image from localStorage when component mounts
    const storedImage = localStorage.getItem('searchImage');
    if (storedImage) {
      setSearchImage(storedImage);
      // Clear the image from localStorage after loading
    }
  }, []);
  const t = useTranslations("System")

const API_BASE = 'http://172.16.54.239:5000'; // hoặc API.product.semanticSearch nếu đã có

const SearchQuery = useQuery<ProductSimple[], AxiosError<ResponseType>>({
    refetchOnWindowFocus: false,
    queryKey: ['img-search-products', searchImage],
    enabled: !!searchImage, // tránh gọi khi query null hoặc rỗng
    queryFn: async () => {
      const formData = new FormData();
      formData.append('file', base64ToFile(searchImage?searchImage:"", 'search_image.png'));
    const response = await fetch(`${API_BASE}/products/image-search`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
  
  const data: any = await response.json();
      const products = data.products ?? [];
      const updatedProducts = products.map((product:any) => {
        const { product_spu_id, ...rest } = product;
        return {
          ...rest,
          products_spu_id: product_spu_id,
        };
      });
      
      return updatedProducts;

    },
  });

  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto">
        {/* Image Search Display */}
        {searchImage && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t("hinh_anh_tim_kiem")}</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-72 h-72 rounded-lg overflow-hidden border-2 ">
                <img 
                  src={searchImage} 
                  alt="Search image" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                {SearchQuery.isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[hsl(var(--primary))]"></div>
                    <span className="text-gray-600">{t("dang_tim_kiem")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {SearchQuery.data?.map((product,index) => (
            <C_ProductSimple key={index} product={product}/>
          ))}
        </div>

        {/* Loading State */}
        {SearchQuery.isLoading && !searchImage && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee4d2d]"></div>
          </div>
        )}

        {/* No Results */}
        {!SearchQuery.isLoading && SearchQuery.data?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">{t("khong_tim_thay_san_pham_phu_hop")}</p>
          </div>
        )}
      </div>
    </div>
  );
} 