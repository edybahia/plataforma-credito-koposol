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
      integradores: {
        Row: {
          cnpj: string | null
          created_at: string
          email: string
          endereco: string | null
          id: string
          nome_empresa: string
          status: string | null
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          email: string
          endereco?: string | null
          id?: string
          nome_empresa: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          email?: string
          endereco?: string | null
          id?: string
          nome_empresa?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integradores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kits_referencia: {
        Row: {
          conta_energia: number
          created_at: string | null
          estrutura: string
          geracao_sistema: number
          id: number
          marca_inversor: string
          marca_modulo: string
          potencia_inversor: number
          potencia_modulo: number
          potencia_sistema: number
          qtd_modulos: number
          valor_kit: number
        }
        Insert: {
          conta_energia: number
          created_at?: string | null
          estrutura: string
          geracao_sistema: number
          id?: number
          marca_inversor: string
          marca_modulo: string
          potencia_inversor: number
          potencia_modulo: number
          potencia_sistema: number
          qtd_modulos: number
          valor_kit: number
        }
        Update: {
          conta_energia?: number
          created_at?: string | null
          estrutura?: string
          geracao_sistema?: number
          id?: number
          marca_inversor?: string
          marca_modulo?: string
          potencia_inversor?: number
          potencia_modulo?: number
          potencia_sistema?: number
          qtd_modulos?: number
          valor_kit?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      propostas: {
        Row: {
          created_at: string
          data_validade: string | null
          email_cliente: string | null
          endereco_instalacao: string | null
          id: string
          integrador_id: string
          nome_cliente: string
          observacoes: string | null
          simulacao_id: string | null
          status: string | null
          telefone_cliente: string | null
          updated_at: string
          valor_proposta: number | null
        }
        Insert: {
          created_at?: string
          data_validade?: string | null
          email_cliente?: string | null
          endereco_instalacao?: string | null
          id?: string
          integrador_id: string
          nome_cliente: string
          observacoes?: string | null
          simulacao_id?: string | null
          status?: string | null
          telefone_cliente?: string | null
          updated_at?: string
          valor_proposta?: number | null
        }
        Update: {
          created_at?: string
          data_validade?: string | null
          email_cliente?: string | null
          endereco_instalacao?: string | null
          id?: string
          integrador_id?: string
          nome_cliente?: string
          observacoes?: string | null
          simulacao_id?: string | null
          status?: string | null
          telefone_cliente?: string | null
          updated_at?: string
          valor_proposta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "propostas_integrador_id_fkey"
            columns: ["integrador_id"]
            isOneToOne: false
            referencedRelation: "integradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_simulacao_id_fkey"
            columns: ["simulacao_id"]
            isOneToOne: false
            referencedRelation: "simulacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      simulacoes: {
        Row: {
          area_necessaria: number | null
          cidade: string | null
          conta_energia: number | null
          data_simulacao: string | null
          economia_25_anos: number | null
          economia_anual: number | null
          economia_mensal: number | null
          estado: string | null
          id: string
          impacto_arvores: number | null
          impacto_co2: number | null
          investimento_maximo: number | null
          investimento_minimo: number | null
          nome_usuario: string
          potencia_inversor: number | null
          potencia_painel: number | null
          potencia_sistema: number | null
          qtd_paineis: number | null
          quer_ligacao: boolean | null
          retorno_estimado: number | null
          telefone: string | null
          tipo_inversor: string | null
        }
        Insert: {
          area_necessaria?: number | null
          cidade?: string | null
          conta_energia?: number | null
          data_simulacao?: string | null
          economia_25_anos?: number | null
          economia_anual?: number | null
          economia_mensal?: number | null
          estado?: string | null
          id?: string
          impacto_arvores?: number | null
          impacto_co2?: number | null
          investimento_maximo?: number | null
          investimento_minimo?: number | null
          nome_usuario: string
          potencia_inversor?: number | null
          potencia_painel?: number | null
          potencia_sistema?: number | null
          qtd_paineis?: number | null
          quer_ligacao?: boolean | null
          retorno_estimado?: number | null
          telefone?: string | null
          tipo_inversor?: string | null
        }
        Update: {
          area_necessaria?: number | null
          cidade?: string | null
          conta_energia?: number | null
          data_simulacao?: string | null
          economia_25_anos?: number | null
          economia_anual?: number | null
          economia_mensal?: number | null
          estado?: string | null
          id?: string
          impacto_arvores?: number | null
          impacto_co2?: number | null
          investimento_maximo?: number | null
          investimento_minimo?: number | null
          nome_usuario?: string
          potencia_inversor?: number | null
          potencia_painel?: number | null
          potencia_sistema?: number | null
          qtd_paineis?: number | null
          quer_ligacao?: boolean | null
          retorno_estimado?: number | null
          telefone?: string | null
          tipo_inversor?: string | null
        }
        Relationships: []
      }
      simulator_configs: {
        Row: {
          allow_overload: boolean
          created_at: string | null
          custo_instalacao_watt: number
          eficiencia_painel: number
          gtm_body: string | null
          gtm_head: string | null
          id: string
          margem_seguranca: number
          media_irradiacao: number
          panel_power: number
          perda_sistema: number
          preco_kwh: number
          updated_at: string | null
          vida_util_sistema: number
        }
        Insert: {
          allow_overload?: boolean
          created_at?: string | null
          custo_instalacao_watt: number
          eficiencia_painel: number
          gtm_body?: string | null
          gtm_head?: string | null
          id?: string
          margem_seguranca: number
          media_irradiacao: number
          panel_power: number
          perda_sistema: number
          preco_kwh: number
          updated_at?: string | null
          vida_util_sistema: number
        }
        Update: {
          allow_overload?: boolean
          created_at?: string | null
          custo_instalacao_watt?: number
          eficiencia_painel?: number
          gtm_body?: string | null
          gtm_head?: string | null
          id?: string
          margem_seguranca?: number
          media_irradiacao?: number
          panel_power?: number
          perda_sistema?: number
          preco_kwh?: number
          updated_at?: string | null
          vida_util_sistema?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { table_name: string }
        Returns: {
          table_exists: boolean
        }[]
      }
      create_kits_referencia_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      inserir_integrador: {
        Args: {
          nome_empresa: string
          cnpj: string
          email: string
          telefone: string
          endereco: string
          status?: string
          nome_titular?: string
          cpf_titular?: string
          telefone_titular?: string
          email_titular?: string
          user_id?: string
        }
        Returns: {
          id: string
          status: string
        }
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
