import { ref } from "vue";
import { session } from "~/assets/js/sessionKey";

export interface Docent {
    id: number;
    username: string;
}

export const useDocenten = () => {
    const docenten = ref<Docent[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Get session key from the existing session utility
    const getSessionKey = () => {
        // Ensure session key is set (only on client side)
        if (typeof window !== "undefined") {
            if (!session.key) {
                session.setKey();
            }
            return session.key;
        }

        return "default-session-key";
    };

    const loginDocent = async (username: string, password: string): Promise<Docent> => {
        loading.value = true;
        error.value = null;
        
        try {
            const sessionKey = getSessionKey();
            const docent = await $fetch<Docent>(
                `/api/docent/login?s=${sessionKey}`,
                {
                    method: "POST",
                    body: { username, password },
                }
            );
            return docent;
        } catch (err: any) {
            error.value = err.message || "Failed to login docent";
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading: readonly(loading),
        error: readonly(error),

        // Actions
        loginDocent,
    };
}