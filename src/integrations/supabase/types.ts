export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_data: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_date: string
          metric_type: string
          metric_value: number | null
          project_id: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_type: string
          metric_value?: number | null
          project_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type?: string
          metric_value?: number | null
          project_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_tracking: {
        Row: {
          competitor_id: string | null
          competitor_name: string
          created_at: string
          current_rank: number | null
          downloads_estimate: number | null
          id: string
          last_updated: string | null
          platform: string
          previous_rank: number | null
          project_id: string | null
          rating_average: number | null
          revenue_estimate: number | null
          review_count: number | null
        }
        Insert: {
          competitor_id?: string | null
          competitor_name: string
          created_at?: string
          current_rank?: number | null
          downloads_estimate?: number | null
          id?: string
          last_updated?: string | null
          platform: string
          previous_rank?: number | null
          project_id?: string | null
          rating_average?: number | null
          revenue_estimate?: number | null
          review_count?: number | null
        }
        Update: {
          competitor_id?: string | null
          competitor_name?: string
          created_at?: string
          current_rank?: number | null
          downloads_estimate?: number | null
          id?: string
          last_updated?: string | null
          platform?: string
          previous_rank?: number | null
          project_id?: string | null
          rating_average?: number | null
          revenue_estimate?: number | null
          review_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      market_trends: {
        Row: {
          created_at: string
          genre: string
          id: string
          metadata: Json | null
          platform: string
          trend_date: string
          trend_type: string
          trend_value: number
        }
        Insert: {
          created_at?: string
          genre: string
          id?: string
          metadata?: Json | null
          platform: string
          trend_date: string
          trend_type: string
          trend_value: number
        }
        Update: {
          created_at?: string
          genre?: string
          id?: string
          metadata?: Json | null
          platform?: string
          trend_date?: string
          trend_type?: string
          trend_value?: number
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean | null
          id: string
          in_app_enabled: boolean | null
          is_enabled: boolean | null
          notification_type: string
          project_id: string | null
          threshold_value: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          is_enabled?: boolean | null
          notification_type: string
          project_id?: string | null
          threshold_value?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          in_app_enabled?: boolean | null
          is_enabled?: boolean | null
          notification_type?: string
          project_id?: string | null
          threshold_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          organization_id: string | null
          template_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          organization_id?: string | null
          template_data?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          organization_id?: string | null
          template_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          genre: string | null
          id: string
          name: string
          organization_id: string | null
          platform: string | null
          platforms: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          name: string
          organization_id?: string | null
          platform?: string | null
          platforms?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          platform?: string | null
          platforms?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_profiles: {
        Row: {
          budget_range_filter: string | null
          business_model_filter: string | null
          created_at: string | null
          id: string
          mechanics: Json | null
          platform_filter: string | null
          project_id: string
          publisher_filter: string | null
          revenue_filter: string | null
          review_score_filter: string | null
          similarity_threshold: string | null
          target_audience: string | null
          team_size_filter: string | null
          themes: Json | null
          tone: string | null
          unique_features: string | null
          updated_at: string | null
          year_filter: string | null
        }
        Insert: {
          budget_range_filter?: string | null
          business_model_filter?: string | null
          created_at?: string | null
          id?: string
          mechanics?: Json | null
          platform_filter?: string | null
          project_id: string
          publisher_filter?: string | null
          revenue_filter?: string | null
          review_score_filter?: string | null
          similarity_threshold?: string | null
          target_audience?: string | null
          team_size_filter?: string | null
          themes?: Json | null
          tone?: string | null
          unique_features?: string | null
          updated_at?: string | null
          year_filter?: string | null
        }
        Update: {
          budget_range_filter?: string | null
          business_model_filter?: string | null
          created_at?: string | null
          id?: string
          mechanics?: Json | null
          platform_filter?: string | null
          project_id?: string
          publisher_filter?: string | null
          revenue_filter?: string | null
          review_score_filter?: string | null
          similarity_threshold?: string | null
          target_audience?: string | null
          team_size_filter?: string | null
          themes?: Json | null
          tone?: string | null
          unique_features?: string | null
          updated_at?: string | null
          year_filter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signal_profiles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          created_at: string
          date_recorded: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          project_id: string | null
          user_segment: string | null
        }
        Insert: {
          created_at?: string
          date_recorded: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          project_id?: string | null
          user_segment?: string | null
        }
        Update: {
          created_at?: string
          date_recorded?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          project_id?: string | null
          user_segment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_organization: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_org_role: {
        Args: { org_id: string; user_id: string }
        Returns: string
      }
      is_organization_member: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      user_can_access_org: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      organization_role: "owner" | "admin" | "member" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      organization_role: ["owner", "admin", "member", "viewer"],
    },
  },
} as const
