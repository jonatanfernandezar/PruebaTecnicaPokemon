
export interface User {
    name: string;
    email: string;
    password: string;
    role?: string;
    is_super_admin?: boolean;
    token: string;
}

export interface Pokemon {
    name: string;
    price: number;
    description: string;
}

export interface PaymentData {
    token_card: string;
    amount: number;
    description: string;
}

export interface EpaycoResponse {
    success: boolean;
    data: {
      token_id: string;
    };
}