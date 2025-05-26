"use client"

import API from "@/assets/configs/api";
import { handleProductImg } from "@/assets/configs/handle_img";
import * as request from "@/assets/helpers/request_without_token";
import { MetaType, ParamType } from "@/assets/types/request";
import C_ProductSimple from "@/resources/components_thuongdung/product";
import productSimple from "@/resources/components_thuongdung/product";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Search, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";




export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') ;
  const t = useTranslations("System")


const API_BASE = 'http://172.16.54.239:5000'; // hoặc API.product.semanticSearch nếu đã có

const SearchQuery = useQuery<ProductSimple[], AxiosError<ResponseType>>({
    refetchOnWindowFocus: false,
    queryKey: ['semantic-search-products', query],
    enabled: !!query, // tránh gọi khi query null hoặc rỗng
    queryFn: async () => {
      const payload: any = {
        query: query ?? '',
        page: 1,
        top_k: 50,
      };
      const response = await fetch(`${API_BASE}/products/semantic-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
if (query === "") {
  return <div></div>;
}
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto">
        {/* Category Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
             { !SearchQuery.isLoading? t("ket_qua_tim_kiem_cho") +" "+query:t("dang_tim_kiem")}
            </h1>
          </div>

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {SearchQuery.data?.map((product) => (
          <C_ProductSimple product={product}/>
          ))}
        </div>

        {/* Loading State */}
        {SearchQuery.isLoading && (
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