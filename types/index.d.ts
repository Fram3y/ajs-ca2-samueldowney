export interface StoreType {
    data: {
        _id: string;
        name: string;
        address: string;
        supplier_id: string[];
        isDeleted?: boolean;
    }
}

export interface StoreTypeID extends StoreType {
    _id: string;
    name: string;
    address: string;
    supplier_id: string[];
    isDeleted?: boolean;
}

export interface SupplierType {
    data: {
        _id: string;
        name: string;
        product_id: string[];
        store_id: string[];
        isDeleted?: boolean;
    }
}

export interface SupplierTypeID extends SupplierType {
    _id: string;
    name: string;
    product_id: string[];
    store_id: string[];
    isDeleted?: boolean;
}

export interface RoleType {
    data: {
        _id: string;
        title: string;
        description: string;
        isDeleted?: boolean;
    }
}

export interface RoleTypeID extends RoleType {
    _id: string;
    title: string;
    description: string;
    isDeleted?: boolean;
}

export interface ProductType {
    data: {
        _id: string;
        name: string;
        description: string;
        price: number;
        isDeleted?: boolean;
    }
}

export interface ProductTypeID extends ProductType {
    _id: string;
    name: string;
    description: string;
    price: number;
    isDeleted?: boolean;
}

export interface EntityType {
    _id: string;
    [key: string]: any;
}

export interface EmployeeType {
    data: {
        _id: string;
        name: string;
        email: string;
        address: string;
        dob: date;
        phone_number: string;
        store_id: string[];
        role_id: string[];
        isDeleted?: boolean;
    }
}

export interface EmployeeTypeID extends EmployeeType {
    _id: string;
    name: string;
    email: string;
    address: string;
    dob: date;
    phone_number: string;
    store_id: string[];
    role_id: string[];
    isDeleted?: boolean;
}

export interface IAuthContext {
    signIn: (token: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}

export type IResponseType = StoreTypeID