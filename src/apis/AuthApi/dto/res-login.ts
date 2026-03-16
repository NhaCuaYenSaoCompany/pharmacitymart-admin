interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface Role {
    id: number;
    name: string;
    desc: string | null;
}

export interface Permission {
    id: number;
    name: string;
    desc: string;
    groupName: string;
}

export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    username: string;
    password: string;
    avatar: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    roomName: string | null;
    gender: boolean;
    address: string | null;
    refreshToken: string;
    isOnline: boolean;
    lastActiveAt: string | null;
    userRoles: string[];
}

interface Info {
    user: User;
    roles: Role[];
    permissions: Permission[];
}

export interface ResLogin {
    token: Token;
    info: Info;
}
