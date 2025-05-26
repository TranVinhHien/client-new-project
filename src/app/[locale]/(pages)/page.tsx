"use client"

import API from "@/assets/configs/api";
import { handleProductImg } from "@/assets/configs/handle_img";
import * as request from "@/assets/helpers/request_without_token";
import { MetaType, ParamType } from "@/assets/types/request";
import C_ProductSimple from "@/resources/components_thuongdung/product";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Star, StarHalf, StarIcon, StarOffIcon, Stars, StarsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useRef,useState } from "react";


export default function Home() {
  const t = useTranslations("System")

    
  const [meta, setMeta] = useState<MetaType>(request.defaultMeta);
  const paramsRef = useRef<ParamType>({
      page: meta.currentPage,
      limit: 60,    
      orderBy: 'id',
      orderDirection: 'ASC',
  });
   
  const DeparmentQuery = useQuery<ProductSimple[], AxiosError<ResponseType>>({
    refetchOnWindowFocus: false,
    queryKey: ['list-HomeSuggestion'],
    queryFn: async () => {
        const response:any = await request.get<ProductSimple[]>(`${API.product.getAll}`, {
            params: paramsRef.current
        });
        let responseData = response.data?.result.products ?? [];

        if (response.data?.result.currentPage && response.data?.result.totalPages) {
            setMeta({
                currentPage: response.data?.result.currentPage,
                hasNextPage: response.data?.result.currentPage + 1 === response.data?.result.totalPages ? false : true,
                hasPreviousPage: response.data?.result.currentPage - 1 === 0 ? false : true,
                limit: paramsRef.current.limit,
                totalPages: response.data?.result.totalPages,
            });
        }
        return responseData || [];
    },
});

    return (
      <div className="pt-36">

        <div className="grid  grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CategorySection t={t} />
      <div className="mb-64" /> {/* Khoảng trắng giữa Category và TopSearchSection */}
      {DeparmentQuery.isSuccess && <TopSearchSection items={DeparmentQuery.data ?? []} t={t} />}
      <div className="mb-8" />
      {DeparmentQuery.isSuccess && <HomeSuggestion products={DeparmentQuery.data ?? []} t={t} />}
            
      </div>
        </div>
    );
}


function TopSearchSection({ items , t }: { items: any[],t:any }) {
  // Hiển thị tối đa 4 item, nếu nhiều hơn thì cho scroll ngang và hiện mũi tên
  const showArrow = items?.length > 4;
  return (
    <div className="w-full">
    <section className="bg-[#f5f5f5] py-4 px-6 rounded-lg mb-8 w-full "> {/* mb-8 để tạo khoảng cách dưới */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-[#ee4d2d]">{t("tim_kiem_hang_dau")}</span>
        <a href="#" className="text-sm text-[#ee4d2d] hover:underline">{t("xem_tat_ca")} &gt;</a>
      </div>
      <div className="relative">
        <div className={`grid grid-cols-4 gap-4 ${showArrow ? 'overflow-x-auto scrollbar-hide' : ''}`}
             style={{ minWidth: showArrow ? 0 : 'unset' }}>
          {items.length > 0 && items?.slice(0, 4).map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow border flex flex-col items-center p-3 relative">
              <div className="absolute left-2 top-2 bg-[#ee4d2d] text-white text-xs font-bold px-2 py-0.5 rounded">TOP</div>
              <img src={handleProductImg(item.image)} alt={item.name} className="w-16 h-16 object-contain mb-2" />
              <div className="text-lg font-bold text-red-500 mb-1">{item.price.toLocaleString()}₫</div>
              <div className="text-sm text-gray-700 text-center line-clamp-2">{item.name}</div>
            </div>
          ))}
        </div>
        {showArrow && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 cursor-pointer z-10">
            <svg width="24" height="24" fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}

function HomeSuggestion({ products , t}: { products: any[],t:any }) {
  return (
    <div className="w-full">
    <section className="bg-[#f5f5f5] py-4 px-6 rounded-lg mb-8 w-full"> {/* mb-8 để tạo khoảng cách dưới */}
      <div className="flex items-center border-b-2 border-[#ee4d2d] pb-2 mb-4">
        <span className="text-lg font-bold text-[#ee4d2d] uppercase tracking-wider">{t("goi_y_hom_nay")}</span>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {products.length > 0 && products?.map(product => (
                 <C_ProductSimple product={product}/>
        ))}
      </div>
    </section>
    </div>
  );
}

const categories = [
    { name: "Thời Trang Nam", image: "http://localhost:8080/v1/media/products?id=images/trang-suc-thoi-trang___charm___vong-lac-charm-co-ban/117639675_0.jpg" },
    { name: "Điện Thoại & Phụ Kiện", image: "http://localhost:8080/v1/media/products?id=images/phu-kien-thoi-trang___phu-kien-nam___vo-tat-nam/42772402_0.jpg" },
    { name: "Thiết Bị Điện Tử", image: "http://localhost:8080/v1/media/products?id=images/tui-xach___vi-bop-nu___vi-bop-nu-khac/119292097_0.jpg" },
    { name: "Máy Tính & Laptop", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Máy Ảnh & Máy Quay Phim", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Đồng Hồ", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___ao-vest-blazer___ao-vest/116280952_0.jpg" },
    { name: "Giày Dép Nam", image: "http://localhost:8080/v1/media/products?id=images/trang-suc-thoi-trang___day-chuyen-vong-co___day-chuyen-mat/17129368_0.jpg" },
    { name: "Thiết Bị Điện Gia Dụng", image: "http://localhost:8080/v1/media/products?id=images/trang-suc-thoi-trang___charm___vong-lac-charm-co-ban/117639675_0.jpg" },
    { name: "Thể Thao & Du Lịch", image: "http://localhost:8080/v1/media/products?id=images/phu-kien-thoi-trang___phu-kien-nam___vo-tat-nam/42772402_0.jpg" },
    { name: "Ô Tô & Xe Máy & Xe Đạp", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nu___do-doi-nam-nu___ao-so-mi-cap/13563701_0.jpg" },
    { name: "Thời Trang Nữ", image: "http://localhost:8080/v1/media/products?id=images/phu-kien-thoi-trang___phu-kien-nam___vo-tat-nam/42772402_0.jpg" },
    { name: "Mẹ & Bé", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Nhà Cửa & Đời Sống", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Sắc Đẹp", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Sức Khỏe", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nam___quan-shorts-nam___quan-shorts-kaki/112096144_0.jpg" },
    { name: "Giày Dép Nữ", image: "http://localhost:8080/v1/media/products?id=images/trang-suc-thoi-trang___charm___vong-lac-charm-co-ban/117639675_0.jpg" },
    { name: "Túi Ví Nữ", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nu___do-doi-nam-nu___ao-so-mi-cap/13563701_0.jpg" },
    { name: "Phụ Kiện & Trang Sức Nữ", image: "http://localhost:8080/v1/media/products?id=images/thoi-trang-nu___do-doi-nam-nu___ao-so-mi-cap/13563701_0.jpg" },
    { name: "Bách Hóa Online", image: "http://localhost:8080/v1/media/products?id=images/giay-dep___giay-sandals-nu___giay-sandal-nu-de-xuong/117595430_0.jpg" },
    { name: "Nhà Sách Online", image: "http://localhost:8080/v1/media/products?id=images/tui-xach___vi-bop-nu___vi-bop-nu-khac/119292097_0.jpg" },
  ];
  
   function CategorySection({t}:{t:any}) {
    return (
         <div className="w-full">
    <section className="bg-[#f5f5f5] py-6 px-6 rounded-lg mb-6">
    <div className="text-2xl font-semibold mb-4 text-gray-700">{t("danh_muc")}</div>
    <div className="grid grid-cols-10 gap-y-8 gap-x-0 bg-white rounded-lg overflow-hidden border">
      {categories.map((cat, idx) => (
        <div
          key={cat.name}
          className="flex flex-col items-center justify-center py-6 border-r border-b last:border-r-0"
          style={{
            borderRight: (idx + 1) % 10 === 0 ? "none" : undefined,
            borderBottom: idx >= 10 ? "none" : undefined,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <img src={cat.image} alt={cat.name} className="w-12 h-12 object-contain" style={{ borderRadius: '50%' }}/>
          </div>
          <div className="text-center text-sm text-gray-700 font-medium w-24 truncate">
            {cat.name}
          </div>
        </div>
      ))}
    </div>
  </section>
      </div>
    );
  }