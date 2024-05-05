export type User = {
    id: string;
    email: string;
    name?: string | null;
    isverified: boolean;
    isadmin: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    forgotPasswordToken?: string | null;
    forgotPasswordTokenExpiry?: Date | null;
    verifyToken?: string | null;
    verifyTokenExpiry?: Date | null;
  };
  