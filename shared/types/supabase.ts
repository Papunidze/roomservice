export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bookings: {
        Row: {
          business_id: string;
          client_id: string | null;
          created_at: string;
          ends_at: string;
          id: string;
          note: string | null;
          price_tetri: number | null;
          service_id: string | null;
          staff_id: string | null;
          starts_at: string;
          status: Database["public"]["Enums"]["booking_status"];
          updated_at: string;
        };
        Insert: {
          business_id: string;
          client_id?: string | null;
          created_at?: string;
          ends_at: string;
          id?: string;
          note?: string | null;
          price_tetri?: number | null;
          service_id?: string | null;
          staff_id?: string | null;
          starts_at: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          client_id?: string | null;
          created_at?: string;
          ends_at?: string;
          id?: string;
          note?: string | null;
          price_tetri?: number | null;
          service_id?: string | null;
          staff_id?: string | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      businesses: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          plan: Database["public"]["Enums"]["subscription_plan"];
          slug: string;
          subscription_status: Database["public"]["Enums"]["subscription_status"];
          timezone: string;
          trial_ends_at: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          phone?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          slug: string;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
          timezone?: string;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          slug?: string;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
          timezone?: string;
          trial_ends_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          business_id: string;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          notes: string | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clients_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          business_id: string;
          channel: Database["public"]["Enums"]["channel"];
          client_id: string | null;
          created_at: string;
          external_id: string;
          id: string;
          last_message_at: string | null;
          status: Database["public"]["Enums"]["conversation_status"];
          updated_at: string;
        };
        Insert: {
          business_id: string;
          channel: Database["public"]["Enums"]["channel"];
          client_id?: string | null;
          created_at?: string;
          external_id: string;
          id?: string;
          last_message_at?: string | null;
          status?: Database["public"]["Enums"]["conversation_status"];
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          channel?: Database["public"]["Enums"]["channel"];
          client_id?: string | null;
          created_at?: string;
          external_id?: string;
          id?: string;
          last_message_at?: string | null;
          status?: Database["public"]["Enums"]["conversation_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          author: Database["public"]["Enums"]["message_author"];
          business_id: string;
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          model: string | null;
          tokens_in: number | null;
          tokens_out: number | null;
        };
        Insert: {
          author: Database["public"]["Enums"]["message_author"];
          business_id: string;
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          model?: string | null;
          tokens_in?: number | null;
          tokens_out?: number | null;
        };
        Update: {
          author?: Database["public"]["Enums"]["message_author"];
          business_id?: string;
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          model?: string | null;
          tokens_in?: number | null;
          tokens_out?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          business_id: string;
          created_at: string;
          description: string | null;
          duration_minutes: number;
          id: string;
          is_active: boolean;
          name: string;
          price_tetri: number;
          updated_at: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          description?: string | null;
          duration_minutes: number;
          id?: string;
          is_active?: boolean;
          name: string;
          price_tetri: number;
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          id?: string;
          is_active?: boolean;
          name?: string;
          price_tetri?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      staff: {
        Row: {
          business_id: string;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_active: boolean;
          phone: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          phone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "staff_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      users_businesses: {
        Row: {
          business_id: string;
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["business_role"];
          user_id: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["business_role"];
          user_id: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["business_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_businesses_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_business_admin: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      is_business_member: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      booking_status:
        "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
      business_role: "owner" | "admin" | "staff";
      channel: "instagram" | "whatsapp" | "web";
      conversation_status: "open" | "handoff" | "closed";
      message_author: "customer" | "assistant" | "human";
      subscription_plan: "start" | "business" | "pro";
      subscription_status: "trialing" | "active" | "past_due" | "canceled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      business_role: ["owner", "admin", "staff"],
      channel: ["instagram", "whatsapp", "web"],
      conversation_status: ["open", "handoff", "closed"],
      message_author: ["customer", "assistant", "human"],
      subscription_plan: ["start", "business", "pro"],
      subscription_status: ["trialing", "active", "past_due", "canceled"],
    },
  },
} as const;
