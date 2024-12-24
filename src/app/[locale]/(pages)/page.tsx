"use client"
import API from "@/assets/configs/api";
import { request } from "@/assets/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";


export default function Home() {
    const ListResearchListQuery = useQuery<any, AxiosError<ResponseType>>({
        queryKey: ['dalogin-ghi'],
        queryFn: async () => {

            const response = await request.get<any>(`${API.dalogin.ghi}`);
            return response.data.result
        },
    });
    console.log(ListResearchListQuery.data)
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">


            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                {ListResearchListQuery.data && <CardContent>
                    <p>role người dùng: {ListResearchListQuery?.data?.aud}</p>
                    <p>ngày tạo token: {new Date(ListResearchListQuery?.data?.iat * 1000).toString()}</p>
                    <p>ngày hết hạn: {new Date(ListResearchListQuery?.data?.exp * 1000).toString()}</p>
                    <p>nơi tạo token: {ListResearchListQuery?.data?.iss}</p>
                    <p>chủ sở hữu token: {ListResearchListQuery?.data?.sub}</p>
                </CardContent>}

                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>

            <Button>Xin click</Button>
        </div>
    );
}

