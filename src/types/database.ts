export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "customer" | "admin";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string;
          price: number;
          old_price: number | null;
          discount: number | null;
          stock_quantity: number;
          stock_status: "in_stock" | "out_of_stock" | "low_stock";
          sku: string;
          short_description: string;
          full_description: string;
          specifications: Json;
          main_image: string;
          gallery_images: string[];
          video_url: string | null;
          featured: boolean;
          related_product_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id: string;
          price: number;
          old_price?: number | null;
          discount?: number | null;
          stock_quantity: number;
          stock_status?: "in_stock" | "out_of_stock" | "low_stock";
          sku: string;
          short_description: string;
          full_description: string;
          specifications?: Json;
          main_image: string;
          gallery_images?: string[];
          video_url?: string | null;
          featured?: boolean;
          related_product_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          category_id?: string;
          price?: number;
          old_price?: number | null;
          discount?: number | null;
          stock_quantity?: number;
          stock_status?: "in_stock" | "out_of_stock" | "low_stock";
          sku?: string;
          short_description?: string;
          full_description?: string;
          specifications?: Json;
          main_image?: string;
          gallery_images?: string[];
          video_url?: string | null;
          featured?: boolean;
          related_product_ids?: string[] | null;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string | null;
          postal_code: string | null;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state?: string | null;
          postal_code?: string | null;
          country: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          phone?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string | null;
          postal_code?: string | null;
          country?: string;
          is_default?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          payment_status: "pending" | "under_review" | "approved" | "rejected";
          payment_method: "bank_transfer" | "card" | "cod";
          subtotal: number;
          shipping_fee: number;
          total: number;
          notes: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          shipping_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "under_review" | "approved" | "rejected";
          payment_method: "bank_transfer" | "card" | "cod";
          subtotal: number;
          shipping_fee?: number;
          total: number;
          notes?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          shipping_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "under_review" | "approved" | "rejected";
          payment_method?: "bank_transfer" | "card" | "cod";
          subtotal?: number;
          shipping_fee?: number;
          total?: number;
          notes?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string;
          shipping_address?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_slug: string;
          product_image: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_slug: string;
          product_image: string;
          unit_price: number;
          quantity: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          subtotal?: number;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          product_id?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          method: "bank_transfer" | "card" | "cod";
          status: "pending" | "under_review" | "approved" | "rejected";
          proof_url: string | null;
          instructions: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          method: "bank_transfer" | "card" | "cod";
          status?: "pending" | "under_review" | "approved" | "rejected";
          proof_url?: string | null;
          instructions?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          method?: "bank_transfer" | "card" | "cod";
          status?: "pending" | "under_review" | "approved" | "rejected";
          proof_url?: string | null;
          instructions?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
