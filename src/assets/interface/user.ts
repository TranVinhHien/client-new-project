interface Role {
    id: string;
    name: string;
    code: string;
}


interface UserLoginType {
    id: string;
    username: string;
    isGraduate: number;
    roles: Role[];
}