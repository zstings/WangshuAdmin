declare global {
  interface UserInfo {
    id?: number;
    top_user_id?: number;
    from_user_id?: number;
    username?: string;
    nickname?: string;
    phone?: null;
    email?: null;
    avatar?: null;
    status?: number;
    commission_mode?: number;
    commission_rate?: string;
    discount_rate?: string;
    alipay_name?: null;
    alipay_account?: null;
    is_agent_user?: number;
    is_create_agent?: number;
    distributor_link?: string;
    total_income?: string;
    login_ip?: null;
    login_time?: null;
    created_at?: string;
    updated_at?: string;
    uid?: string;
    from_uid?: string;
    top_uid?: string;
  }
}

export {};
