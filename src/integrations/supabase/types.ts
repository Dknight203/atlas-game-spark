export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string | null
          id: string
          meta: Json
          org_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meta: Json
          org_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meta?: Json
          org_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      campaign_posts: {
        Row: {
          campaign_id: string
          channel: string
          copy: string | null
          game_id: string | null
          id: string
          planned_at: string | null
          status: string | null
        }
        Insert: {
          campaign_id: string
          channel: string
          copy?: string | null
          game_id?: string | null
          id?: string
          planned_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string
          channel?: string
          copy?: string | null
          game_id?: string | null
          id?: string
          planned_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_posts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          id: string
          name: string
          org_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          org_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      community_opportunities: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          metrics: Json
          platform: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          metrics: Json
          platform: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          metrics?: Json
          platform?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_opportunities_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
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
      creators: {
        Row: {
          external_id: string
          handle: string | null
          id: string
          last_contacted: string | null
          org_id: string
          platform: string
          stats: Json | null
          url: string | null
        }
        Insert: {
          external_id: string
          handle?: string | null
          id?: string
          last_contacted?: string | null
          org_id: string
          platform: string
          stats?: Json | null
          url?: string | null
        }
        Update: {
          external_id?: string
          handle?: string | null
          id?: string
          last_contacted?: string | null
          org_id?: string
          platform?: string
          stats?: Json | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      game_signals: {
        Row: {
          fetched_at: string | null
          game_id: string
          id: string
          payload: Json
          source: string
        }
        Insert: {
          fetched_at?: string | null
          game_id: string
          id?: string
          payload: Json
          source: string
        }
        Update: {
          fetched_at?: string | null
          game_id?: string
          id?: string
          payload?: Json
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_signals_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          genres: Json | null
          id: string
          igdb_id: number | null
          org_id: string
          platforms: Json | null
          rawg_id: number | null
          steam_appid: number | null
          tags: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          genres?: Json | null
          id?: string
          igdb_id?: number | null
          org_id: string
          platforms?: Json | null
          rawg_id?: number | null
          steam_appid?: number | null
          tags?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          genres?: Json | null
          id?: string
          igdb_id?: number | null
          org_id?: string
          platforms?: Json | null
          rawg_id?: number | null
          steam_appid?: number | null
          tags?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      marketing_metrics: {
        Row: {
          campaign_id: string
          channel: string | null
          clicks: number | null
          conversions: number | null
          id: string
          impressions: number | null
          period_end: string | null
          period_start: string | null
          revenue: number | null
        }
        Insert: {
          campaign_id: string
          channel?: string | null
          clicks?: number | null
          conversions?: number | null
          id?: string
          impressions?: number | null
          period_end?: string | null
          period_start?: string | null
          revenue?: number | null
        }
        Update: {
          campaign_id?: string
          channel?: string | null
          clicks?: number | null
          conversions?: number | null
          id?: string
          impressions?: number | null
          period_end?: string | null
          period_start?: string | null
          revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          matched_game: Json
          score: number
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          matched_game: Json
          score: number
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          matched_game?: Json
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
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
          plan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          plan?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          plan?: string
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
      usage_counters: {
        Row: {
          count: number
          id: string
          key: string
          org_id: string
          period_end: string
          period_start: string
          updated_at: string | null
        }
        Insert: {
          count?: number
          id?: string
          key: string
          org_id: string
          period_end: string
          period_start: string
          updated_at?: string | null
        }
        Update: {
          count?: number
          id?: string
          key?: string
          org_id?: string
          period_end?: string
          period_start?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_counters_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      generate_invitation_token: { Args: never; Returns: string }
      get_user_org_role: {
        Args: { org_id: string; user_id: string }
        Returns: string
      }
      is_organization_member: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      user_can_access_org: { Args: { org_id: string }; Returns: boolean }
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
