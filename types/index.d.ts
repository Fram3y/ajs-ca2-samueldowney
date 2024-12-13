export interface StoreType {
    name: string;
    address: string;
    supplier_id: array;
    isDeleted?: boolean;
}

export interface SupplierType {
    name: string;
    product_id: array;
    store_id: array;
    isDeleted?: boolean;
}

export interface StoreTypeID extends StoreType {
    _id: string;
}

export interface SupplierTypeID extends SupplierType {
    _id: string;
}

export interface IAuthContext {
    signIn: (token:string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}

export type IResponseType = StoreTypeID