export interface StoreType {
    name: string;
    address: string;
    supplier_id: array;
    isDeleted: boolean;
    end_date: string;
}

export interface StoreTypeID extends StoreType {
    _id: string;
}

export interface IAuthContext {
    signIn: (token:string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}

export type IResponseType = StoreTypeID