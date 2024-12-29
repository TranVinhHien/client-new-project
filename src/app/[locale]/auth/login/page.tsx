"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import API from "@/assets/configs/api"
import * as  requestNoToken from "@/assets/helpers/request_without_token"

import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN, INFO_USER, REFERSH_TOKEN } from "@/assets/configs/request"
import { cookies } from "@/assets/helpers"
import { useRouter } from "@/i18n/routing"
export default function LoginForm() {
    const t = useTranslations("Login")
    const router = useRouter()

    const LoginMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: async (data) => {
            const response = await requestNoToken.post(API.base + API.user.login, {
                username: data.username, password: data.password
            });
            return response.data.result;
        },
    });
    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const loginData = {
            username: formData.get("username"),
            password: formData.get("password"),
        };
        LoginMutation.mutate(loginData, {
            onSuccess: (response) => {
                try {
                    const decodedACC: any = jwtDecode(response.access_token);
                    const decodedREF: any = jwtDecode(response.refresh_token);
                    const user: any = response.user
                    cookies.setCookieValues(ACCESS_TOKEN, response.access_token, decodedACC?.exp)
                    cookies.setCookieValues(REFERSH_TOKEN, response.refresh_token, decodedREF?.exp)
                    localStorage.setItem(INFO_USER, JSON.stringify(user))
                    return router.push("/");
                } catch (error) {
                    console.log(error)
                }
            },


        });
    };
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t("title")}</CardTitle>
                            <CardDescription>
                                {t("description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username"> {t("username_label")}</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            placeholder="hienlazada"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password"> {t("password_label")}</Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                {t("forgot_password")}
                                            </a>
                                        </div>
                                        <Input autoComplete="Current-password" id="password" name="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        {t("login_button")}
                                    </Button>
                                    <Button variant="outline" className="w-full" >
                                        {t("login_with_google")}
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    {t("sign_up_prompt")}
                                    <a href="#" className="underline underline-offset-4">
                                        {t("sign_up")}
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>


    )
}
