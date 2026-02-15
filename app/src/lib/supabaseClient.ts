
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zagreshhrbxlhumbqkcf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZ3Jlc2hocmJ4bGh1bWJxa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODY1NzAsImV4cCI6MjA4NjQ2MjU3MH0.EBd7AIiJ057X00ARSqNIRgqsHR3WgE3qVWJGjwtvw7I';

const isDev = (import.meta as any).env.DEV;

let supabaseInstance;

if (isDev && typeof window !== 'undefined') {
    if (!(window as any)._supabaseInstance) {
        (window as any)._supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    supabaseInstance = (window as any)._supabaseInstance;
} else {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = supabaseInstance;

export async function getMarketingPosts() {
    const { data, error } = await supabase
        .from('marketing_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching marketing posts:', error);
        return [];
    }

    return data;
}

export async function getDashboardStats() {
    const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*');

    if (error) {
        console.error('Error fetching dashboard stats:', error);
        return [];
    }

    return data;
}

export async function getActivityLogs() {
    const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }

    return data;
}

export async function saveCreativeResult(keyword: string, mode: string, result: any) {
    const { data, error } = await supabase
        .from('creative_generations')
        .insert([
            { keyword: keyword, agent_mode: mode, result_json: result }
        ])
        .select();

    if (error) {
        console.error('Error saving creative result:', error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function getCreativeHistory() {
    const { data, error } = await supabase
        .from('creative_generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching creative history:', error);
        return [];
    }
    return data;
}

export async function markAsPublished(id: string) {
    const { error } = await supabase
        .from('creative_generations')
        .update({ is_published: true })
        .eq('id', id);

    if (error) {
        console.error('Error marking as published:', error);
        return false;
    }
    return true;
}

export async function createMarketingPost(post: any) {
    const { data, error } = await supabase
        .from('marketing_posts')
        .insert([post])
        .select();

    if (error) {
        console.error('Error creating post:', error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}

export async function deleteMarketingPost(id: string) {
    const { error } = await supabase
        .from('marketing_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return false;
    }
    return true;
}

export async function deleteCreativeGeneration(id: string) {
    const { error } = await supabase
        .from('creative_generations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting creative generation:', error);
        return false;
    }
    return true;
}

// ============ PERSONA SETTINGS ============

export interface PersonaSettings {
    id?: string;
    persona_name: string;
    tone: string;
    writing_style: string;
    language_level: string;
    min_length: number;
    max_length: number;
    paragraph_count: number;
    must_include_topics: string[];
    forbidden_elements: string[];
    opening_style: string;
    closing_style: string;
    custom_instructions: string;
    sample_text: string;
    is_active: boolean;
}

export async function getActivePersona(): Promise<PersonaSettings | null> {
    const { data, error } = await supabase
        .from('persona_settings')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching persona:', error);
        return null;
    }
    return data;
}

export async function savePersonaSettings(settings: Partial<PersonaSettings> & { id: string }) {
    const { id, ...rest } = settings;
    const { data, error } = await supabase
        .from('persona_settings')
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error saving persona:', error);
        return null;
    }
    return data && data[0] ? data[0] : null;
}
